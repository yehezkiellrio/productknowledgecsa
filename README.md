# CSAP Product Knowledge

Katalog produk + Sales Playbook internal CSAP — 4 divisi, 30+ brand bahan bangunan.

## Setup

1. **Clone / download repo**

2. **Buat config:**
   ```bash
   cp assets/js/config.example.js assets/js/config.js
   ```
   Buka `assets/js/config.js`, isi `SB_URL` dan `SB_KEY` dari Supabase dashboard.

3. **Buka `index.html`** di browser (atau deploy ke Vercel).

## Struktur File

```
/
  index.html              ← HTML utama
  assets/
    css/
      base.css            ← CSS variables, reset, typography
      layout.css          ← Header, sidebar, main layout
      components.css      ← Cards, modals, forms, buttons, tables
      playbook.css        ← Playbook-specific styles
    js/
      config.example.js   ← Template config (safe to commit)
      config.js           ← Credentials asli (GITIGNORED)
      state.js            ← Global state object
      supabase.js         ← Supabase client init
      ui.js               ← esc(), toast(), modal helpers
      catalog.js          ← Brand & product display logic
      search.js           ← Search/filter logic
      admin.js            ← Admin panel CRUD + upload
      playbook.js         ← Playbook tab rendering
      spek.js             ← Spek Keramik / catalog PDF viewer
      main.js             ← init() & event binding
```

## Supabase Tables

### brands
```sql
create table brands (
  id uuid default gen_random_uuid() primary key,
  label text not null,
  division text,
  website text,
  description text,
  logo_url text,
  brand_type text default 'products',
  flipbook_url text,
  sort_order int default 0,
  is_active bool default true,
  created_at timestamptz default now()
);
```

### products
```sql
create table products (
  id uuid default gen_random_uuid() primary key,
  brand uuid references brands(id) on delete cascade,
  cat text,
  product_code text,
  name text not null,
  subcategory text,
  series text,
  finish text,
  size text,
  face_type text,
  sp text,
  kw text,
  image_url text,
  is_active bool default true,
  created_at timestamptz default now()
);
```

### catalogs
```sql
create table catalogs (
  id uuid default gen_random_uuid() primary key,
  brand text,
  title text,
  description text,
  file_url text,
  pages int,
  sort_order int default 0,
  is_active bool default true,
  created_at timestamptz default now()
);
```

## Deploy ke Vercel

1. Push ke GitHub (pastikan `config.js` tidak ikut — sudah di `.gitignore`)
2. Di Vercel, set **Environment Variables**:
   - Atau: simpan credentials di `config.js` dan exclude dari git, deploy manual via Vercel CLI
3. Deploy otomatis dari branch `main`

## Admin Panel

- Klik **Admin** di sidebar kiri bawah
- Masukkan PIN 8 digit
- Kelola brand, produk, dan katalog PDF
