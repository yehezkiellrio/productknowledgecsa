-- ══════════════════════════════════════════════════════════
-- CSAP Product Knowledge — Fase 2: Playbook Seed Data
-- Jalankan SETELAH migrate-playbook.sql
-- ══════════════════════════════════════════════════════════

-- ── 1. DIVISIONS ───────────────────────────────────────────
insert into playbook_divisions (division_no, title, tagline, key_takeaway) values
(1, 'Divisi 1: Finishing & Luxury Living',
 null,
 'Arwana & Cotto dua ujung spektrum: mass market vs luxury. Brand paling under-exploited: Sterlyn (water heater) yang bisa nge-gap Ariston di harga.'),
(2, 'Divisi 2: General Hardware & Chemicals',
 'Kuncinya di sini adalah basket size — gimana caranya toko beli nggak cuma 1-2 item tapi sekalian borong banyak SKU dari kita.',
 'Ace Oldfields & Propan duo maut yang harus selalu dipasangkan. SI Anti Rayap punya niche yang sangat defensible. Timmerman punya potensi gede di tren interior modern.'),
(3, 'Divisi 3: Flooring & Ceramic Specialist',
 'Yang bikin beda: kekuatan channel project. Volk didesain buat lawan American Standard di jalur project.',
 'Paling head-to-head sama kompetitor sejenis. Kanmuri genteng keramik premium bisa di-push keras ke developer. Casania Floor vinyl/SPC riding the wave interior trend.'),
(4, 'Divisi 4: Structural & Heavy Tools',
 'Tulang punggung CSAP di project channel. Multi-tier strategy (Knauf premium + APlus mid) nutup dua segmen sekaligus.',
 'Mowilex & Mortar Utama anchor brand. Knauf vs APlus multi-tier smart: good cop-bad cop pricing. Franco gerobak jangan di-underestimate, margin-nya thicc.');

-- ── 2. GAP ANALYSIS ────────────────────────────────────────
-- Divisi 1
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Arwana' limit 1),
        'MEDIUM-HIGH','MEDIUM','Perang harga ketat sama Mulia & Platinum. Brand awareness tertinggi di mass market.',10);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'UNO' limit 1),
        'MEDIUM','HIGH','Segmen dekoratif masih fragmented. Bisa own niche decorative tile.',20);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Arna' limit 1),
        'HIGH','MEDIUM','Roman dGress monster di premium porcelain. Arna fight di value-for-money.',30);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Eden' limit 1),
        'MEDIUM','HIGH','Pasar pintu surprisingly fragmented. Eden bisa grab share kalau availability konsisten.',40);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike '%Mulia%' and label ilike '%glass%' limit 1),
        'LOW','MEDIUM','Market leader, posisi aman. Ancaman cuma impor China yang main harga.',50);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Cotto' limit 1),
        'HIGH','HIGH','TOTO dominan. Tapi Cotto punya positioning import Thailand yang beda.',60);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Sterlyn' limit 1),
        'MEDIUM','VERY HIGH','Hidden gem! Ariston mahal, Rinnai lebih ke gas. Sterlyn bisa own electric water heater mid-premium.',70);

-- Divisi 2
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Global' limit 1),
        'MEDIUM','MEDIUM','Closet economy head-to-head sama Volk. Global = retail, Volk = project channel.',10);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Cosmos' limit 1),
        'HIGH','LOW','Exhaust fan itu Panasonic & KDK territory. Cosmos survive di price-sensitive segment.',20);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'SI' limit 1),
        'LOW','HIGH','Anti rayap niche tapi super sticky. Sekali customer puas, nggak ganti. Defensible banget.',30);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike '%Ace%' limit 1),
        'LOW','MEDIUM','Market leader alat cat. Maintain & bundling sama Propan.',40);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Propan' limit 1),
        'HIGH','HIGH','Cat red ocean. Tapi Propan bisa menang di toko yang udah jual Mowilex sebagai mid-tier complement.',50);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike '%Dura Roof%' limit 1),
        'MEDIUM','MEDIUM','Atap metal cukup commoditized. Jual di ketebalan & garansi.',60);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Timmerman' limit 1),
        'MEDIUM','VERY HIGH','Woodpanel & vinyl lagi booming. Taco dominan tapi Timmerman bisa nge-gap di design premium.',70);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Paku' limit 1),
        'LOW','LOW','Pure commodity play. Volume, harga, availability.',80);

-- Divisi 3
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Volk' limit 1),
        'MEDIUM','HIGH','Sanitary mid-range buat project. Harga bikin developer senyum.',10);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Ceranosa' limit 1),
        'MEDIUM','MEDIUM','Granite tiles mid segment. Diferensiasi lewat design & ukuran variatif.',20);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike '%Casania%' limit 1),
        'MEDIUM','VERY HIGH','Vinyl/SPC lagi trend gila-gilaan. Market masih growing.',30);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Salvador' limit 1),
        'MEDIUM','MEDIUM','Head-to-head sama Valentino Gress & QnQ. Cari niche di motif/ukuran.',40);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Kanmuri' limit 1),
        'LOW-MED','HIGH','Genteng keramik premium. Reputasi durabilitas. Developer menengah-atas = target.',50);

-- Divisi 4
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Mowilex' limit 1),
        'HIGH','HIGH','Premium cat, head-to-head Dulux & Jotun. Punya loyalis kuat & eco-friendly positioning.',10);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike '%Mortar%' limit 1),
        'LOW','HIGH','Market leader mortar instan. Posisi kuat. Expand product line = lebih dominan.',20);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Duratruss' limit 1),
        'MEDIUM','MEDIUM','Baja ringan commoditized. TASO market leader. Menang di trust & kalkulasi teknis.',30);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Knauf' limit 1),
        'MEDIUM','HIGH','Gypsum premium global. Own premium segment: peredam suara, tahan air, fire-rated.',40);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'APlus' limit 1),
        'MEDIUM','MEDIUM','Gypsum & mortar mid-tier. Good cop dari Knauf.',50);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Blesscon' limit 1),
        'MEDIUM','MEDIUM','Bata ringan mid/economy. Hebel king of mindshare. Fight di harga & availability.',60);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Franco' limit 1),
        'LOW','HIGH','Gerobak sorong margin surprisingly bagus. Nggak ada kompetitor dominant.',70);
insert into playbook_gap_analysis (brand_id, threat_level, opportunity_level, note, sort_order)
values ((select id from brands where label ilike 'Supralite' limit 1),
        'LOW','MEDIUM','Fiber tutup pagar niche. Kompetisi minim, expand awareness.',80);

-- ── 3. KILLER ARGUMENTS ────────────────────────────────────
-- Divisi 1
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Arwana' limit 1),
        'Mulia/Platinum',
        'Pak/Bu, Arwana itu brand keramik nomor 1 dari sisi volume nasional. Konsumen dateng ke toko nanya Arwana, bukan nanya Mulia. Stok Arwana = traffic toko naik.',
        'Brand awareness #1 nasional = traffic toko naik', 10);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'UNO' limit 1),
        'Milan/Kaisar',
        'UNO itu keramik dekoratif yang paling lengkap motifnya dan support distribusi dari CSAP paling reliable. Milan bagus tapi sering indent, UNO ready stock.',
        'Motif terlengkap + distribusi CSAP paling reliable', 20);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Arna' limit 1),
        'Roman dGress',
        'Arna kasih kualitas granite tile setara Roman tapi di price point yang bikin end-user nggak perlu mikir dua kali. Margin toko juga lebih gede.',
        'Kualitas setara, harga lebih bersahabat, margin toko lebih gede', 30);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Eden' limit 1),
        'Crystal/Muriko',
        'Eden range-nya paling lengkap: PVC, aluminium, sampe wood panel. Satu brand nutup semua kebutuhan pintu, nggak perlu stok dari 3 supplier berbeda.',
        'Range terlengkap (PVC/Alu/Wood), 1 brand = semua kebutuhan pintu', 40);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike '%Mulia%' and label ilike '%glass%' limit 1),
        'Impor China',
        'Mulia Glassblock itu market leader yang sudah proven di ribuan project. Impor China mungkin lebih murah, tapi konsistensi ukuran dan kualitas sangat beragam. Customer complain ke toko, bukan ke produsen China.',
        'Market leader, kualitas terjamin vs impor abal-abal', 50);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Cotto' limit 1),
        'TOTO/Kohler',
        'Cotto itu import langsung dari Thailand, design-nya udah international standard. Harga di bawah TOTO & Kohler tapi tampilan premium-nya setara. Perfect buat konsumen yang mau luxury tanpa overpay.',
        'Import Thailand, design international, harga di bawah TOTO', 60);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Sterlyn' limit 1),
        'Ariston/Modena',
        'Sterlyn water heater harganya 20-30% lebih affordable dari Ariston dengan fitur & garansi yang comparable. Margin toko lebih gendut, dan demand water heater lagi naik terus. Early mover advantage!',
        'Harga 20-30% lebih affordable, fitur comparable, margin gendut', 70);

-- Divisi 2
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Global' limit 1),
        'Renovo/Duty',
        'Global closet didukung distribusi CSAP sampe pelosok. After-sales gampang, spare part available. Renovo & Duty? Kalau ada masalah, toko ribet sendiri.',
        'Distribusi CSAP sampe pelosok + after-sales gampang', 10);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Cosmos' limit 1),
        'Panasonic/KDK',
        'Budget customer tetep butuh exhaust fan. Nggak semua konsumen mau bayar 2x lipat. Cosmos itu sweet spot harga & kualitas yang ngisi gap itu.',
        'Sweet spot harga-kualitas buat budget customer', 20);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'SI' limit 1),
        'Termikon',
        'SI anti rayap udah proven di ribuan proyek. Formulanya terdaftar resmi dan punya technical support. Termikon murah, tapi kalau gagal, yang rugi siapa?',
        'Proven di ribuan proyek, terdaftar resmi, punya technical support', 30);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike '%Ace%' limit 1),
        'Eterna/Harris',
        'Ace Oldfields itu standar industri. Tukang cat profesional udah hafal kualitasnya. Jual Ace Oldfields = zero complain dari end-user.',
        'Standar industri, zero complain dari tukang profesional', 40);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Propan' limit 1),
        'Jotun/Nippon',
        'Propan margin toko-nya lebih sehat dari Jotun. Quality-wise udah setara, cuma Jotun spend lebih banyak di iklan. Yang bikin toko untung bukan iklan, tapi margin per kaleng.',
        'Margin per kaleng lebih sehat, kualitas setara', 50);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike '%Dura Roof%' limit 1),
        'Sakura/Multi Roof',
        'Dura Roof unggul di ketebalan material dan garansi resmi yang bisa dipertanggungjawabkan. Kompetitor murah biasanya shortcut di spesifikasi yang nggak keliatan, sampai ada masalah.',
        'Ketebalan & garansi lebih unggul', 60);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Timmerman' limit 1),
        'Taco/Inovar',
        'Timmerman punya koleksi motif & tekstur yang fresh banget, cocok tren interior kekinian. Taco established, tapi design Timmerman lebih update. Interior designer mulai ngelirik.',
        'Design lebih fresh & update, cocok tren interior kekinian', 70);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Paku' limit 1),
        'Moon Lion/Lokal',
        'Paku CSAP itu volume play yang smart. Harga bersaing, availability dari CSAP terjamin, dan toko nggak perlu ngurus banyak supplier buat kebutuhan fastmover kayak gini.',
        'Volume play, harga bersaing, availability dari CSAP', 80);

-- Divisi 3
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Volk' limit 1),
        'American Standard (Project)',
        'Volk itu sanitary didesain khusus buat volume project. Harganya bikin cost-per-unit developer jauh lebih rendah, tapi kualitas & tampilan nggak malu-maluin buat marketing brochure.',
        'Harga bikin developer senyum, tampilan nggak malu-maluin', 10);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Ceranosa' limit 1),
        'Sandimas/Sun Power',
        'Ceranosa punya range ukuran & motif lebih lengkap di price point sama. Satu supplier cover lebih banyak kebutuhan project.',
        'Range ukuran & motif terlengkap di price point sama', 20);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike '%Casania%' limit 1),
        'Taco/Daeji (Vinyl)',
        'Casania Floor SPC ketebalan & click system-nya international grade. Harga lebih bersahabat dari Taco, lagi nge-trend di project apartemen. First mover di toko = first profit.',
        'SPC international grade, harga bersahabat, tren apartemen', 30);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Salvador' limit 1),
        'Valentino Gress',
        'Salvador granite tiles kualitas ekspor dengan harga lokal. Motifnya up-to-date, dan support CSAP bikin delivery & retur lebih gampang.',
        'Kualitas ekspor, harga lokal, delivery CSAP reliable', 40);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Kanmuri' limit 1),
        'M-Class/KIA',
        'Kanmuri genteng keramik itu investment jangka panjang. Garansi & durabilitas di atas M-Class. Developer rumah premium butuh genteng yang nggak bikin after-sales pusing.',
        'Durabilitas & garansi terbaik, developer premium butuh ini', 50);

-- Divisi 4
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Mowilex' limit 1),
        'Dulux/Jotun',
        'Mowilex cat premium buatan Indonesia yang udah go international. Formula eco-friendly, low VOC. Margin toko lebih sehat dari Dulux, dan customer loyalty rate tinggi banget. Sekali pake, jarang balik.',
        'Eco-friendly, low VOC, margin sehat, loyalty tinggi', 10);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike '%Mortar%' limit 1),
        'Sika/Drymix',
        'MU market leader mortar instan bukan tanpa alasan. Konsistensi kualitas batch-to-batch bikin tukang percaya. Sika bagus di waterproofing, tapi buat mortar pasang & plester, MU nomor satu.',
        'Market leader, konsistensi batch terbaik, tukang percaya', 20);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Duratruss' limit 1),
        'TASO/Kencana',
        'Duratruss backed by CSAP dengan kalkulasi teknis gratis untuk kontraktor. Trust yang dibangun bertahun-tahun, plus availability dan delivery yang reliable. TASO mungkin market leader, tapi service CSAP lebih personal.',
        'Trust + kalkulasi teknis gratis buat kontraktor', 30);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Knauf' limit 1),
        'Jayaboard',
        'Knauf brand gypsum global. Buat project yang butuh fire-rated, moisture-resistant, atau acoustic, Knauf punya sertifikasi yang Jayaboard belum bisa match.',
        'Sertifikasi fire-rated & acoustic yang belum bisa di-match', 40);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'APlus' limit 1),
        'Star-Brand',
        'APlus backed by CSAP, supply & support reliable. Star-Brand mungkin mirip harga, tapi bandingin konsistensi pengiriman & after-sales. CSAP nggak ninggalin toko.',
        'Backed by CSAP = supply reliable, after-sales konsisten', 50);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Blesscon' limit 1),
        'Hebel/Citicon',
        'Hebel emang market leader, tapi harganya premium. Blesscon kasih kualitas bata ringan solid di harga yang bikin developer hemat 15-20% per unit rumah.',
        'Hemat 15-20% per unit rumah, kualitas solid', 60);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Franco' limit 1),
        'Artco/Tora',
        'Franco gerobak sorong build quality-nya di atas rata-rata. Ban & rangka lebih tahan lama. Gerobak murah lain? Seminggu ban kempes, rangka bengkok.',
        'Build quality superior, ban & rangka tahan lama, minim komplain', 70);
insert into playbook_killer_args (brand_id, vs_competitor, argument_text, cheatsheet_note, sort_order)
values ((select id from brands where label ilike 'Supralite' limit 1),
        'Masterline/Fiber-X',
        'Supralite fiber penutup pagar finishing-nya rapi dan range warna-nya lengkap. Kompetitor lokal banyak yang kalah di konsistensi warna & ketebalan. Easy win di toko yang belum stok ini.',
        'Finishing rapi, range warna lengkap, beat non-brand easily', 80);

-- ── 4. PACKAGES ────────────────────────────────────────────
insert into playbook_packages (package_name, target_segment, selling_point, sort_order) values
('PAKET 1 — Rumah Subsidi / Budget Housing',
 'Developer rumah subsidi & kontraktor kecil',
 'Satu PO, semua kebutuhan rumah subsidi covered. Nggak perlu koordinasi 10 supplier, cukup CSAP.',
 10);
insert into playbook_packages (package_name, target_segment, selling_point, sort_order) values
('PAKET 2 — Rumah Menengah / Mid-Range Housing',
 'Developer perumahan cluster menengah',
 'Paket komplit dari struktur sampe finishing. Developer hemat waktu procurement, kita kasih harga paket kompetitif.',
 20);
insert into playbook_packages (package_name, target_segment, selling_point, sort_order) values
('PAKET 3 — Rumah Premium / High-End Residence',
 'Developer premium, arsitek, interior designer',
 'Full premium ecosystem, semua brand international-grade. Satu koordinator CSAP handle semua.',
 30);
insert into playbook_packages (package_name, target_segment, selling_point, sort_order) values
('PAKET 4 — Renovasi / Renovation Package',
 'Toko bangunan retail & end-user renovasi rumah',
 'Paket renovasi yang nggak perlu bongkar total. Install cepet, hasil premium.',
 40);

-- ── 5. PACKAGE ITEMS ───────────────────────────────────────
-- Paket 1 items
insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Arwana' limit 1),
       'Arwana (keramik)', 10
from playbook_packages p where p.package_name ilike '%Subsidi%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Global' limit 1),
       'Global (closet)', 20
from playbook_packages p where p.package_name ilike '%Subsidi%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Blesscon' limit 1),
       'Blesscon (bata ringan)', 30
from playbook_packages p where p.package_name ilike '%Subsidi%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike '%Mortar%' limit 1),
       'Mortar Utama', 40
from playbook_packages p where p.package_name ilike '%Subsidi%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'APlus' limit 1),
       'APlus (gypsum)', 50
from playbook_packages p where p.package_name ilike '%Subsidi%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike '%Dura Roof%' limit 1),
       'Dura Roof (atap)', 60
from playbook_packages p where p.package_name ilike '%Subsidi%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Franco' limit 1),
       'Franco (gerobak)', 70
from playbook_packages p where p.package_name ilike '%Subsidi%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Paku' limit 1),
       'Paku', 80
from playbook_packages p where p.package_name ilike '%Subsidi%' limit 1;

-- Paket 2 items
insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id, null, 'UNO + Arna (keramik)', 10
from playbook_packages p where p.package_name ilike '%Menengah%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Volk' limit 1),
       'Volk (sanitary)', 20
from playbook_packages p where p.package_name ilike '%Menengah%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Eden' limit 1),
       'Eden (pintu)', 30
from playbook_packages p where p.package_name ilike '%Menengah%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Propan' limit 1),
       'Propan (cat)', 40
from playbook_packages p where p.package_name ilike '%Menengah%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Knauf' limit 1),
       'Knauf (gypsum)', 50
from playbook_packages p where p.package_name ilike '%Menengah%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike '%Mortar%' limit 1),
       'Mortar Utama', 60
from playbook_packages p where p.package_name ilike '%Menengah%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Duratruss' limit 1),
       'Duratruss (baja ringan)', 70
from playbook_packages p where p.package_name ilike '%Menengah%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Kanmuri' limit 1),
       'Kanmuri (genteng)', 80
from playbook_packages p where p.package_name ilike '%Menengah%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike '%Casania%' limit 1),
       'Casania Floor (vinyl)', 90
from playbook_packages p where p.package_name ilike '%Menengah%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike '%Ace%' limit 1),
       'Ace Oldfields (alat cat)', 100
from playbook_packages p where p.package_name ilike '%Menengah%' limit 1;

-- Paket 3 items
insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Arna' limit 1),
       'Arna (porcelain/granite)', 10
from playbook_packages p where p.package_name ilike '%Premium%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Cotto' limit 1),
       'Cotto (sanitary luxury)', 20
from playbook_packages p where p.package_name ilike '%Premium%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Sterlyn' limit 1),
       'Sterlyn (water heater)', 30
from playbook_packages p where p.package_name ilike '%Premium%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Mowilex' limit 1),
       'Mowilex (cat premium)', 40
from playbook_packages p where p.package_name ilike '%Premium%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id, null, 'Knauf acoustic/fire-rated', 50
from playbook_packages p where p.package_name ilike '%Premium%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Timmerman' limit 1),
       'Timmerman (woodpanel)', 60
from playbook_packages p where p.package_name ilike '%Premium%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Kanmuri' limit 1),
       'Kanmuri (genteng)', 70
from playbook_packages p where p.package_name ilike '%Premium%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Eden' limit 1),
       'Eden (pintu premium)', 80
from playbook_packages p where p.package_name ilike '%Premium%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'SI' limit 1),
       'SI Anti Rayap', 90
from playbook_packages p where p.package_name ilike '%Premium%' limit 1;

-- Paket 4 items
insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id, null, 'Propan / Mowilex (cat)', 10
from playbook_packages p where p.package_name ilike '%Renovasi%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike '%Ace%' limit 1),
       'Ace Oldfields (alat)', 20
from playbook_packages p where p.package_name ilike '%Renovasi%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike '%Casania%' limit 1),
       'Casania Floor (vinyl SPC)', 30
from playbook_packages p where p.package_name ilike '%Renovasi%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Sterlyn' limit 1),
       'Sterlyn (water heater)', 40
from playbook_packages p where p.package_name ilike '%Renovasi%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Cosmos' limit 1),
       'Cosmos (exhaust fan)', 50
from playbook_packages p where p.package_name ilike '%Renovasi%' limit 1;

insert into playbook_package_items (package_id, brand_id, custom_label, sort_order)
select p.id,
       (select id from brands where label ilike 'Timmerman' limit 1),
       'Timmerman (accent wall)', 60
from playbook_packages p where p.package_name ilike '%Renovasi%' limit 1;
