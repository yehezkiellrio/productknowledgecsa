// ─── CSAP Product Knowledge — mock data for hi-fi prototype ───
// Derived from the live seed-playbook.sql. No external DB.

window.CSAP_DATA = (function () {

  const DIVISIONS = [
    {
      no: 1,
      title: "Finishing & Luxury Living",
      short: "Finishing",
      tagline: "Dua ujung spektrum: mass-market sampai luxury living.",
      key_takeaway:
        "Arwana & Cotto dua ujung spektrum: mass market vs luxury. Brand paling under-exploited: Sterlyn (water heater) yang bisa nge-gap Ariston di harga.",
      accent: "emerald"
    },
    {
      no: 2,
      title: "General Hardware & Chemicals",
      short: "Hardware",
      tagline:
        "Kuncinya di basket size — gimana caranya toko nggak cuma 1-2 item tapi borong banyak SKU sekaligus.",
      key_takeaway:
        "Ace Oldfields & Propan duo maut yang harus selalu dipasangkan. SI Anti Rayap punya niche yang sangat defensible. Timmerman punya potensi gede di tren interior modern.",
      accent: "amber"
    },
    {
      no: 3,
      title: "Flooring & Ceramic Specialist",
      short: "Flooring",
      tagline:
        "Yang bikin beda: kekuatan channel project. Volk didesain buat lawan American Standard di jalur project.",
      key_takeaway:
        "Paling head-to-head sama kompetitor sejenis. Kanmuri genteng keramik premium bisa di-push keras ke developer. Casania Floor vinyl/SPC riding the wave interior trend.",
      accent: "indigo"
    },
    {
      no: 4,
      title: "Structural & Heavy Tools",
      short: "Structural",
      tagline: "Tulang punggung CSAP di project channel. Multi-tier strategy yang nutup dua segmen sekaligus.",
      key_takeaway:
        "Mowilex & Mortar Utama anchor brand. Knauf vs APlus multi-tier smart: good cop-bad cop pricing. Franco gerobak jangan di-underestimate, margin-nya thicc.",
      accent: "rose"
    }
  ];

  // Brand master list. category used for header chips in catalog.
  const BRANDS = [
    // Div 1
    { id: "arwana",   label: "Arwana",              division: 1, category: "Keramik mass-market",   products: 142, website: "arwanacitra.com", desc: "Market leader keramik mass-market nasional. Brand recall tertinggi di kalangan end-user.", flagship: ["C10207 Carrara", "Z602 Onyx"] },
    { id: "uno",      label: "UNO",                 division: 1, category: "Keramik dekoratif",     products: 88,  website: "uno.co.id",       desc: "Koleksi keramik dekoratif terlengkap. Fokus di design-led tiles untuk residensial mid-premium.", flagship: ["UNO Marble", "UNO Stone"] },
    { id: "arna",     label: "Arna",                division: 1, category: "Granite tile",          products: 64,  website: "arna.id",         desc: "Granit tile value-for-money. Setara Roman dGress dengan price point yang ramah margin toko.", flagship: ["Arna GEO 60×60", "Arna Cavalli"] },
    { id: "eden",     label: "Eden",                division: 1, category: "Pintu",                 products: 52,  website: "edendoor.id",     desc: "Range pintu paling lengkap — PVC, aluminium, wood panel. Satu brand untuk semua kebutuhan pintu.", flagship: ["Eden PVC", "Eden Aluminium"] },
    { id: "mulia",    label: "Mulia Glassblock",    division: 1, category: "Glass block",           products: 18,  website: "muliaglass.com",  desc: "Market leader glass block. Proven di ribuan project komersial & residensial.", flagship: ["Clear 190×190", "Frosted 240×115"] },
    { id: "cotto",    label: "Cotto",               division: 1, category: "Sanitary luxury",       products: 76,  website: "cotto.com",       desc: "Sanitary import dari Thailand. Design international, harga di bawah TOTO/Kohler.", flagship: ["CT1132A Smart Toilet", "CT6820 Basin"] },
    { id: "sterlyn",  label: "Sterlyn",             division: 1, category: "Water heater",          products: 22,  website: "sterlyn.co.id",   desc: "Hidden gem water heater mid-premium. 20-30% lebih affordable dari Ariston dengan fitur comparable.", flagship: ["ST-30L", "ST-50L Smart"] },

    // Div 2
    { id: "global",   label: "Global",              division: 2, category: "Closet ekonomi",        products: 36,  website: "globalsanitaryware.com", desc: "Closet economy dengan distribusi CSAP sampai pelosok. After-sales gampang.", flagship: ["GS-101", "GS-220 Duo"] },
    { id: "cosmos",   label: "Cosmos",              division: 2, category: "Exhaust fan",           products: 24,  website: "cosmos.co.id",    desc: "Exhaust fan budget. Sweet spot harga-kualitas untuk price-sensitive segment.", flagship: ["CWF-10", "CWF-12"] },
    { id: "si",       label: "SI Anti Rayap",       division: 2, category: "Anti rayap",            products: 12,  website: "sichem.id",       desc: "Chemical anti rayap terdaftar resmi. Proven di ribuan proyek dengan technical support.", flagship: ["SI Termite 5L", "SI Pre-Construction"] },
    { id: "ace",      label: "Ace Oldfields",       division: 2, category: "Alat cat",              products: 68,  website: "aceoldfields.com", desc: "Standar industri alat cat profesional. Tukang profesional hafal kualitasnya.", flagship: ["Roller Pro 9″", "Brush Series 400"] },
    { id: "propan",   label: "Propan",              division: 2, category: "Cat & coating",         products: 94,  website: "propanraya.com",  desc: "Cat dengan margin toko yang sehat. Kualitas setara Jotun tanpa premium branding tax.", flagship: ["Ultran Lasur", "Decoshield"] },
    { id: "duraroof", label: "Dura Roof",           division: 2, category: "Atap metal",            products: 28,  website: "duraroof.id",     desc: "Atap metal dengan ketebalan & garansi unggul. Resmi dan bisa dipertanggungjawabkan.", flagship: ["DR Spandek", "DR Zincalume"] },
    { id: "timmerman",label: "Timmerman",           division: 2, category: "Wood panel & vinyl",    products: 58,  website: "timmerman.id",    desc: "Woodpanel design-forward. Motif & tekstur fresh, cocok tren interior modern.", flagship: ["Timmerman Oak", "Timmerman Ash"] },
    { id: "paku",     label: "Paku CSAP",           division: 2, category: "Fastener",              products: 42,  website: "csap.co.id",      desc: "Volume play fastener. Harga bersaing, availability terjamin.", flagship: ["Paku Beton 2\"", "Paku Payung"] },

    // Div 3
    { id: "volk",     label: "Volk",                division: 3, category: "Sanitary project",      products: 44,  website: "volksanitary.com", desc: "Sanitary mid-range untuk volume project. Developer-friendly pricing.", flagship: ["Volk Monoblock", "Volk Square Basin"] },
    { id: "ceranosa", label: "Ceranosa",            division: 3, category: "Granite tile",          products: 72,  website: "ceranosa.id",     desc: "Granite tile mid-segment dengan range ukuran & motif terlengkap.", flagship: ["Ceranosa Onyx", "Ceranosa Terrazzo"] },
    { id: "casania",  label: "Casania Floor",       division: 3, category: "SPC / Vinyl",           products: 48,  website: "casaniafloor.com", desc: "SPC flooring international grade. Ketebalan & click system premium, harga bersahabat.", flagship: ["Casania 5mm", "Casania Acoustic"] },
    { id: "salvador", label: "Salvador",            division: 3, category: "Granite tile",          products: 56,  website: "salvadortile.id", desc: "Granite tiles kualitas ekspor dengan harga lokal. Motif up-to-date.", flagship: ["Salvador Nero", "Salvador Calacatta"] },
    { id: "kanmuri",  label: "Kanmuri",             division: 3, category: "Genteng keramik",       products: 18,  website: "kanmuri.co.id",   desc: "Genteng keramik premium untuk developer menengah-atas. Durabilitas & garansi terbaik.", flagship: ["Kanmuri Espanica", "Kanmuri Milenio"] },

    // Div 4
    { id: "mowilex",  label: "Mowilex",             division: 4, category: "Cat premium",           products: 64,  website: "mowilex.com",     desc: "Cat premium buatan Indonesia yang sudah go international. Eco-friendly, low VOC.", flagship: ["Mowilex Emulsion", "Mowilex Woodstain"] },
    { id: "mu",       label: "Mortar Utama",        division: 4, category: "Semen instan",          products: 38,  website: "mu.co.id",        desc: "Market leader mortar instan. Konsistensi batch-to-batch yang tukang percaya.", flagship: ["MU-301 Pasang", "MU-380 Plester"] },
    { id: "duratruss",label: "Duratruss",           division: 4, category: "Baja ringan",           products: 26,  website: "duratruss.id",    desc: "Baja ringan dengan kalkulasi teknis gratis untuk kontraktor. Service personal.", flagship: ["C75 0.75mm", "C75 1.00mm"] },
    { id: "knauf",    label: "Knauf",               division: 4, category: "Gypsum premium",        products: 52,  website: "knauf.com",       desc: "Gypsum global. Sertifikasi fire-rated, acoustic & moisture-resistant yang belum bisa di-match.", flagship: ["Knauf Moisture", "Knauf Fire-Rated"] },
    { id: "aplus",    label: "APlus",               division: 4, category: "Gypsum mid-tier",       products: 34,  website: "aplus.co.id",     desc: "Gypsum & mortar mid-tier. Good cop dari Knauf untuk segmen volume.", flagship: ["APlus 9mm", "APlus Mortar"] },
    { id: "blesscon", label: "Blesscon",            division: 4, category: "Bata ringan",           products: 14,  website: "blesscon.co.id",  desc: "Bata ringan solid mid/economy. Hemat 15-20% per unit rumah dibanding Hebel.", flagship: ["Blesscon 10cm", "Blesscon 7.5cm"] },
    { id: "franco",   label: "Franco",              division: 4, category: "Gerobak & tools",       products: 22,  website: "francotools.id",  desc: "Gerobak sorong build quality superior. Ban & rangka tahan lama, minim komplain.", flagship: ["Franco Heavy Duty", "Franco Standard"] },
    { id: "supralite",label: "Supralite",           division: 4, category: "Fiber pagar",           products: 16,  website: "supralite.id",    desc: "Fiber penutup pagar dengan finishing rapi dan range warna lengkap.", flagship: ["Supralite Slim", "Supralite Classic"] }
  ];

  // Sample products for grid views. Generated from brand flagships + synthesized SKUs.
  const PRODUCTS = [];
  const sample = {
    arwana: [
      { code: "C10207",  name: "Carrara Marble",      sub: "Polished", series: "Carrara",    size: "600×600mm", finish: "Polished",  sp: "Rp 95.000/m²" },
      { code: "Z602",    name: "Onyx Beige",          sub: "Matte",    series: "Onyx",       size: "600×600mm", finish: "Matte",     sp: "Rp 87.000/m²" },
      { code: "E203",    name: "Travertino Sand",     sub: "Rustic",   series: "Travertino", size: "300×600mm", finish: "Rustic",    sp: "Rp 62.000/m²" },
      { code: "B118",    name: "Beton Grey",          sub: "Matte",    series: "Beton",      size: "300×600mm", finish: "Matte",     sp: "Rp 58.000/m²" }
    ],
    uno: [
      { code: "UN-M401", name: "Marble Statuario",    sub: "Polished", series: "Marble",     size: "600×1200mm", finish: "Polished", sp: "Rp 185.000/m²" },
      { code: "UN-S202", name: "Stone Charcoal",      sub: "Matte",    series: "Stone",      size: "600×1200mm", finish: "Matte",    sp: "Rp 172.000/m²" },
      { code: "UN-GEO",  name: "GEO Terrazzo",        sub: "Satin",    series: "GEO",        size: "600×600mm",  finish: "Satin",    sp: "Rp 128.000/m²" }
    ],
    arna: [
      { code: "AR-6060", name: "Carrara White",       sub: "Polished", series: "Carrara",    size: "600×600mm",  finish: "Polished", sp: "Rp 142.000/m²" },
      { code: "AR-80G",  name: "Cavalli Black",       sub: "Polished", series: "Cavalli",    size: "800×800mm",  finish: "Polished", sp: "Rp 198.000/m²" }
    ],
    cotto: [
      { code: "CT1132A", name: "Smart Toilet Duo",    sub: "Smart Toilet", series: "Luxury", size: "430×670×520mm", finish: "Gloss White", sp: "Rp 18.500.000" },
      { code: "CT6820",  name: "Counter Basin Deluxe", sub: "Basin",   series: "Deluxe",     size: "600×420×150mm", finish: "Matte White", sp: "Rp 4.250.000" }
    ],
    sterlyn: [
      { code: "ST-30L",  name: "Electric Heater 30L", sub: "Electric",  series: "Home",     size: "30 Liter",   finish: "White",   sp: "Rp 2.850.000" },
      { code: "ST-50S",  name: "Smart Heater 50L",    sub: "Smart",     series: "Pro",      size: "50 Liter",   finish: "Silver",  sp: "Rp 4.650.000" }
    ],
    mowilex: [
      { code: "MW-EM25", name: "Emulsion Interior",   sub: "Interior", series: "Emulsion",  size: "25 Liter",   finish: "Matte",    sp: "Rp 1.285.000" },
      { code: "MW-WS5",  name: "Woodstain Teak",      sub: "Exterior", series: "Woodstain", size: "5 Liter",    finish: "Satin",    sp: "Rp 685.000" }
    ],
    knauf: [
      { code: "KN-MR9",  name: "Moisture Resistant 9mm", sub: "Moisture", series: "MR",     size: "1200×2400",  finish: "Green face", sp: "Rp 142.000/lbr" },
      { code: "KN-FR12", name: "Fire-Rated 12mm",     sub: "Fire-Rated", series: "FR",      size: "1200×2400",  finish: "Pink face",  sp: "Rp 215.000/lbr" }
    ],
    mu: [
      { code: "MU-301",  name: "Mortar Pasang Bata",  sub: "Pasang",   series: "MU-301",    size: "40 kg",      finish: "Powder",   sp: "Rp 78.000/zak" },
      { code: "MU-380",  name: "Plester Halus",       sub: "Plester",  series: "MU-380",    size: "40 kg",      finish: "Powder",   sp: "Rp 84.000/zak" }
    ],
    volk: [
      { code: "VK-MB01", name: "Monoblock Duo",       sub: "Toilet",   series: "Monoblock", size: "680×380×770mm", finish: "White", sp: "Rp 1.950.000" }
    ],
    kanmuri: [
      { code: "KM-ESP",  name: "Espanica Classic",    sub: "Genteng",  series: "Espanica",  size: "310×410mm",  finish: "Glazed",   sp: "Rp 9.800/pcs" }
    ],
    casania: [
      { code: "CS-5AC",  name: "Acoustic SPC 5mm",    sub: "SPC",      series: "Acoustic",  size: "1220×183×5mm", finish: "Oak",    sp: "Rp 285.000/m²" }
    ],
    timmerman:[
      { code: "TM-OAK",  name: "Classic Oak Panel",   sub: "Wood Panel", series: "Oak",     size: "2440×1220×4mm", finish: "Natural", sp: "Rp 485.000/lbr" }
    ],
    propan: [
      { code: "PR-UL25", name: "Ultran Lasur",        sub: "Woodstain", series: "Ultran",   size: "25 Liter",   finish: "Transparan", sp: "Rp 785.000" }
    ],
    ace: [
      { code: "ACE-R9",  name: "Roller Pro 9″",        sub: "Roller",   series: "Pro",      size: "9 inch",     finish: "Microfiber", sp: "Rp 85.000" }
    ],
    duraroof: [
      { code: "DR-SP35", name: "Spandek 0.35mm",      sub: "Spandek",  series: "DR",        size: "760×6m",     finish: "Zincalume", sp: "Rp 98.000/m" }
    ]
  };
  Object.entries(sample).forEach(([bid, arr]) => {
    arr.forEach((p, i) => PRODUCTS.push({
      id: `${bid}-${i}`,
      brand: bid,
      brand_label: BRANDS.find(b => b.id === bid).label,
      division: BRANDS.find(b => b.id === bid).division,
      ...p
    }));
  });

  const GAPS = [
    // Div 1
    { brand: "arwana",   threat: "MEDIUM-HIGH", opp: "MEDIUM",    note: "Perang harga ketat sama Mulia & Platinum. Brand awareness tertinggi di mass market." },
    { brand: "uno",      threat: "MEDIUM",      opp: "HIGH",      note: "Segmen dekoratif masih fragmented. Bisa own niche decorative tile." },
    { brand: "arna",     threat: "HIGH",        opp: "MEDIUM",    note: "Roman dGress monster di premium porcelain. Arna fight di value-for-money." },
    { brand: "eden",     threat: "MEDIUM",      opp: "HIGH",      note: "Pasar pintu surprisingly fragmented. Eden bisa grab share kalau availability konsisten." },
    { brand: "mulia",    threat: "LOW",         opp: "MEDIUM",    note: "Market leader, posisi aman. Ancaman cuma impor China yang main harga." },
    { brand: "cotto",    threat: "HIGH",        opp: "HIGH",      note: "TOTO dominan. Tapi Cotto punya positioning import Thailand yang beda." },
    { brand: "sterlyn",  threat: "MEDIUM",      opp: "VERY HIGH", note: "Hidden gem! Ariston mahal, Rinnai lebih ke gas. Sterlyn bisa own electric water heater mid-premium." },
    // Div 2
    { brand: "global",   threat: "MEDIUM",      opp: "MEDIUM",    note: "Closet economy head-to-head sama Volk. Global = retail, Volk = project channel." },
    { brand: "cosmos",   threat: "HIGH",        opp: "LOW",       note: "Exhaust fan itu Panasonic & KDK territory. Cosmos survive di price-sensitive segment." },
    { brand: "si",       threat: "LOW",         opp: "HIGH",      note: "Anti rayap niche tapi super sticky. Sekali customer puas, nggak ganti. Defensible banget." },
    { brand: "ace",      threat: "LOW",         opp: "MEDIUM",    note: "Market leader alat cat. Maintain & bundling sama Propan." },
    { brand: "propan",   threat: "HIGH",        opp: "HIGH",      note: "Cat red ocean. Tapi Propan bisa menang di toko yang udah jual Mowilex sebagai mid-tier complement." },
    { brand: "duraroof", threat: "MEDIUM",      opp: "MEDIUM",    note: "Atap metal cukup commoditized. Jual di ketebalan & garansi." },
    { brand: "timmerman",threat: "MEDIUM",      opp: "VERY HIGH", note: "Woodpanel & vinyl lagi booming. Taco dominan tapi Timmerman bisa nge-gap di design premium." },
    { brand: "paku",     threat: "LOW",         opp: "LOW",       note: "Pure commodity play. Volume, harga, availability." },
    // Div 3
    { brand: "volk",     threat: "MEDIUM",      opp: "HIGH",      note: "Sanitary mid-range buat project. Harga bikin developer senyum." },
    { brand: "ceranosa", threat: "MEDIUM",      opp: "MEDIUM",    note: "Granite tiles mid segment. Diferensiasi lewat design & ukuran variatif." },
    { brand: "casania",  threat: "MEDIUM",      opp: "VERY HIGH", note: "Vinyl/SPC lagi trend gila-gilaan. Market masih growing." },
    { brand: "salvador", threat: "MEDIUM",      opp: "MEDIUM",    note: "Head-to-head sama Valentino Gress & QnQ. Cari niche di motif/ukuran." },
    { brand: "kanmuri",  threat: "LOW-MED",     opp: "HIGH",      note: "Genteng keramik premium. Reputasi durabilitas. Developer menengah-atas = target." },
    // Div 4
    { brand: "mowilex",  threat: "HIGH",        opp: "HIGH",      note: "Premium cat, head-to-head Dulux & Jotun. Punya loyalis kuat & eco-friendly positioning." },
    { brand: "mu",       threat: "LOW",         opp: "HIGH",      note: "Market leader mortar instan. Posisi kuat. Expand product line = lebih dominan." },
    { brand: "duratruss",threat: "MEDIUM",      opp: "MEDIUM",    note: "Baja ringan commoditized. TASO market leader. Menang di trust & kalkulasi teknis." },
    { brand: "knauf",    threat: "MEDIUM",      opp: "HIGH",      note: "Gypsum premium global. Own premium segment: peredam suara, tahan air, fire-rated." },
    { brand: "aplus",    threat: "MEDIUM",      opp: "MEDIUM",    note: "Gypsum & mortar mid-tier. Good cop dari Knauf." },
    { brand: "blesscon", threat: "MEDIUM",      opp: "MEDIUM",    note: "Bata ringan mid/economy. Hebel king of mindshare. Fight di harga & availability." },
    { brand: "franco",   threat: "LOW",         opp: "HIGH",      note: "Gerobak sorong margin surprisingly bagus. Nggak ada kompetitor dominant." },
    { brand: "supralite",threat: "LOW",         opp: "MEDIUM",    note: "Fiber tutup pagar niche. Kompetisi minim, expand awareness." }
  ];

  const ARGS = [
    // Div 1
    { brand: "arwana",   vs: "Mulia/Platinum",         text: "Arwana itu brand keramik nomor 1 dari sisi volume nasional. Konsumen dateng ke toko nanya Arwana, bukan nanya Mulia. Stok Arwana = traffic toko naik.", note: "Brand awareness #1 nasional = traffic toko naik" },
    { brand: "uno",      vs: "Milan/Kaisar",           text: "UNO itu keramik dekoratif yang paling lengkap motifnya dan support distribusi dari CSAP paling reliable. Milan bagus tapi sering indent, UNO ready stock.", note: "Motif terlengkap + distribusi CSAP paling reliable" },
    { brand: "arna",     vs: "Roman dGress",           text: "Arna kasih kualitas granite tile setara Roman tapi di price point yang bikin end-user nggak perlu mikir dua kali. Margin toko juga lebih gede.", note: "Kualitas setara, harga lebih bersahabat, margin toko lebih gede" },
    { brand: "eden",     vs: "Crystal/Muriko",         text: "Eden range-nya paling lengkap: PVC, aluminium, sampe wood panel. Satu brand nutup semua kebutuhan pintu, nggak perlu stok dari 3 supplier berbeda.", note: "Range terlengkap (PVC/Alu/Wood), 1 brand = semua kebutuhan pintu" },
    { brand: "mulia",    vs: "Impor China",            text: "Mulia Glassblock itu market leader yang sudah proven di ribuan project. Impor China mungkin lebih murah, tapi konsistensi ukuran dan kualitas sangat beragam. Customer complain ke toko, bukan ke produsen China.", note: "Market leader, kualitas terjamin vs impor abal-abal" },
    { brand: "cotto",    vs: "TOTO/Kohler",            text: "Cotto itu import langsung dari Thailand, design-nya udah international standard. Harga di bawah TOTO & Kohler tapi tampilan premium-nya setara. Perfect buat konsumen yang mau luxury tanpa overpay.", note: "Import Thailand, design international, harga di bawah TOTO" },
    { brand: "sterlyn",  vs: "Ariston/Modena",         text: "Sterlyn water heater harganya 20-30% lebih affordable dari Ariston dengan fitur & garansi yang comparable. Margin toko lebih gendut, dan demand water heater lagi naik terus. Early mover advantage!", note: "Harga 20-30% lebih affordable, fitur comparable, margin gendut" },
    // Div 2
    { brand: "global",   vs: "Renovo/Duty",            text: "Global closet didukung distribusi CSAP sampe pelosok. After-sales gampang, spare part available. Renovo & Duty? Kalau ada masalah, toko ribet sendiri.", note: "Distribusi CSAP sampe pelosok + after-sales gampang" },
    { brand: "cosmos",   vs: "Panasonic/KDK",          text: "Budget customer tetep butuh exhaust fan. Nggak semua konsumen mau bayar 2x lipat. Cosmos itu sweet spot harga & kualitas yang ngisi gap itu.", note: "Sweet spot harga-kualitas buat budget customer" },
    { brand: "si",       vs: "Termikon",               text: "SI anti rayap udah proven di ribuan proyek. Formulanya terdaftar resmi dan punya technical support. Termikon murah, tapi kalau gagal, yang rugi siapa?", note: "Proven di ribuan proyek, terdaftar resmi, punya technical support" },
    { brand: "ace",      vs: "Eterna/Harris",          text: "Ace Oldfields itu standar industri. Tukang cat profesional udah hafal kualitasnya. Jual Ace Oldfields = zero complain dari end-user.", note: "Standar industri, zero complain dari tukang profesional" },
    { brand: "propan",   vs: "Jotun/Nippon",           text: "Propan margin toko-nya lebih sehat dari Jotun. Quality-wise udah setara, cuma Jotun spend lebih banyak di iklan. Yang bikin toko untung bukan iklan, tapi margin per kaleng.", note: "Margin per kaleng lebih sehat, kualitas setara" },
    { brand: "duraroof", vs: "Sakura/Multi Roof",      text: "Dura Roof unggul di ketebalan material dan garansi resmi yang bisa dipertanggungjawabkan. Kompetitor murah biasanya shortcut di spesifikasi yang nggak keliatan, sampai ada masalah.", note: "Ketebalan & garansi lebih unggul" },
    { brand: "timmerman",vs: "Taco/Inovar",            text: "Timmerman punya koleksi motif & tekstur yang fresh banget, cocok tren interior kekinian. Taco established, tapi design Timmerman lebih update. Interior designer mulai ngelirik.", note: "Design lebih fresh & update, cocok tren interior kekinian" },
    { brand: "paku",     vs: "Moon Lion/Lokal",        text: "Paku CSAP itu volume play yang smart. Harga bersaing, availability dari CSAP terjamin, dan toko nggak perlu ngurus banyak supplier buat kebutuhan fastmover kayak gini.", note: "Volume play, harga bersaing, availability dari CSAP" },
    // Div 3
    { brand: "volk",     vs: "American Standard",      text: "Volk itu sanitary didesain khusus buat volume project. Harganya bikin cost-per-unit developer jauh lebih rendah, tapi kualitas & tampilan nggak malu-maluin buat marketing brochure.", note: "Harga bikin developer senyum, tampilan nggak malu-maluin" },
    { brand: "ceranosa", vs: "Sandimas/Sun Power",     text: "Ceranosa punya range ukuran & motif lebih lengkap di price point sama. Satu supplier cover lebih banyak kebutuhan project.", note: "Range ukuran & motif terlengkap di price point sama" },
    { brand: "casania",  vs: "Taco/Daeji (Vinyl)",     text: "Casania Floor SPC ketebalan & click system-nya international grade. Harga lebih bersahabat dari Taco, lagi nge-trend di project apartemen. First mover di toko = first profit.", note: "SPC international grade, harga bersahabat, tren apartemen" },
    { brand: "salvador", vs: "Valentino Gress",        text: "Salvador granite tiles kualitas ekspor dengan harga lokal. Motifnya up-to-date, dan support CSAP bikin delivery & retur lebih gampang.", note: "Kualitas ekspor, harga lokal, delivery CSAP reliable" },
    { brand: "kanmuri",  vs: "M-Class/KIA",            text: "Kanmuri genteng keramik itu investment jangka panjang. Garansi & durabilitas di atas M-Class. Developer rumah premium butuh genteng yang nggak bikin after-sales pusing.", note: "Durabilitas & garansi terbaik, developer premium butuh ini" },
    // Div 4
    { brand: "mowilex",  vs: "Dulux/Jotun",            text: "Mowilex cat premium buatan Indonesia yang udah go international. Formula eco-friendly, low VOC. Margin toko lebih sehat dari Dulux, dan customer loyalty rate tinggi banget. Sekali pake, jarang balik.", note: "Eco-friendly, low VOC, margin sehat, loyalty tinggi" },
    { brand: "mu",       vs: "Sika/Drymix",            text: "MU market leader mortar instan bukan tanpa alasan. Konsistensi kualitas batch-to-batch bikin tukang percaya. Sika bagus di waterproofing, tapi buat mortar pasang & plester, MU nomor satu.", note: "Market leader, konsistensi batch terbaik, tukang percaya" },
    { brand: "duratruss",vs: "TASO/Kencana",           text: "Duratruss backed by CSAP dengan kalkulasi teknis gratis untuk kontraktor. Trust yang dibangun bertahun-tahun, plus availability dan delivery yang reliable. TASO mungkin market leader, tapi service CSAP lebih personal.", note: "Trust + kalkulasi teknis gratis buat kontraktor" },
    { brand: "knauf",    vs: "Jayaboard",              text: "Knauf brand gypsum global. Buat project yang butuh fire-rated, moisture-resistant, atau acoustic, Knauf punya sertifikasi yang Jayaboard belum bisa match.", note: "Sertifikasi fire-rated & acoustic yang belum bisa di-match" },
    { brand: "aplus",    vs: "Star-Brand",             text: "APlus backed by CSAP, supply & support reliable. Star-Brand mungkin mirip harga, tapi bandingin konsistensi pengiriman & after-sales. CSAP nggak ninggalin toko.", note: "Backed by CSAP = supply reliable, after-sales konsisten" },
    { brand: "blesscon", vs: "Hebel/Citicon",          text: "Hebel emang market leader, tapi harganya premium. Blesscon kasih kualitas bata ringan solid di harga yang bikin developer hemat 15-20% per unit rumah.", note: "Hemat 15-20% per unit rumah, kualitas solid" },
    { brand: "franco",   vs: "Artco/Tora",             text: "Franco gerobak sorong build quality-nya di atas rata-rata. Ban & rangka lebih tahan lama. Gerobak murah lain? Seminggu ban kempes, rangka bengkok.", note: "Build quality superior, ban & rangka tahan lama, minim komplain" },
    { brand: "supralite",vs: "Masterline/Fiber-X",     text: "Supralite fiber penutup pagar finishing-nya rapi dan range warna-nya lengkap. Kompetitor lokal banyak yang kalah di konsistensi warna & ketebalan. Easy win di toko yang belum stok ini.", note: "Finishing rapi, range warna lengkap, beat non-brand easily" }
  ];

  const PACKAGES = [
    {
      id: "subsidi",
      name: "Rumah Subsidi",
      subtitle: "Budget Housing",
      target: "Developer rumah subsidi & kontraktor kecil",
      sp: "Satu PO, semua kebutuhan rumah subsidi covered. Nggak perlu koordinasi 10 supplier, cukup CSAP.",
      items: [
        { label: "Arwana",       detail: "keramik lantai & dinding", brand: "arwana" },
        { label: "Global",       detail: "closet ekonomi",          brand: "global" },
        { label: "Blesscon",     detail: "bata ringan",             brand: "blesscon" },
        { label: "Mortar Utama", detail: "pasang & plester",        brand: "mu" },
        { label: "APlus",        detail: "gypsum",                  brand: "aplus" },
        { label: "Dura Roof",    detail: "atap spandek",            brand: "duraroof" },
        { label: "Franco",       detail: "gerobak sorong",          brand: "franco" },
        { label: "Paku CSAP",    detail: "fastener",                brand: "paku" }
      ]
    },
    {
      id: "menengah",
      name: "Rumah Menengah",
      subtitle: "Mid-Range Housing",
      target: "Developer perumahan cluster menengah",
      sp: "Paket komplit dari struktur sampe finishing. Developer hemat waktu procurement, kita kasih harga paket kompetitif.",
      items: [
        { label: "UNO + Arna",   detail: "keramik decorative",      brand: "uno" },
        { label: "Volk",         detail: "sanitary project",        brand: "volk" },
        { label: "Eden",         detail: "pintu PVC/Aluminium",     brand: "eden" },
        { label: "Propan",       detail: "cat interior/eksterior",  brand: "propan" },
        { label: "Knauf",        detail: "gypsum standar",          brand: "knauf" },
        { label: "Mortar Utama", detail: "pasang & plester",        brand: "mu" },
        { label: "Duratruss",    detail: "baja ringan",             brand: "duratruss" },
        { label: "Kanmuri",      detail: "genteng keramik",         brand: "kanmuri" },
        { label: "Casania Floor",detail: "vinyl SPC",               brand: "casania" },
        { label: "Ace Oldfields",detail: "alat cat",                brand: "ace" }
      ]
    },
    {
      id: "premium",
      name: "Rumah Premium",
      subtitle: "High-End Residence",
      target: "Developer premium, arsitek, interior designer",
      sp: "Full premium ecosystem, semua brand international-grade. Satu koordinator CSAP handle semua.",
      items: [
        { label: "Arna",         detail: "porcelain/granite",       brand: "arna" },
        { label: "Cotto",        detail: "sanitary luxury",         brand: "cotto" },
        { label: "Sterlyn",      detail: "water heater",            brand: "sterlyn" },
        { label: "Mowilex",      detail: "cat premium",             brand: "mowilex" },
        { label: "Knauf FR/MR",  detail: "acoustic / fire-rated",   brand: "knauf" },
        { label: "Timmerman",    detail: "wood panel",              brand: "timmerman" },
        { label: "Kanmuri",      detail: "genteng premium",         brand: "kanmuri" },
        { label: "Eden Aluminium",detail: "pintu premium",          brand: "eden" },
        { label: "SI Anti Rayap",detail: "treatment",               brand: "si" }
      ]
    },
    {
      id: "renovasi",
      name: "Paket Renovasi",
      subtitle: "Renovation Package",
      target: "Toko bangunan retail & end-user renovasi rumah",
      sp: "Paket renovasi yang nggak perlu bongkar total. Install cepet, hasil premium.",
      items: [
        { label: "Propan/Mowilex", detail: "cat",                  brand: "propan" },
        { label: "Ace Oldfields",  detail: "alat",                 brand: "ace" },
        { label: "Casania Floor",  detail: "vinyl SPC",            brand: "casania" },
        { label: "Sterlyn",        detail: "water heater",         brand: "sterlyn" },
        { label: "Cosmos",         detail: "exhaust fan",          brand: "cosmos" },
        { label: "Timmerman",      detail: "accent wall",          brand: "timmerman" }
      ]
    }
  ];

  // Recent admin activity — mock audit log
  const ACTIVITY = [
    { t: "2j", user: "Yehezkiel",  action: "updated", what: "UNO Marble Statuario", kind: "product" },
    { t: "5j", user: "Yehezkiel",  action: "added",   what: "Sterlyn ST-50L Smart", kind: "product" },
    { t: "8j", user: "Admin",      action: "edited",  what: "Killer Arg — Cotto vs TOTO", kind: "playbook" },
    { t: "1h", user: "Yehezkiel",  action: "added",   what: "E-Catalog UNO 3060 × ARNA 6060", kind: "catalog" },
    { t: "1h", user: "Admin",      action: "updated", what: "Paket Rumah Premium", kind: "playbook" },
    { t: "2h", user: "Yehezkiel",  action: "added",   what: "Brand: Supralite",    kind: "brand" }
  ];

  return { DIVISIONS, BRANDS, PRODUCTS, GAPS, ARGS, PACKAGES, ACTIVITY };
})();
