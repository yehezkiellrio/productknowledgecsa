/* ── PIN LOGIN ───────────────────────────────────────────── */
function openAdmin() {
  if (S.admin) { openMod('mod-adm'); populateAdm(); return; }
  S.pin = '';
  updPinDots();
  document.getElementById('perr').textContent = '';
  openMod('mod-pin');
}

function pk(k) {
  if      (k === 'C') S.pin = '';
  else if (k === 'D') S.pin = S.pin.slice(0, -1);
  else if (S.pin.length < 8) S.pin += k;
  updPinDots();
  if (S.pin.length === 8) {
    if (S.pin === PIN) {
      S.admin = true;
      closeMod('mod-pin');
      document.getElementById('bta').classList.add('on');
      document.getElementById('alab').textContent = '✓ Admin';
      toast('Admin mode aktif', 'ok');
      openMod('mod-adm');
      populateAdm();
    } else {
      document.getElementById('perr').textContent = 'PIN salah, coba lagi';
      S.pin = '';
      setTimeout(() => document.getElementById('perr').textContent = '', 2000);
      updPinDots();
    }
  }
}

function updPinDots() {
  for (let i = 0; i < 8; i++) {
    document.getElementById('p' + i).classList.toggle('on', i < S.pin.length);
  }
}

/* ── ADMIN PANEL HELPERS ─────────────────────────────────── */
function populateAdm() {
  const opts = S.brands.map(b =>
    `<option value="${b.id}">${esc(b.label)} (${b.division || '?'})</option>`
  ).join('');
  document.getElementById('np-brand').innerHTML = opts;
  document.getElementById('apbf').innerHTML = '<option value="">— Semua —</option>' + opts;
  loadAdmBrands();
  loadAdmProds();
  loadAdmCatalogs();
}

function aTab(t, el) {
  document.querySelectorAll('#mod-adm .atb').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('.apan').forEach(p => p.classList.remove('on'));
  document.getElementById('ap-' + t).classList.add('on');
}

/* ── ADMIN: BRAND LIST ───────────────────────────────────── */
async function loadAdmBrands() {
  const { data } = await sb.from('brands').select('*')
    .order('division', { nullsFirst: false }).order('sort_order').order('label');
  const el = document.getElementById('abl');
  if (!data || !data.length) {
    el.innerHTML = '<p style="color:var(--txm);font-size:12px">Belum ada brand</p>';
    return;
  }
  el.innerHTML = `<table class="atbl">
    <thead><tr><th>Brand</th><th>Divisi</th><th>Website</th><th>Status</th><th>Aksi</th></tr></thead>
    <tbody>${data.map(b => `
      <tr>
        <td><strong>${esc(b.label)}</strong></td>
        <td style="color:var(--txs)">${esc(b.division || '—')}</td>
        <td style="color:var(--txs);font-size:11px">${esc(b.website || '—')}</td>
        <td><span class="sbadge ${b.is_active ? 'sok' : 'sno'}">${b.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
        <td style="white-space:nowrap">
          <button class="btn bgh bsm" style="font-size:11px" onclick="editBrand('${b.id}')">Edit</button>
          <button class="btn brd bsm" style="font-size:11px;margin-left:4px" onclick="delBrand('${b.id}','${esc(b.label)}')">Hapus</button>
        </td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}

/* ── ADMIN: PRODUCT LIST ─────────────────────────────────── */
async function loadAdmProds() {
  const bid = document.getElementById('apbf').value;
  let q = sb.from('products').select('id,name,product_code,cat,brand').order('name');
  if (bid) q = q.eq('brand', bid);
  const { data } = await q.limit(200);
  const el = document.getElementById('apl');
  if (!data || !data.length) {
    el.innerHTML = '<p style="color:var(--txm);font-size:12px">Belum ada produk</p>';
    return;
  }
  el.innerHTML = `<div style="max-height:340px;overflow-y:auto">
    <table class="atbl">
      <thead><tr><th>Kode</th><th>Nama</th><th>Kategori</th><th>Aksi</th></tr></thead>
      <tbody>${data.map(p => `
        <tr>
          <td style="font-family:monospace;color:var(--pu);font-size:11px">${esc(p.product_code || '—')}</td>
          <td>${esc(p.name)}</td>
          <td style="color:var(--txs);font-size:11px">${esc(p.cat || '—')}</td>
          <td style="white-space:nowrap">
            <button class="btn bgh bsm" style="font-size:11px" onclick="editProdAdm('${p.id}')">Edit</button>
            <button class="btn brd bsm" style="font-size:11px;margin-left:4px" onclick="delProd2('${p.id}','${esc(p.name)}')">Hapus</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

/* ── BRAND CRUD ──────────────────────────────────────────── */
async function saveBrand() {
  const name = document.getElementById('nb-name').value.trim();
  const div  = document.getElementById('nb-div').value;
  const web  = document.getElementById('nb-web').value.trim();
  const desc = document.getElementById('nb-desc').value.trim();
  const act  = document.getElementById('nb-act').value === 'true';
  const eid  = document.getElementById('nb-editid').value;
  if (!name) { toast('Nama brand wajib diisi', 'err'); return; }

  let logoUrl = null;
  if (S.lFile) {
    const fn = 'logos/' + Date.now() + '_' + S.lFile.name.replace(/\s/g, '_');
    const { error: ue } = await sb.storage.from(BUCKET_B).upload(fn, S.lFile, { upsert: true });
    if (!ue) {
      const { data: ud } = sb.storage.from(BUCKET_B).getPublicUrl(fn);
      logoUrl = ud.publicUrl;
    }
  }

  const payload = {
    label:       name,
    division:    div,
    website:     web  || null,
    description: desc || null,
    is_active:   act,
    brand_type:  document.getElementById('nb-type').value || 'products',
    flipbook_url: document.getElementById('nb-flip').value.trim() || null,
  };
  if (logoUrl) payload.logo_url = logoUrl;

  let err;
  if (eid) {
    ({ error: err } = await sb.from('brands').update(payload).eq('id', eid));
  } else {
    ({ error: err } = await sb.from('brands').insert(payload));
  }
  if (err) { toast('Gagal simpan brand: ' + err.message, 'err'); return; }
  toast(eid ? 'Brand diupdate!' : 'Brand ditambahkan!', 'ok');
  clearBrandForm();
  await loadBrands();
  renderDivs(); renderBrands(); loadAdmBrands(); populateAdm();
}

async function editBrand(id) {
  const { data } = await sb.from('brands').select('*').eq('id', id).single();
  if (!data) return;
  document.getElementById('nb-name').value = data.label || '';
  document.getElementById('nb-div').value  = data.division || 'Divisi 1';
  document.getElementById('nb-web').value  = data.website || '';
  document.getElementById('nb-desc').value = data.description || '';
  document.getElementById('nb-act').value  = String(data.is_active);
  document.getElementById('nb-type').value = data.brand_type || 'products';
  document.getElementById('nb-flip').value = data.flipbook_url || '';
  document.getElementById('nb-editid').value = id;
  document.getElementById('nb-savelbl').textContent = 'Update Brand';
  if (data.logo_url) {
    document.getElementById('blpw').innerHTML =
      `<div class="irw"><img class="ip" src="${data.logo_url}">
       <button class="irm" onclick="rmLogo(event)">✕</button></div>`;
  }
  aTab('abrand', document.querySelectorAll('#mod-adm .atb')[2]);
  toast('Edit brand: ' + data.label, 'info');
}

async function delBrand(id, name) {
  if (!confirm(`Hapus brand "${name}"? Semua produk terkait juga akan terhapus!`)) return;
  const { error } = await sb.from('brands').delete().eq('id', id);
  if (error) { toast('Gagal hapus brand', 'err'); return; }
  toast('Brand dihapus', 'ok');
  if (S.curBrand === id) { S.curBrand = null; S.products = []; S.filtered = []; renderGrid(); }
  await loadBrands();
  renderDivs(); renderBrands(); loadAdmBrands(); populateAdm();
}

function clearBrandForm() {
  ['nb-name', 'nb-web', 'nb-desc', 'nb-flip'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('nb-div').value = 'Divisi 1';
  document.getElementById('nb-act').value = 'true';
  document.getElementById('nb-type').value = 'products';
  document.getElementById('nb-editid').value = '';
  document.getElementById('nb-savelbl').textContent = 'Simpan Brand';
  document.getElementById('blpw').innerHTML = `
    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5"
         viewBox="0 0 24 24" style="opacity:.4">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
    <p>Klik untuk upload logo</p>`;
  S.lFile = null;
}

/* ── PRODUCT CRUD ────────────────────────────────────────── */
async function saveProd() {
  const brand = document.getElementById('np-brand').value;
  const cat   = document.getElementById('np-cat').value.trim();
  const name  = document.getElementById('np-name').value.trim();
  const eid   = document.getElementById('np-editid').value;
  if (!brand || !cat || !name) { toast('Brand, kategori, dan nama wajib diisi', 'err'); return; }

  let imgUrl = document.getElementById('np-imgurl').value || null;
  if (S.pFile) {
    const fn = 'products/' + Date.now() + '_' + S.pFile.name.replace(/\s/g, '_');
    const { error: ue } = await sb.storage.from(BUCKET_P).upload(fn, S.pFile, { upsert: true });
    if (!ue) {
      const { data: ud } = sb.storage.from(BUCKET_P).getPublicUrl(fn);
      imgUrl = ud.publicUrl;
    }
  }

  const payload = {
    brand,
    cat,
    name,
    product_code: document.getElementById('np-code').value.trim()   || null,
    subcategory:  document.getElementById('np-sub').value.trim()    || null,
    series:       document.getElementById('np-series').value.trim() || null,
    finish:       document.getElementById('np-finish').value.trim() || null,
    size:         document.getElementById('np-size').value.trim()   || null,
    face_type:    document.getElementById('np-face').value.trim()   || null,
    sp:           document.getElementById('np-desc').value.trim()   || null,
    image_url:    imgUrl,
  };

  let err;
  if (eid) {
    ({ error: err } = await sb.from('products').update(payload).eq('id', eid));
  } else {
    ({ error: err } = await sb.from('products').insert(payload));
  }
  if (err) { toast('Gagal simpan produk: ' + err.message, 'err'); return; }
  toast(eid ? 'Produk diupdate!' : 'Produk ditambahkan!', 'ok');
  clearProdForm();
  if (S.curBrand === brand) await loadProds(brand);
  loadAdmProds();
}

async function editProdAdm(id) {
  const { data } = await sb.from('products').select('*').eq('id', id).single();
  if (!data) return;
  fillProdForm(data);
  aTab('aprod', document.querySelectorAll('#mod-adm .atb')[3]);
  toast('Edit: ' + data.name, 'info');
}

function editProd(e, id) {
  e.stopPropagation();
  const p = S.products.find(x => x.id === id);
  if (!p) return;
  fillProdForm(p);
  openMod('mod-adm');
  aTab('aprod', document.querySelectorAll('#mod-adm .atb')[3]);
}

function fillProdForm(p) {
  document.getElementById('np-editid').value  = p.id;
  document.getElementById('np-brand').value   = p.brand;
  document.getElementById('np-cat').value     = p.cat          || '';
  document.getElementById('np-code').value    = p.product_code || '';
  document.getElementById('np-name').value    = p.name         || '';
  document.getElementById('np-sub').value     = p.subcategory  || '';
  document.getElementById('np-series').value  = p.series       || '';
  document.getElementById('np-finish').value  = p.finish       || '';
  document.getElementById('np-size').value    = p.size         || '';
  document.getElementById('np-face').value    = p.face_type    || '';
  document.getElementById('np-desc').value    = p.sp           || '';
  document.getElementById('np-imgurl').value  = p.image_url    || '';
  document.getElementById('np-savelbl').textContent = 'Update Produk';
  document.getElementById('cancedit').style.display = '';
  if (p.image_url) {
    document.getElementById('pipw').innerHTML =
      `<div class="irw"><img class="ip" src="${p.image_url}">
       <button class="irm" onclick="rmProdImg(event)">✕</button></div>`;
  }
}

async function delProd(e, id, name) {
  e.stopPropagation();
  if (!confirm('Hapus produk "' + name + '"?')) return;
  await doDelProd(id, name);
}
async function delProd2(id, name) {
  if (!confirm('Hapus produk "' + name + '"?')) return;
  await doDelProd(id, name);
}
async function doDelProd(id, name) {
  const { error } = await sb.from('products').delete().eq('id', id);
  if (error) { toast('Gagal hapus produk', 'err'); return; }
  toast('Produk "' + name + '" dihapus', 'ok');
  S.products = S.products.filter(p => p.id !== id);
  applyFilt(S.curFilt);
  renderBH();
  loadAdmProds();
}

function cancelEdit() { clearProdForm(); }

function clearProdForm() {
  ['np-editid','np-cat','np-code','np-name','np-sub','np-series',
   'np-finish','np-size','np-face','np-desc','np-imgurl'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.tagName !== 'SELECT') el.value = '';
  });
  document.getElementById('np-act').value = 'true';
  document.getElementById('np-savelbl').textContent = 'Simpan Produk';
  document.getElementById('cancedit').style.display = 'none';
  document.getElementById('pipw').innerHTML = `
    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5"
         viewBox="0 0 24 24" style="opacity:.4">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
    <p>Klik untuk upload foto produk</p>`;
  S.pFile = null;
}

/* ── IMAGE UPLOAD ────────────────────────────────────────── */
function prevLogo(input) {
  const f = input.files[0];
  if (!f) return;
  S.lFile = f;
  const url = URL.createObjectURL(f);
  document.getElementById('blpw').innerHTML =
    `<div class="irw"><img class="ip" src="${url}">
     <button class="irm" onclick="rmLogo(event)">✕</button></div>`;
}
function rmLogo(e) {
  e.stopPropagation();
  S.lFile = null;
  document.getElementById('blpw').innerHTML = `
    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5"
         viewBox="0 0 24 24" style="opacity:.4">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
    <p>Klik untuk upload logo</p>`;
  document.getElementById('bli').value = '';
}

function prevProd(input) {
  const f = input.files[0];
  if (!f) return;
  S.pFile = f;
  const url = URL.createObjectURL(f);
  document.getElementById('pipw').innerHTML =
    `<div class="irw"><img class="ip" src="${url}">
     <button class="irm" onclick="rmProdImg(event)">✕</button></div>`;
}
function rmProdImg(e) {
  e.stopPropagation();
  S.pFile = null;
  document.getElementById('np-imgurl').value = '';
  document.getElementById('pipw').innerHTML = `
    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5"
         viewBox="0 0 24 24" style="opacity:.4">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
    <p>Klik untuk upload foto produk</p>`;
  document.getElementById('pii').value = '';
}

/* ── DRAG & DROP ─────────────────────────────────────────── */
function initDragDrop() {
  ['blz', 'piz', 'cpz'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('dragover',  e => { e.preventDefault(); el.classList.add('drag'); });
    el.addEventListener('dragleave', ()  => el.classList.remove('drag'));
    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('drag');
      const f = e.dataTransfer.files[0];
      if (!f) return;
      const fakeInput = { files: [f] };
      if      (id === 'blz') prevLogo(fakeInput);
      else if (id === 'piz') prevProd(fakeInput);
      else                   prevCatalog(fakeInput);
    });
  });
}

/* ── CATALOG CRUD ────────────────────────────────────────── */
async function loadAdmCatalogs() {
  const el = document.getElementById('acl');
  el.innerHTML = '<div class="ldg"><div class="spin"></div></div>';
  const { data, error } = await sb.from('catalogs').select('*')
    .order('sort_order').order('created_at');
  if (error) {
    el.innerHTML = `<p style="color:var(--red);font-size:12px">
      Gagal load. Pastikan tabel <code>catalogs</code> sudah dibuat.</p>`;
    return;
  }
  if (!data || !data.length) {
    el.innerHTML = '<p style="font-size:12px;color:var(--txm)">Belum ada katalog. Tambahkan di form bawah.</p>';
    return;
  }
  el.innerHTML = `<table class="atbl">
    <thead><tr><th>Brand</th><th>Judul</th><th>Hal</th><th>File</th><th>Aksi</th></tr></thead>
    <tbody>${data.map(c => `
      <tr>
        <td><strong>${esc(c.brand || '—')}</strong></td>
        <td style="font-size:11px">${esc(c.title || '—')}</td>
        <td style="color:var(--txs)">${c.pages || '—'}</td>
        <td>${c.file_url
          ? `<a href="${esc(c.file_url)}" target="_blank" style="color:var(--pu);font-size:11px">↗ Lihat</a>`
          : '<span style="color:var(--txm);font-size:11px">—</span>'}</td>
        <td style="white-space:nowrap">
          <button class="btn bgh bsm" style="font-size:11px" onclick="editCatalog('${c.id}')">Edit</button>
          <button class="btn brd bsm" style="font-size:11px;margin-left:4px" onclick="delCatalog('${c.id}','${esc(c.brand)}')">Hapus</button>
        </td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}

let catFile = null;
function prevCatalog(input) {
  const f = input.files[0];
  if (!f) return;
  catFile = f;
  document.getElementById('cppw').innerHTML = `
    <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"
         viewBox="0 0 24 24" style="opacity:.6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
    <p style="color:var(--grn)">${esc(f.name)}</p>`;
}

async function saveCatalog() {
  const brand = document.getElementById('nc-brand').value.trim();
  const title = document.getElementById('nc-title').value.trim();
  const desc  = document.getElementById('nc-desc').value.trim();
  const pages = parseInt(document.getElementById('nc-pages').value) || null;
  const eid   = document.getElementById('nc-editid').value;
  if (!brand || !title) { toast('Nama brand & judul wajib diisi', 'err'); return; }

  const btn = document.getElementById('nc-savebtn');
  btn.disabled = true;
  const lbl = document.getElementById('nc-savelbl');
  lbl.textContent = 'Mengupload…';

  let fileUrl = document.getElementById('nc-fileurl').value || null;
  if (catFile) {
    await sb.storage.createBucket(BUCKET_C, { public: true });
    const fn = 'catalogs/' + Date.now() + '_' + catFile.name.replace(/\s+/g, '_');
    const { error: ue } = await sb.storage.from(BUCKET_C).upload(fn, catFile, {
      upsert: true, contentType: 'application/pdf'
    });
    if (ue) {
      toast('Gagal upload PDF: ' + ue.message, 'err');
      btn.disabled = false;
      lbl.textContent = eid ? 'Update Katalog' : 'Simpan Katalog';
      return;
    }
    const { data: ud } = sb.storage.from(BUCKET_C).getPublicUrl(fn);
    fileUrl = ud.publicUrl;
  }

  const payload = { brand, title, description: desc || null, pages, file_url: fileUrl, is_active: true };
  let err;
  if (eid) {
    ({ error: err } = await sb.from('catalogs').update(payload).eq('id', eid));
  } else {
    ({ error: err } = await sb.from('catalogs').insert(payload));
  }
  btn.disabled = false;
  if (err) {
    toast('Gagal simpan: ' + err.message, 'err');
    lbl.textContent = eid ? 'Update Katalog' : 'Simpan Katalog';
    return;
  }
  toast(eid ? 'Katalog diupdate!' : 'Katalog ditambahkan!', 'ok');
  clearCatForm();
  loadAdmCatalogs();
}

async function editCatalog(id) {
  const { data } = await sb.from('catalogs').select('*').eq('id', id).single();
  if (!data) return;
  document.getElementById('nc-brand').value    = data.brand       || '';
  document.getElementById('nc-title').value    = data.title       || '';
  document.getElementById('nc-desc').value     = data.description || '';
  document.getElementById('nc-pages').value    = data.pages       || '';
  document.getElementById('nc-fileurl').value  = data.file_url    || '';
  document.getElementById('nc-editid').value   = id;
  document.getElementById('nc-savelbl').textContent  = 'Update Katalog';
  document.getElementById('nc-formlbl').textContent  = '✏ Edit Katalog';
  document.getElementById('nc-canceledit').style.display = '';
  if (data.file_url) {
    document.getElementById('cppw').innerHTML =
      '<p style="color:var(--grn);font-size:12px">✓ File sudah ada — upload baru untuk ganti</p>';
  }
  toast('Edit: ' + data.brand, 'info');
}

async function delCatalog(id, name) {
  if (!confirm('Hapus katalog "' + name + '"?')) return;
  const { error } = await sb.from('catalogs').delete().eq('id', id);
  if (error) { toast('Gagal hapus', 'err'); return; }
  toast('Katalog dihapus', 'ok');
  loadAdmCatalogs();
}

function clearCatForm() {
  ['nc-brand','nc-title','nc-desc','nc-pages','nc-fileurl','nc-editid'].forEach(i => {
    const e = document.getElementById(i);
    if (e) e.value = '';
  });
  catFile = null;
  document.getElementById('nc-savelbl').textContent  = 'Simpan Katalog';
  document.getElementById('nc-formlbl').textContent  = '+ Tambah Katalog';
  document.getElementById('nc-canceledit').style.display = 'none';
  document.getElementById('nc-savebtn').disabled = false;
  document.getElementById('cppw').innerHTML = `
    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5"
         viewBox="0 0 24 24" style="opacity:.4">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
    <p>Klik untuk upload PDF katalog</p>`;
}
