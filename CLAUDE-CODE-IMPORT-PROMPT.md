# CSAP Product Import — Reusable Workflow

## Mission

Import product data dari CSV files ke Supabase `products` table untuk CSAP Product Knowledge tool. Ini **brand pertama** (Arwana) dari 33 brand — workflow harus **reusable** untuk brand-brand selanjutnya.

## Project Context

- Repo: `productknowledgecsa` (local working directory)
- Stack: plain HTML/JS + Supabase Postgres
- Website live: https://productknowledgecsa.vercel.app/
- Target user: MT Sales Supervisor CSAP (Rio)
- Schema `products` sudah include kolom price/promo/discount (recent migration)

## Task Breakdown

### 1. Setup folder structure (first time only)

Bikin folder `/import-data/` di root project dengan struktur:

```
import-data/
├── README.md              ← dokumentasi workflow (you'll write this)
├── brands/
│   ├── arwana/
│   │   ├── series.csv     ← series-level data (context)
│   │   ├── sku.csv        ← SKU-level data (to import)
│   │   ├── insert.sql     ← generated output
│   │   └── notes.md       ← edge cases, verification notes
│   └── [next-brand]/...
├── scripts/
│   ├── generate-insert.js ← reusable Node script (optional, nice-to-have)
│   └── validate.js        ← pre-import validation
└── templates/
    ├── series-template.csv
    └── sku-template.csv
```

Add `import-data/` ke `.gitignore`? **No, commit semua kecuali:**
- `insert.sql` files (karena hasil generate, akan di-run langsung di Supabase, tidak perlu di git)

Add ke `.gitignore`:
```
import-data/brands/**/insert.sql
```

### 2. Input files (untuk Arwana)

User akan provide:
- `import-data/brands/arwana/series.csv` (6 rows — series level context)
- `import-data/brands/arwana/sku.csv` (18 rows — individual SKUs to import)

**Kolom CSV series.csv:**
`brand, product_name, category, size, design_type, description/specification, target_market`

**Kolom CSV sku.csv:**
`sku, product_name, size, series/design, color, finish/type, description/specification, notes`

### 3. Supabase `products` table schema (target)

```
id              text PK (generate slug dari sku, lowercase, dash-separated)
brand_id        text FK to brands.id (= 'arwana' untuk batch ini)
category        text
code            text (= sku from CSV)
name            text (= product_name from CSV)
subcategory     text
series          text
finish          text
size            text
face_type       text
description     text
photo_url       text (null untuk sekarang — user upload manual later)
is_active       boolean (default: FALSE untuk review-first workflow)
sort_order      int (optional, bisa null)

-- Recent additions
price           numeric(12,2)  -- NULL
price_note      text            -- NULL
promo_price     numeric(12,2)  -- NULL
discount_pct    numeric(5,2)   -- NULL
promo_label     text            -- NULL
promo_starts_at timestamptz    -- NULL
promo_ends_at   timestamptz    -- NULL
stock_status    text           -- default 'available'
```

Existing record structure confirm via query:
```sql
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_name = 'products'
order by ordinal_position;
```

**Important:** Check if `id` kolom ada. Kalau iya dan tipe `text`, generate dari SKU. Kalau `uuid` dengan default, biarin auto.

### 4. Mapping Rules (CSV → Supabase)

| Supabase column | Source | Transformation |
|---|---|---|
| `brand_id` | static | `'arwana'` (lowercase, match brands.id existing) |
| `code` | `sku.csv:sku` | As-is |
| `name` | `sku.csv:product_name` | Trim whitespace |
| `size` | `sku.csv:size` | Keep as-is. Kalau ada "/", flag di notes.md untuk review (e.g. "20x20 / 25x25 cm" = possibly 2 SKUs, keep as-is for now) |
| `series` | `sku.csv:series/design` | Normalize: "Digital Fancy", "Marble", "Plain/Basic", "Plain/Grey", dll |
| `finish` | `sku.csv:finish/type` | "Glossy", "Matte/Texture", dll |
| `subcategory` | `sku.csv:color` | "Cream", "Grey", "Brown", dll (jadi secondary filter) |
| `category` | static | `'Keramik'` (untuk Arwana). Dari series.csv kolom `category` = "Ceramic Tile" |
| `description` | combine | `sku.csv:description/specification` + " · " + `sku.csv:notes` (kalau notes tidak kosong) |
| `face_type` | derive | Dari series.csv: "Floor & Wall Tiles" → `face_type = 'Floor & Wall'`. Kalau gak jelas, NULL |
| `photo_url` | null | Edit manual via admin panel later |
| `is_active` | **FALSE** | Default false → user review via admin panel → activate manual |
| `sort_order` | enumerate | 10, 20, 30... (increments of 10) berdasarkan urutan di CSV |
| Price fields | null | All NULL — edit manual |
| `stock_status` | default | `'available'` |

### 5. Generate insert.sql

Output format: **satu file `insert.sql` per brand**, isi INSERT statement yang:

1. Include header comment dengan metadata (brand, tanggal generate, jumlah SKU, source CSV)
2. Wrap dalam transaction (`begin;` ... `commit;`) biar atomic
3. Pre-check: verify brand_id exists sebelum insert
4. Use `INSERT ... ON CONFLICT DO NOTHING` untuk idempotency (kalau di-run 2x, gak duplicate)
5. Post-insert: verify count

**Contoh output structure:**

```sql
-- ═══════════════════════════════════════════════════════
-- CSAP Products Import — Arwana
-- Generated: 2026-04-20
-- Source: import-data/brands/arwana/sku.csv (18 SKU)
-- Review status: is_active = false (pending manual activation)
-- ═══════════════════════════════════════════════════════

begin;

-- Verify brand exists
do $$
begin
  if not exists (select 1 from brands where id = 'arwana') then
    raise exception 'Brand "arwana" not found in brands table';
  end if;
end$$;

-- Insert products
insert into products (
  id, brand_id, code, name, category, subcategory, series, finish, size, 
  face_type, description, is_active, sort_order, stock_status
) values
  ('arwana-ar-dig-tahiti-bn', 'arwana', 'AR-DIG-TAHITI-BN', 'Arwana Digital Tahiti BN Fancy Brown',
   'Keramik', 'Brown', 'Digital Fancy', 'Glossy/Decorative', '40x40 cm',
   'Floor & Wall',
   'Keramik digital printing dengan motif fancy dekoratif, cocok untuk aksen ruangan · Highlight produk digital series',
   false, 10, 'available'),
  ('arwana-88858-cm', 'arwana', '88858-CM', 'Arwana Marble Cream 88858',
   ...
  )
on conflict (id) do nothing;

-- Verify insert
select count(*) as inserted, 'Target: 18' as target from products where brand_id = 'arwana';

commit;
```

### 6. ID generation rule

Format: `{brand-id}-{sku-lowercase-normalized}`

Contoh:
- SKU `AR-DIG-TAHITI-BN` → id `arwana-ar-dig-tahiti-bn`
- SKU `88858-CM` → id `arwana-88858-cm`
- SKU `88818-GY` → id `arwana-88818-gy`

Normalization: lowercase + replace whitespace with dash, strip non-alphanumeric-dash chars.

### 7. Edge cases to flag in notes.md

Record di `notes.md` file setiap brand:
- Multi-size rows (e.g. "20x20 / 25x25 cm") — possibly should be split into 2 SKUs
- Missing fields
- Duplicate product_name dengan SKU berbeda (e.g. "Arwana Marble Cream 88858" vs "Arwana Marble Cream 88838")
- Ambiguous kategori/series
- Apapun yang membuat Claude Code gak yakin 100%

Format notes.md:
```markdown
# Arwana Import Notes

## Edge cases flagged
- [ ] SKU `AR-2323-BG` size listed as "20x20 / 25x25 cm" — verify if 2 SKUs or 1 ambiguous
- [ ] Series "88858-CM" and "88838-CM" same product name but different SKU — normal (different batch/code)

## Manual verification needed
- [ ] Activate all via admin panel setelah data approved
- [ ] Upload photos untuk 18 SKU
- [ ] Set harga manual
```

### 8. Pre-flight checks

Sebelum generate insert.sql, validate:

1. Brand `arwana` exists di `brands` table (user harus confirm dari Supabase)
2. CSV files readable, no malformed rows
3. Required columns present
4. SKU column tidak duplicate
5. Total rows sesuai expected (18 untuk Arwana)

Kalau ada yang fail, **jangan generate SQL**. Report error ke user.

### 9. Reusable pattern untuk brand selanjutnya

Setelah Arwana selesai, untuk brand selanjutnya workflow:

1. User drop `series.csv` + `sku.csv` ke `import-data/brands/[brand-id]/`
2. User kasih prompt singkat: "Import brand [nama]. CSV ada di import-data/brands/[brand-id]/"
3. Claude Code:
   - Baca CSV
   - Apply same mapping rules (dengan adjustment kalau category beda — e.g. "Cat" untuk Mowilex, "Gypsum" untuk Knauf)
   - Generate insert.sql
   - Generate notes.md

**Factor out** apa yang brand-specific vs universal:

Universal:
- ID generation rule
- Transaction wrapper
- ON CONFLICT handling
- is_active default false
- Price fields null
- Stock status 'available'

Brand-specific (Claude Code tanya user kalau gak jelas):
- Category main (Keramik / Cat / Gypsum / Sanitary / dll)
- Face type mapping
- Subcategory interpretation

## Deliverables untuk Task Ini (Arwana)

1. `import-data/` folder structure created
2. `import-data/brands/arwana/series.csv` + `sku.csv` (copied from user-provided files)
3. `import-data/brands/arwana/insert.sql` generated, 18 INSERT statements
4. `import-data/brands/arwana/notes.md` with edge cases flagged
5. `import-data/README.md` documenting the workflow
6. `.gitignore` update (exclude `**/insert.sql`)
7. **Summary report** to Rio:
   - Total SKU processed: 18
   - Edge cases flagged: [count]
   - Next steps: run SQL di Supabase → review di admin panel → activate

## Jangan dilakukan

- ❌ Jangan auto-activate (is_active=true) tanpa review manual user
- ❌ Jangan generate harga
- ❌ Jangan download/generate foto — kolom photo_url = NULL
- ❌ Jangan commit `insert.sql` ke git (di `.gitignore`)
- ❌ Jangan run SQL ke Supabase langsung — user run manual di SQL Editor
- ❌ Jangan guess field kalau data CSV ambiguous — flag di notes.md

## Workflow Sequence

1. **Read** CSV files, validate structure
2. **Plan**: summarize ke user — apa yang akan di-insert, mapping decisions, edge cases
3. **Wait for approval** dari user sebelum generate SQL
4. **Generate** insert.sql + notes.md
5. **Report** deliverables + next steps

## User Interaction Style

- Bahasa Indonesia casual
- Confirm keputusan ambigu, jangan asumsi sendiri
- Kalau ragu → flag di notes.md, jangan drop data

Good luck. Start dengan read + validate CSV, summarize ke user, tunggu approval sebelum generate SQL.
