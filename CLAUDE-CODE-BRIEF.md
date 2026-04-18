# CSAP Product Knowledge — Claude Code Brief

> **Instruction untuk Claude Code:** Kamu akan me-refactor, memperbaiki, dan meng-upgrade sebuah single-file web app (`index.html`, ~1716 lines) yang berfungsi sebagai katalog produk + sales playbook internal untuk perusahaan CSAP (distributor bahan bangunan, 4 divisi, 30+ brand). User adalah Management Trainee (MT) Sales Supervisor yang sedang belajar product knowledge untuk Divisi 3 (Flooring & Ceramic) dan Divisi 4 (Structural & Heavy Tools). Website existing: https://productknowledgecsa.vercel.app/
>
> Kerjakan dalam **5 fase** di bawah ini, konfirmasi ke user di akhir setiap fase sebelum lanjut. Jangan bundle semua fase jadi satu big-bang change.

---

## 📌 Context — Apa yang ada sekarang

**File:** single `index.html` (~1716 baris), inline CSS + JS, pakai Supabase JS SDK v2 via CDN.

**Stack:**
- Plain HTML/CSS/JS (no framework)
- Supabase (Postgres + Storage) untuk brand, produk, katalog PDF
- Google Fonts: Outfit
- Dark theme, purple + gold accent

**Fitur existing:**
1. **Katalog Produk** — sidebar brand list per divisi, grid produk dengan foto, spesifikasi, search
2. **Admin Panel** — auth via PIN 8-digit (hardcoded), CRUD brand/produk/katalog, upload logo & foto ke Supabase Storage
3. **Modal "Spek Keramik CSAP"** — e-catalog keramik/granit (static atau dari DB, cek implementasinya)
4. **Modal "Sales Playbook"** — tabs: Executive, Divisi 1-4, Cross-Selling, Cheatsheet. Isi: market gap analysis, killer arguments, bundling packages. **Semuanya hardcoded di HTML.**

**Tabel Supabase yang ada:**
- `brands` — (id, label, division, website, description, logo_url, type, flipbook_url, sort_order, is_active)
- `products` — (id, brand_id, category, code, name, subcategory, series, finish, size, face_type, description, photo_url, is_active)
- `catalogs` — (id, brand, title, description, file_url, pages, sort_order, is_active)

**Credentials (ada di file):** `SB_URL`, `SB_KEY` (anon), `PIN = '10102001'`, bucket `products` & `brands`.

---

## 🐛 Known Issues yang Harus Diperbaiki

### Critical
1. **Security — PIN hardcoded:** PIN admin `10102001` di-hardcode di JavaScript. Siapapun bisa inspect source dan dapet PIN-nya. **HARUS diganti** ke solusi yang lebih aman (lihat Fase 4).
2. **Security — Supabase anon key publik:** Secara teknis OK karena anon key memang untuk frontend, TAPI pastikan RLS (Row Level Security) di Supabase aktif untuk semua tabel. Minta user cek RLS policies dan bantu buatkan SQL-nya kalau belum ada.

### Data Inconsistency
3. **Franco nyantol di Divisi 1 (admin panel):** Di hardcoded playbook, Franco sudah benar di Divisi 4 (line 713). Tapi di **data Supabase table `brands`**, field `division` untuk brand Franco ter-set sebagai `Divisi 1`. User akan fix manual via admin panel. **Tambah validation check** — buatkan query SQL yang bisa user jalankan di Supabase untuk cek konsistensi data:
   ```sql
   -- Detect brands with suspicious division assignment
   -- (cross-check against hardcoded playbook expectations)
   ```

### Hardcoded Content = Maintenance Nightmare
4. Playbook (market gap analysis, killer arguments, bundling packages, cheatsheet) semua di-hardcode di HTML. Kalau CSAP nambah/revisi strategi, user harus edit HTML langsung. **Solusi: pindahkan ke Supabase tables** sehingga bisa di-manage via admin panel. (Lihat Fase 2.)

### UX Friction
5. File 1716 baris single HTML — hard to maintain, no code splitting.
6. Search bar ada tapi cuma filter produk, gak cari di playbook.
7. Mobile responsiveness belum dicek thorough — sidebar 220px width mungkin kecil di tablet, pasti masalah di phone.
8. Tidak ada loading states yang konsisten — ada `<div class="ldg">` di beberapa tempat tapi gak merata.
9. Admin panel modal padat banget, form panjang ke bawah, tidak ada sectioning yang jelas.

---

## 🎯 Upgrade Goals — 5 Fase

### FASE 1 — Stabilisasi & Refactor Foundation

**Tujuan:** Bikin codebase maintainable dulu sebelum nambah fitur.

**Tasks:**
1. **Split single `index.html`** jadi struktur:
   ```
   /
     index.html
     /assets
       /css
         base.css      (variables, reset, typography)
         layout.css    (header, sidebar, main)
         components.css (cards, buttons, modals, tables)
         playbook.css  (playbook-specific styles)
       /js
         config.js     (Supabase config — GUNAKAN PLACEHOLDER, JANGAN HARDCODE KEY ASLI)
         supabase.js   (client init, helper queries)
         state.js      (global state management)
         ui.js         (DOM helpers, render functions)
         admin.js      (admin panel logic)
         catalog.js    (product catalog logic)
         playbook.js   (playbook rendering)
         search.js     (search logic)
         main.js       (init & event binding)
   ```
2. **Environment config:** Buat `config.example.js` dengan placeholder, `config.js` di `.gitignore`. Di `config.js` user mengisi `SB_URL`, `SB_KEY`, dll.
3. **Jangan ubah tampilan dulu** — preservasi UI existing 100%. Tujuan fase ini murni structural.
4. **Dokumentasi:** Buat `README.md` yang menjelaskan struktur file, cara setup, cara deploy.
5. **Fix minor bugs yang ketemu di refactor** (misal inconsistent escape, unused vars, etc.)

**Acceptance:**
- Website berjalan identik dengan versi sebelum refactor
- Semua file modular, import/load dengan benar
- README jelas

**⚠️ Konfirmasi user sebelum lanjut Fase 2.**

---

### FASE 2 — Migrasi Playbook dari Hardcoded ke Supabase

**Tujuan:** Semua konten playbook (yang sekarang hardcoded) jadi dinamis, bisa di-edit via admin panel.

**Tasks:**
1. **Buat schema baru di Supabase:**
   ```sql
   -- Executive summary per division
   create table playbook_divisions (
     id uuid default gen_random_uuid() primary key,
     division_no int not null,             -- 1, 2, 3, 4
     title text not null,                  -- e.g. "Finishing & Luxury Living"
     tagline text,                         -- short description
     key_takeaway text,                    -- executive summary bullet
     created_at timestamptz default now()
   );

   -- Market gap analysis rows (per brand)
   create table playbook_gap_analysis (
     id uuid default gen_random_uuid() primary key,
     brand_id uuid references brands(id) on delete cascade,
     threat_level text check (threat_level in ('LOW','MEDIUM','MEDIUM-HIGH','HIGH','VERY HIGH')),
     opportunity_level text check (opportunity_level in ('LOW','MEDIUM','HIGH','VERY HIGH')),
     note text,
     sort_order int default 0
   );

   -- Killer arguments
   create table playbook_killer_args (
     id uuid default gen_random_uuid() primary key,
     brand_id uuid references brands(id) on delete cascade,
     vs_competitor text not null,          -- e.g. "Mulia/Platinum"
     argument_text text not null,
     sort_order int default 0
   );

   -- Bundling packages
   create table playbook_packages (
     id uuid default gen_random_uuid() primary key,
     package_name text not null,           -- e.g. "PAKET 1 — Rumah Subsidi"
     target_segment text,
     selling_point text,                   -- the 💬 quote
     sort_order int default 0
   );
   create table playbook_package_items (
     package_id uuid references playbook_packages(id) on delete cascade,
     brand_id uuid references brands(id),
     custom_label text,                    -- fallback if brand_id null
     sort_order int default 0
   );
   ```
2. **RLS policies:** Read public, write hanya untuk authenticated user dengan role admin (akan disempurnakan di Fase 4).
3. **Migration script:** Buat file `migrate-playbook.sql` yang berisi INSERT statements untuk seed data dari HTML existing. (Parse data dari HTML lama, jangan hardcode ulang — gunakan brand names untuk FK lookup.)
4. **Update admin panel:** Tambah tab "📋 Playbook" dengan sub-tabs per entity (Gap Analysis, Killer Args, Packages).
5. **Update playbook rendering:** Load dari Supabase alih-alih render hardcoded HTML.

**Acceptance:**
- Playbook tampilan sama dengan sebelumnya, tapi data dari DB
- Admin bisa edit setiap item lewat panel
- Migration SQL idempotent (bisa di-run ulang tanpa duplicate)

**⚠️ Konfirmasi user sebelum lanjut Fase 3.**

---

### FASE 3 — Content & UX Upgrade

**Tujuan:** Angkat value dari tool buat belajar product knowledge, bukan cuma display info.

**Tasks:**
1. **Mode toggle di header:** "📦 Catalog Mode" vs "🎓 Learning Mode"
2. **Learning Mode — Flashcard tab:**
   - Satu kartu per brand di divisi yang dipilih
   - Depan: nama brand + logo + divisi badge
   - Belakang (revealed on click): killer arguments, threat/opportunity, vs kompetitor utama
   - Navigation: prev/next, shuffle, mark "hafal" / "belum"
   - Progress indicator
   - State tersimpan di `localStorage` (per-user, anonymous)
3. **Learning Mode — Battle Card tab:**
   - Scenario-based: "Toko bilang: '_[objection]_', kamu jawab:"
   - Objections di-generate dari playbook (e.g. "Kompetitor X lebih murah" → show relevant killer argument)
   - User coba jawab dulu (textarea), lalu reveal jawaban model dari playbook
   - Objective: latihan spontaneity, bukan hafalan template
4. **Learning Mode — Quick Quiz:**
   - 10 soal random per sesi
   - Multiple choice (generated dari data: "Brand mana di Divisi 3 yang punya threat level HIGH?" dengan distraktor dari brand lain)
   - Skor + review di akhir
5. **Search upgrade:** Global search yang nyari di produk DAN playbook (killer args text, notes, package items). Highlight match di UI.
6. **Cross-sell recommender (bonus):** Di halaman brand, tampilkan "Sering di-bundle dengan" berdasarkan `playbook_package_items` — join brand yang sering muncul bersamaan.
7. **Mobile responsive audit:** Pastikan sidebar collapse jadi hamburger di <768px, modal full-screen di <480px, font size naik, tap targets minimum 44px.
8. **Loading states konsisten:** Skeleton screens untuk list brand & grid produk. Spinner standar untuk actions (save, upload).
9. **Empty states yang helpful:** Kalau belum ada data, kasih CTA jelas (misal "Belum ada produk. Tambah produk baru →" kalau user admin).

**Acceptance:**
- Mode toggle smooth, state terpreservasi
- 3 learning feature berfungsi end-to-end
- localStorage progress tersimpan
- Mobile usable (test di DevTools responsive)

**⚠️ Konfirmasi user sebelum lanjut Fase 4.**

---

### FASE 4 — Security Hardening

**Tujuan:** Pindah dari PIN hardcoded ke proper auth. Kunci RLS.

**Tasks:**
1. **Ganti PIN auth → Supabase Auth:**
   - Implement magic link atau email+password login
   - Buat tabel `user_roles (user_id uuid, role text check (role in ('admin','editor','viewer')))` untuk role management
   - Admin panel hanya bisa diakses user dengan role 'admin' atau 'editor'
   - Sign out button
2. **RLS policies lengkap:**
   ```sql
   -- Read public untuk brands/products/catalogs (biar website publik bisa akses)
   -- Write hanya untuk authenticated user dengan role admin/editor
   -- (Buat policy SQL file lengkap, siap di-run oleh user)
   ```
3. **Migrasi transisi:** Karena user sudah punya 1 admin pake PIN, buat flow migrasi — first login via email akan di-promote jadi admin (dengan konfirmasi).
4. **Audit log (optional):** Tabel `audit_logs` untuk track CRUD actions di admin panel. Kalau nambah complexity terlalu banyak, skip.
5. **Rotate credentials:** Reminder ke user: setelah deploy, generate anon key baru di Supabase → update `config.js` → deploy ulang. (Anon key lama sudah pernah shared di chat / file yang di-share.)

**Acceptance:**
- Tidak ada credential/PIN hardcoded di source
- RLS policies aktif di Supabase, unauthenticated request tidak bisa write
- Role-based access kerja dengan benar
- Dokumen migrasi jelas di README

**⚠️ Konfirmasi user sebelum lanjut Fase 5.**

---

### FASE 5 — Polish & Deploy

**Tujuan:** Final pass, siap deploy ulang.

**Tasks:**
1. **Performance:** Lazy load images (brand logos, product photos). Cache Supabase queries selama 5 menit di sessionStorage.
2. **Accessibility:** Semantic HTML (`<nav>`, `<main>`, `<aside>`), ARIA labels di icon buttons, keyboard nav untuk modal & tabs, focus trap di modal, color contrast minimum WCAG AA.
3. **Meta tags:** Proper `<meta>` description, OG tags untuk share-ability. Favicon.
4. **Error handling comprehensive:** Semua Supabase call dibungkus try/catch dengan user-friendly error message. Toast notification system (bukan `alert()`).
5. **Keyboard shortcuts (bonus):**
   - `/` — focus search
   - `Esc` — close modal
   - `a` — admin (kalau logged in)
   - `?` — show shortcuts help
6. **Dark/light theme toggle (bonus):** Gunakan CSS variables yang sudah ada, cukup switch `:root` class.
7. **Test di production:** Vercel preview deployment, test semua flow.
8. **Update README** dengan changelog fase 1-5.

**Acceptance:**
- Lighthouse score minimal 85 di semua kategori
- Zero console errors
- Mobile & desktop keduanya smooth
- Ready deploy ke Vercel production

---

## 📝 Design Principles (jangan dilanggar)

1. **Preserve existing aesthetic:** Dark theme, purple (#7c5cdb) + gold (#e4a84a) accent, Outfit font. Jangan ganti identity visual.
2. **No new frameworks:** Tetap vanilla JS. Kalau butuh utility, boleh CDN-load library ringan (e.g. `tippy.js` untuk tooltip), tapi no React/Vue.
3. **Mobile-first mindset:** Semua feature baru harus usable di mobile.
4. **Bahasa Indonesia casual:** UI copy pakai bahasa Indonesia yang relatable untuk sales team di lapangan (sama seperti playbook existing — "toko", "margin gendut", "fight di harga", dll.)
5. **User is an MT:** Feature design harus bantu belajar, bukan cuma display. Active recall > passive reading.

---

## 🚧 Hal yang JANGAN dilakukan

- ❌ Jangan commit file `config.js` dengan credential asli — hanya `config.example.js`
- ❌ Jangan hapus data atau kolom Supabase tanpa konfirmasi user
- ❌ Jangan ganti Supabase ke database lain
- ❌ Jangan tambah tracking/analytics pihak ketiga tanpa bilang user
- ❌ Jangan push ke production / git sebelum user approve
- ❌ Jangan bundle semua fase dalam 1 big PR — fase per fase, konfirmasi dulu

---

## 🤝 Cara Kerja dengan User

- User: Rio, MT Sales Supervisor CSAP, native Bahasa Indonesia
- Gaya: langsung, praktis, suka tau reasoning di balik keputusan
- Komunikasi: Bahasa Indonesia casual, jelasin trade-off kalau ada multiple pendekatan
- Selalu konfirmasi scope sebelum eksekusi besar

---

## ✅ Checklist Sebelum Mulai

Claude Code, sebelum mulai kerja:
1. [ ] Baca file `index.html` original secara lengkap
2. [ ] Cek struktur tabel Supabase existing (user bisa kasih export atau kamu query langsung)
3. [ ] Konfirmasi plan Fase 1 ke user (gak usah start langsung)
4. [ ] Setup git repo kalau belum ada
5. [ ] Baru mulai.

Good luck. 🚀
