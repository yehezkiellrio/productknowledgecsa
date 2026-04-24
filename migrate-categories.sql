-- ============================================================
-- CSA Brand Category Migration
-- Update division field dari 'Divisi 1/2/3/4' ke 'Housebrand'
-- atau 'Local Brand' sesuai data resmi CSA.
--
-- CARA PAKAI:
-- 1. Buka Supabase Dashboard → SQL Editor
-- 2. Paste script ini dan Run
-- 3. Cek hasil di bagian bawah (SELECT verify)
--
-- PENTING: Cek nama brand di bawah — harus EXACT MATCH
-- dengan kolom `label` di tabel `brands`.
-- Kalau ada beda penulisan, sesuaikan nama di sini.
-- ============================================================

-- ── HOUSEBRAND (9 brand milik CSA) ─────────────────────────
UPDATE brands SET division = 'Housebrand'
WHERE label IN (
  'Ceranosa',
  'Eden',
  'Franco',
  'Sterlyn',
  'Volk',
  'Salvador',
  'Salvadore',
  'Casania',
  'Casania Floor',
  'Rixo',
  'Vastania'
);

-- ── LOCAL BRAND (21 brand partner distribusi) ──────────────
UPDATE brands SET division = 'Local Brand'
WHERE label IN (
  'Ace Oldfields',
  'APlus',
  'Arwana',
  'UNO',
  'Cotto',
  'Dura Roof',
  'Kanmuri',
  'Knauf',
  'Mortar Utama',
  'Mowilex',
  'Propan',
  'Supralite',
  'Arna',
  'Mulia Glassblock',
  'Global',
  'Cosmos',
  'SI Anti Rayap',
  'Paku',
  'Timmerman',
  'Duratruss',
  'Blesscon'
);

-- ── VERIFY HASIL ────────────────────────────────────────────
-- Jalankan ini setelah UPDATE untuk konfirmasi:
SELECT division, COUNT(*) as total
FROM brands
GROUP BY division
ORDER BY division;

-- Untuk lihat brand mana yang belum di-assign:
SELECT id, label, division
FROM brands
WHERE division IS NULL OR division NOT IN ('Housebrand', 'Local Brand')
ORDER BY label;
