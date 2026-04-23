# Arwana Import Notes

Source: `sku.csv` (18 SKU) + `series.csv` (6 series context rows)
Generated: 2026-04-19

## Edge cases flagged

- [ ] **Multi-size `20x20 / 25x25 cm` (10 SKU)** — kept as-is per user decision. Kalau
      di admin panel ternyata customer butuh filter per ukuran, split jadi 2 SKU per size.
      Affected SKUs:
      - AR-2323-BG, AR-2597-BG, AR-2727-BG, AR-2797-BG, AR-2929-BG (Plain/Basic Beige)
      - AR-2028-GY (Plain/Grey)
      - AR-2718-PK (Plain/Pink)
      - AR-2563-GN (Plain/Green)
      - AR-HAVANA-BG (Rustic/Pattern Beige)
      - AR-2867-BK (Plain/Black)

- [x] **Series normalization — `AR-2867-BK`**: original CSV value `Dark/Plain`
      di-normalize ke `Plain/Black` untuk konsistensi pattern dengan series lain
      (`Plain/Grey`, `Plain/Pink`, `Plain/Green`, `Plain/Basic`). Approved by user.

- [ ] **Compound finish `Glossy/Decorative` (AR-DIG-TAHITI-BN)** — disimpan as-is.
      Satu-satunya SKU dengan finish majemuk. Kalau filter UI butuh finish tunggal,
      pertimbangkan split jadi 2 kolom atau ambil yang pertama (`Glossy`).

- [ ] **Duplicate product_name lintas SKU (intentional)** — bukan error, batch berbeda:
      - "Arwana Marble Cream 88858/88838/88828" (3 SKU, code beda)
      - "Arwana Marble Grey 88838/88828/88818" (3 SKU, code beda)
      Detail visual pattern belum di-describe di CSV → perlu cek katalog fisik
      untuk bedain waktu customer tanya.

- [ ] **Series.csv punya `Arwana Embossed Tile`** tapi gak ada SKU matching di sku.csv.
      Kemungkinan embossed SKU belum di-input, atau di-drop dari katalog.
      Confirm dengan sumber data.

## Manual verification needed (post-import)

- [ ] Run `insert.sql` di Supabase SQL Editor
- [ ] Verify count: `select count(*) from products where brand_id = 'arwana'` = 18
- [ ] Upload foto untuk 18 SKU via admin panel
- [ ] Set harga + price_note manual
- [ ] Review description, edit kalau perlu
- [ ] Set `is_active = true` setelah semua data final
- [ ] Test search di https://productknowledgecsa.vercel.app/ — cari "Arwana", "Marble Cream", "88858"

## Data quality observations

- Semua 18 SKU punya `notes` column terisi → description = `spec + " · " + notes`
- Tidak ada SKU duplicate (18 unique codes)
- Tidak ada missing required field (product_name, size, series/design, color, finish semua terisi)
- ID generation pattern uniform: `arwana-{sku-lowercase}`
