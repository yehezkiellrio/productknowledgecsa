# CSAP Product Knowledge — Mobile Responsive Fix

## Context

Website: https://productknowledgecsa.vercel.app/
Repo: https://github.com/yehezkiellrio/productknowledgecsa
Stack: plain HTML/CSS/JS, Supabase, single-page. File entry: `index.html`. Styles di `assets/css/{base,layout,components,playbook}.css`.

Fase 1 & 2 sudah beres (refactor multi-file, playbook ke Supabase). **Sekarang hanya fokus fix mobile responsiveness.** Jangan sentuh logic apapun, jangan ubah data, jangan tambah fitur baru — murni CSS + minor HTML adjustments untuk responsive.

## Masalah Konkret (hasil testing user di HP)

1. **Sidebar kegedean** — makan 60%+ layar di mobile, ngepush konten produk ke bawah. Saat ini `width: 220px; min-width: 220px;` selalu tampil, tidak collapse.
2. **Header overflow parah** — logo + search bar + tombol (Spek Keramik, Sales Playbook, produk count badge) dijejer horizontal pakai flex, gak muat di layar HP. Akibatnya **tombol "Sales Playbook" hilang** (ter-clip di kanan), search bar juga kepotong.
3. **Tombol-tombol di header terlalu rapat** — kepencet-pencet waktu coba tap karena gak ada spacing yang cukup di layar kecil.
4. **Admin panel** — tidak dikeluhkan, tapi tetap pastikan usable (tidak regress).
5. **Grid produk & modal playbook** — tidak dikeluhkan oleh user di HP, tapi pastikan tidak regress saat perubahan.

## Scope Fix

### Priority 1 — Sidebar jadi off-canvas drawer di mobile

**Breakpoint:** `<= 768px` (tablet & phone)

**Behavior:**
- Sidebar default **hidden** (translateX(-100%)).
- Tambah **hamburger button** (icon `☰` atau SVG 3-line) di header kiri, sebelum logo atau menggantikan logo (kalau logo kepotong, mending taruh hamburger sebelah kiri, logo tetap di tengah atau disingkat).
- Klik hamburger → sidebar slide in dari kiri, overlay gelap semi-transparan (`rgba(0,0,0,0.5)`) di atas main content. Klik overlay → close sidebar.
- Klik brand di sidebar → auto-close sidebar (user experience: pilih brand, drawer tutup, langsung liat produk).
- Transition smooth: `transform 0.25s ease`.
- Di desktop (`> 768px`), sidebar tetap tampil statis seperti sekarang — jangan ubah UX desktop.

**Technical notes:**
- Gunakan CSS class `.sidebar-open` yang di-toggle via JS.
- Hamburger button di-hide di desktop (`@media (min-width: 769px) { .hamburger { display: none; } }`).
- Z-index sidebar harus di atas overlay, overlay di atas main content.
- Body `overflow: hidden` saat drawer kebuka biar gak dobel scroll.

### Priority 2 — Header responsive

**Breakpoint:** `<= 640px` (phone)

**Problem:** Flexbox header `#hdr` (logo + search + tombol Spek Keramik + Sales Playbook + produk badge) overflow di mobile.

**Solution:**
- **Logo** — di mobile, kecilin font (dari `17px` → `14px`) dan hide subtitle "Product Knowledge" (class `.logo span`). Cukup "CSAP" doang di mobile.
- **Search bar** — di mobile, **pindahkan ke bawah header** (row kedua) supaya full width. Jangan di-hide. ATAU: tetap di header tapi jadi icon search, klik → expand ke full-width input (opsional, lebih ribet; pilih opsi mana yang kode-nya lebih simpel).
- **Tombol Spek Keramik & Sales Playbook** — di mobile, ubah jadi **icon-only button** (pakai icon emoji yang sudah ada: 📐 dan 📋), hide text labelnya. Tap target minimum 44×44px.
- **Produk badge (count)** — di mobile, pindahkan ke breadcrumb/page header (section `#bh`) saja, hide dari header. Atau kecilkan jadi simbol ringkas.
- **Hamburger button** — di mobile, tampil di paling kiri, ukuran minimum 44×44px.

Layout mobile header yang diharapkan:
```
[☰] [CSAP]                [📐] [📋]
[🔍 Search input full-width.........]
```

### Priority 3 — Tap targets minimum 44×44px

Standard iOS/Material mobile:
- Semua tombol (hamburger, Spek Keramik, Sales Playbook, tombol close modal, tombol admin, dll) minimum **44×44px** area tap-nya di mobile.
- Kalau icon-only, wrapper button-nya 44×44px walau icon sendiri kecil.
- Spacing antar tombol minimum 8px.

### Priority 4 — Font size readability

- Di mobile (`<= 640px`), pastikan body text minimum `14px` (sekarang 14px, OK).
- Heading `h2` di section header (`#bh h2`) yang sekarang `18px` — tetap OK, tapi cek kalau kepotong di layar kecil, kasih `word-wrap: break-word`.
- Modal content (playbook tables, cards) — pastikan tidak overflow horizontal. Kalau tabel kepanjangan, buat wrapper dengan `overflow-x: auto` dan visual hint scroll-nya (shadow di kanan).

## Non-Goals — Jangan Dilakukan

- ❌ Jangan ubah warna / theme / font family
- ❌ Jangan ubah struktur data atau query Supabase
- ❌ Jangan tambah library baru (CSS/JS)
- ❌ Jangan refactor JS logic yang tidak terkait responsive
- ❌ Jangan ubah desktop layout (breakpoint `> 768px` harus tetap identik dengan sekarang)
- ❌ Jangan menerapkan dark mode toggle atau fitur baru lain — cuma responsive fix

## Testing Checklist

Setelah selesai, claim selesai hanya jika semua ini lolos (test via Chrome DevTools responsive mode, minimal 3 breakpoint):

### Mobile — iPhone SE (375×667)
- [ ] Hamburger button terlihat dan tap-able (44×44 minimum)
- [ ] Sidebar hidden by default
- [ ] Klik hamburger → sidebar slide in smooth
- [ ] Klik overlay → sidebar close
- [ ] Klik brand di sidebar → auto-close & produk muncul di main
- [ ] Header: logo tidak kepotong, semua tombol visible (icon-only), search bar visible (full-width row 2 atau expandable)
- [ ] Tombol Sales Playbook bisa diklik (sebelumnya hilang!)
- [ ] Modal Sales Playbook bisa kebuka, tab divisi navigable

### Mobile — iPhone 14 Pro (393×852)
- [ ] Semua behavior di atas konsisten

### Tablet — iPad Mini (768×1024)
- [ ] Sidebar masih drawer mode (kalau strict `<= 768px`) — OK
- [ ] Atau sidebar auto-show jika diubah breakpoint ke `< 768px` — sesuaikan preferensi

### Desktop — 1280+
- [ ] Persis seperti sekarang, tidak regress sama sekali
- [ ] Hamburger hidden
- [ ] Sidebar tampil statis 220px

## Definition of Done

1. Perubahan hanya di file CSS (`assets/css/layout.css` dan/atau `assets/css/base.css`) + minor HTML di `index.html` (tambah hamburger button, wrapper untuk search mobile).
2. Mungkin perlu sedikit JS di `assets/js/ui.js` atau `assets/js/main.js` untuk toggle sidebar class — pertahankan sestyle existing.
3. Semua checklist di atas lolos.
4. Commit message jelas: `fix(mobile): sidebar drawer + responsive header`
5. Push ke branch baru `fix/mobile-responsive`, bukan main langsung — biar user bisa review di Vercel preview dulu.

## Cara Kerja

1. Baca `index.html`, `assets/css/base.css`, `assets/css/layout.css`, `assets/css/components.css` dulu.
2. Rangkum plan ke user sebelum mulai coding — list file yang akan diubah dan perubahan inti di setiap file.
3. Setelah user approve plan, baru eksekusi.
4. Selesai coding → push ke branch `fix/mobile-responsive` → kasih link Vercel preview ke user.
5. Setelah user confirm di HP-nya, baru merge ke main.
