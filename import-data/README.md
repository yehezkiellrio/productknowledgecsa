# CSAP Product Import Workflow

Reusable pipeline untuk import product data dari CSV → Supabase `products` table.

## Struktur folder

```
import-data/
├── README.md                   ← dokumentasi workflow (file ini)
├── brands/
│   └── <brand-id>/
│       ├── series.csv          ← context series-level (committed)
│       ├── sku.csv             ← SKU-level data source (committed)
│       ├── insert.sql          ← generated SQL (git-ignored)
│       └── notes.md            ← edge cases + manual verification (committed)
└── templates/                  ← optional: blank CSV skeletons
```

`insert.sql` di-exclude via `.gitignore` (`import-data/brands/**/insert.sql`) karena
regenerate-able dan di-run manual di Supabase SQL Editor.

## CSV format

**series.csv** (context, tidak di-insert):
`brand, product_name, category, size, design_type, description/specification, target_market`

**sku.csv** (di-insert ke `products`):
`sku, product_name, size, series/design, color, finish/type, description/specification, notes`

## Mapping rules (CSV → products)

| products column | Source | Transformation |
|---|---|---|
| `id` | derive | `{brand-id}-{sku-lowercase-dash}` |
| `brand_id` | static | brand folder name, match `brands.id` |
| `code` | `sku.csv:sku` | as-is |
| `name` | `sku.csv:product_name` | trim |
| `size` | `sku.csv:size` | as-is (multi-size flagged di notes.md) |
| `series` | `sku.csv:series/design` | normalize pattern consistency |
| `finish` | `sku.csv:finish/type` | as-is |
| `subcategory` | `sku.csv:color` | as-is |
| `category` | brand-specific | Arwana=`Keramik`, Mowilex=`Cat`, etc. |
| `description` | combine | `description/specification` + ` · ` + `notes` (jika ada) |
| `face_type` | derive | dari series.csv design_type |
| `photo_url` | null | edit manual via admin |
| `is_active` | **FALSE** | review-first, manual activate |
| `sort_order` | enumerate | 10, 20, 30... urutan CSV |
| price fields | null | edit manual |
| `stock_status` | default | `available` |

## Workflow per brand

1. Drop `series.csv` + `sku.csv` ke `import-data/brands/<brand-id>/`
2. Minta Claude Code: "Import brand [nama]. CSV ada di import-data/brands/[brand-id]/"
3. Claude read + validate + summarize ke user
4. **Wait for user approval**
5. Generate `insert.sql` + `notes.md`
6. User run SQL di Supabase SQL Editor manual
7. Review di admin panel → upload photo → set harga → activate

## SQL output structure

- Header comment: brand, generated date, SKU count, source
- `begin;` transaction wrapper
- Guard: raise exception kalau `brand_id` gak exists
- `INSERT ... ON CONFLICT (id) DO NOTHING` untuk idempotency
- Verify: `select count(*)` vs target
- `commit;`

## Hal yang gak boleh dilakukan

- ❌ Auto-activate (is_active=true) tanpa review manual
- ❌ Generate harga
- ❌ Download/generate foto
- ❌ Commit `insert.sql` ke git
- ❌ Run SQL ke Supabase otomatis — user run manual
- ❌ Guess field kalau ambigu — flag di `notes.md`

## Brands processed

| Brand | Status | SKU count | Date |
|---|---|---|---|
| arwana | generated, pending SQL run | 18 | 2026-04-19 |
