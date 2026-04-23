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
  loadAdmPlay();
  initLearnForm();
  loadAdmLearn();
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
  ['blz', 'piz', 'cpz', 'lpz'].forEach(id => {
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
      else if (id === 'cpz') prevCatalog(fakeInput);
      else                   prevLearn(fakeInput);
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

/* ── PLAYBOOK ADMIN ──────────────────────────────────────── */
let PB_ADM = { divs: [], gaps: [], args: [], pkgs: [], items: [], editGapId: null, editArgId: null, editPkgId: null };

async function loadAdmPlay() {
  const el = document.getElementById('pp-adm-div');
  if (!el) return;
  const [r1, r2, r3, r4, r5] = await Promise.all([
    sb.from('playbook_divisions').select('*').order('division_no'),
    sb.from('playbook_gap_analysis').select('*, brand:brands(label,division)').order('sort_order'),
    sb.from('playbook_killer_args').select('*, brand:brands(label,division)').order('sort_order'),
    sb.from('playbook_packages').select('*').order('sort_order'),
    sb.from('playbook_package_items').select('*, brand:brands(label)').order('sort_order')
  ]);
  PB_ADM.divs  = r1.data || [];
  PB_ADM.gaps  = r2.data || [];
  PB_ADM.args  = r3.data || [];
  PB_ADM.pkgs  = r4.data || [];
  PB_ADM.items = r5.data || [];
  renderAdmDivs();
  renderAdmGaps();
  renderAdmArgs();
  renderAdmPkgs();
  PB.loaded = false; // invalidate frontend cache
}

function playAdmSubTab(t, el) {
  document.querySelectorAll('#ap-aplay .pltb').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('#ap-aplay .plpan').forEach(p => p.classList.remove('on'));
  document.getElementById('pp-adm-' + t).classList.add('on');
}

/* ── Divisions ── */
function renderAdmDivs() {
  const el = document.getElementById('pp-adm-div');
  if (!PB_ADM.divs.length) {
    el.innerHTML = '<p style="font-size:12px;color:var(--txm)">Belum ada data divisi. Jalankan seed-playbook.sql terlebih dahulu.</p>';
    return;
  }
  el.innerHTML = PB_ADM.divs.map(d => `
    <div style="background:var(--s2);border:1px solid var(--bd);border-radius:var(--r8);padding:14px 16px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px">
        <strong style="font-size:13px;color:var(--tx)">${esc(d.title)}</strong>
        <button class="btn bgh bsm" style="font-size:11px;flex-shrink:0" onclick="openEditDiv('${d.id}')">Edit</button>
      </div>
      <p style="font-size:11px;color:var(--txs);margin-bottom:4px">${esc(d.tagline || '—')}</p>
      <p style="font-size:11px;color:var(--txm)">${esc(d.key_takeaway || '—')}</p>
    </div>
    <div class="div-edit-form h" id="def-${d.id}" style="border:1px solid var(--bd);border-radius:var(--r8);padding:14px;margin-bottom:12px;margin-top:-8px">
      <div class="fg" style="margin-bottom:8px"><label>Judul</label>
        <input id="de-title-${d.id}" value="${esc(d.title)}">
      </div>
      <div class="fg" style="margin-bottom:8px"><label>Tagline (opsional)</label>
        <input id="de-tagline-${d.id}" value="${esc(d.tagline || '')}">
      </div>
      <div class="fg" style="margin-bottom:10px"><label>Key Takeaway</label>
        <textarea id="de-kt-${d.id}" rows="3">${esc(d.key_takeaway || '')}</textarea>
      </div>
      <div class="br">
        <button class="btn bgh bsm" onclick="document.getElementById('def-${d.id}').classList.add('h')">Batal</button>
        <button class="btn bgd bsm" onclick="saveDiv('${d.id}')">💾 Simpan</button>
      </div>
    </div>`).join('');
}

function openEditDiv(id) {
  document.querySelectorAll('.div-edit-form').forEach(f => f.classList.add('h'));
  document.getElementById('def-' + id).classList.remove('h');
}

async function saveDiv(id) {
  const title   = document.getElementById('de-title-' + id).value.trim();
  const tagline = document.getElementById('de-tagline-' + id).value.trim();
  const kt      = document.getElementById('de-kt-' + id).value.trim();
  if (!title) { toast('Judul wajib diisi', 'err'); return; }
  const { error } = await sb.from('playbook_divisions').update({
    title, tagline: tagline || null, key_takeaway: kt || null
  }).eq('id', id);
  if (error) { toast('Gagal simpan: ' + error.message, 'err'); return; }
  toast('Divisi diupdate!', 'ok');
  loadAdmPlay();
}

/* ── Gap Analysis ── */
function renderAdmGaps() {
  const el = document.getElementById('pp-adm-gap');
  const brandOpts = S.brands.map(b =>
    `<option value="${b.id}">${esc(b.label)} (${b.division || '?'})</option>`).join('');
  const lvlOpts = ['LOW','LOW-MED','MEDIUM','MEDIUM-HIGH','HIGH','VERY HIGH'].map(l =>
    `<option value="${l}">${l}</option>`).join('');

  const rows = PB_ADM.gaps.map(g => `
    <tr>
      <td><strong>${esc(g.brand ? g.brand.label : '—')}</strong><br>
        <span style="font-size:10px;color:var(--txm)">${esc(g.brand ? g.brand.division : '—')}</span>
      </td>
      <td>${g.threat_level || '—'}</td>
      <td>${g.opportunity_level || '—'}</td>
      <td style="font-size:11px;color:var(--txs);max-width:200px">${esc(g.note || '')}</td>
      <td style="white-space:nowrap">
        <button class="btn bgh bsm" style="font-size:11px" onclick="editGap('${g.id}')">Edit</button>
        <button class="btn brd bsm" style="font-size:11px;margin-left:4px" onclick="delGap('${g.id}')">Hapus</button>
      </td>
    </tr>`).join('');

  el.innerHTML = `
    <div style="max-height:280px;overflow-y:auto;margin-bottom:16px">
      <table class="atbl">
        <thead><tr><th>Brand</th><th>Threat</th><th>Opportunity</th><th>Catatan</th><th>Aksi</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="5" style="color:var(--txm);text-align:center">Belum ada data</td></tr>'}</tbody>
      </table>
    </div>
    <div style="border-top:1px solid var(--bd);padding-top:14px">
      <p style="font-size:12px;font-weight:600;color:var(--txs);margin-bottom:10px" id="gap-formlbl">+ Tambah Gap Analysis</p>
      <input type="hidden" id="gap-editid">
      <div class="fr">
        <div class="fg"><label>Brand *</label>
          <select id="gap-brand"><option value="">— Pilih Brand —</option>${brandOpts}</select>
        </div>
        <div class="fg"><label>Threat Level *</label>
          <select id="gap-threat"><option value="">—</option>${lvlOpts}</select>
        </div>
        <div class="fg"><label>Opportunity Level *</label>
          <select id="gap-opp"><option value="">—</option>${lvlOpts}</select>
        </div>
      </div>
      <div class="fg"><label>Catatan</label>
        <textarea id="gap-note" rows="2" placeholder="Analisa singkat posisi brand…"></textarea>
      </div>
      <div class="br" style="margin-top:8px">
        <button class="btn bgh bsm" onclick="clearGapForm()">Reset</button>
        <button class="btn bgd bsm" onclick="saveGap()">💾 <span id="gap-savelbl">Simpan</span></button>
      </div>
    </div>`;
}

async function saveGap() {
  const brand_id = document.getElementById('gap-brand').value;
  const threat   = document.getElementById('gap-threat').value;
  const opp      = document.getElementById('gap-opp').value;
  const note     = document.getElementById('gap-note').value.trim();
  const eid      = document.getElementById('gap-editid').value;
  if (!brand_id || !threat || !opp) { toast('Brand, threat, dan opportunity wajib diisi', 'err'); return; }
  const payload  = { brand_id, threat_level: threat, opportunity_level: opp, note: note || null };
  const { error } = eid
    ? await sb.from('playbook_gap_analysis').update(payload).eq('id', eid)
    : await sb.from('playbook_gap_analysis').insert(payload);
  if (error) { toast('Gagal simpan: ' + error.message, 'err'); return; }
  toast(eid ? 'Gap diupdate!' : 'Gap ditambahkan!', 'ok');
  clearGapForm();
  loadAdmPlay();
}

function editGap(id) {
  const g = PB_ADM.gaps.find(x => x.id === id);
  if (!g) return;
  document.getElementById('gap-editid').value = id;
  document.getElementById('gap-brand').value  = g.brand_id || '';
  document.getElementById('gap-threat').value = g.threat_level || '';
  document.getElementById('gap-opp').value    = g.opportunity_level || '';
  document.getElementById('gap-note').value   = g.note || '';
  document.getElementById('gap-savelbl').textContent = 'Update';
  document.getElementById('gap-formlbl').textContent = '✏ Edit Gap Analysis';
}

async function delGap(id) {
  if (!confirm('Hapus row gap analysis ini?')) return;
  const { error } = await sb.from('playbook_gap_analysis').delete().eq('id', id);
  if (error) { toast('Gagal hapus', 'err'); return; }
  toast('Gap dihapus', 'ok');
  loadAdmPlay();
}

function clearGapForm() {
  document.getElementById('gap-editid').value = '';
  document.getElementById('gap-brand').value  = '';
  document.getElementById('gap-threat').value = '';
  document.getElementById('gap-opp').value    = '';
  document.getElementById('gap-note').value   = '';
  document.getElementById('gap-savelbl').textContent = 'Simpan';
  document.getElementById('gap-formlbl').textContent = '+ Tambah Gap Analysis';
}

/* ── Killer Args ── */
function renderAdmArgs() {
  const el = document.getElementById('pp-adm-args');
  const brandOpts = S.brands.map(b =>
    `<option value="${b.id}">${esc(b.label)} (${b.division || '?'})</option>`).join('');

  const rows = PB_ADM.args.map(a => `
    <tr>
      <td><strong>${esc(a.brand ? a.brand.label : '—')}</strong></td>
      <td style="font-size:11px;color:var(--txs)">${esc(a.vs_competitor)}</td>
      <td style="font-size:11px;color:var(--txs);max-width:180px">${esc(a.cheatsheet_note || '')}</td>
      <td style="white-space:nowrap">
        <button class="btn bgh bsm" style="font-size:11px" onclick="editArg('${a.id}')">Edit</button>
        <button class="btn brd bsm" style="font-size:11px;margin-left:4px" onclick="delArg('${a.id}')">Hapus</button>
      </td>
    </tr>`).join('');

  el.innerHTML = `
    <div style="max-height:280px;overflow-y:auto;margin-bottom:16px">
      <table class="atbl">
        <thead><tr><th>Brand</th><th>vs Kompetitor</th><th>Cheatsheet Note</th><th>Aksi</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="4" style="color:var(--txm);text-align:center">Belum ada data</td></tr>'}</tbody>
      </table>
    </div>
    <div style="border-top:1px solid var(--bd);padding-top:14px">
      <p style="font-size:12px;font-weight:600;color:var(--txs);margin-bottom:10px" id="arg-formlbl">+ Tambah Killer Argument</p>
      <input type="hidden" id="arg-editid">
      <div class="fr">
        <div class="fg"><label>Brand *</label>
          <select id="arg-brand"><option value="">— Pilih Brand —</option>${brandOpts}</select>
        </div>
        <div class="fg"><label>vs Kompetitor *</label>
          <input id="arg-vs" placeholder="Jotun/Nippon">
        </div>
      </div>
      <div class="fg"><label>Argument (full paragraph)</label>
        <textarea id="arg-text" rows="3" placeholder="Pak/Bu, brand kita itu…"></textarea>
      </div>
      <div class="fg"><label>Cheatsheet Note (1 kalimat)</label>
        <input id="arg-note" placeholder="Ringkasan singkat untuk cheatsheet">
      </div>
      <div class="br" style="margin-top:8px">
        <button class="btn bgh bsm" onclick="clearArgForm()">Reset</button>
        <button class="btn bgd bsm" onclick="saveArg()">💾 <span id="arg-savelbl">Simpan</span></button>
      </div>
    </div>`;
}

async function saveArg() {
  const brand_id  = document.getElementById('arg-brand').value;
  const vs        = document.getElementById('arg-vs').value.trim();
  const text      = document.getElementById('arg-text').value.trim();
  const note      = document.getElementById('arg-note').value.trim();
  const eid       = document.getElementById('arg-editid').value;
  if (!brand_id || !vs) { toast('Brand dan vs kompetitor wajib diisi', 'err'); return; }
  const payload   = { brand_id, vs_competitor: vs, argument_text: text || null, cheatsheet_note: note || null };
  const { error } = eid
    ? await sb.from('playbook_killer_args').update(payload).eq('id', eid)
    : await sb.from('playbook_killer_args').insert(payload);
  if (error) { toast('Gagal simpan: ' + error.message, 'err'); return; }
  toast(eid ? 'Argument diupdate!' : 'Argument ditambahkan!', 'ok');
  clearArgForm();
  loadAdmPlay();
}

function editArg(id) {
  const a = PB_ADM.args.find(x => x.id === id);
  if (!a) return;
  document.getElementById('arg-editid').value = id;
  document.getElementById('arg-brand').value  = a.brand_id || '';
  document.getElementById('arg-vs').value     = a.vs_competitor || '';
  document.getElementById('arg-text').value   = a.argument_text || '';
  document.getElementById('arg-note').value   = a.cheatsheet_note || '';
  document.getElementById('arg-savelbl').textContent = 'Update';
  document.getElementById('arg-formlbl').textContent = '✏ Edit Killer Argument';
}

async function delArg(id) {
  if (!confirm('Hapus killer argument ini?')) return;
  const { error } = await sb.from('playbook_killer_args').delete().eq('id', id);
  if (error) { toast('Gagal hapus', 'err'); return; }
  toast('Argument dihapus', 'ok');
  loadAdmPlay();
}

function clearArgForm() {
  document.getElementById('arg-editid').value = '';
  document.getElementById('arg-brand').value  = '';
  document.getElementById('arg-vs').value     = '';
  document.getElementById('arg-text').value   = '';
  document.getElementById('arg-note').value   = '';
  document.getElementById('arg-savelbl').textContent = 'Simpan';
  document.getElementById('arg-formlbl').textContent = '+ Tambah Killer Argument';
}

/* ── Packages ── */
function renderAdmPkgs() {
  const el = document.getElementById('pp-adm-pkg');
  const brandOpts = S.brands.map(b =>
    `<option value="${b.id}">${esc(b.label)} (${b.division || '?'})</option>`).join('');

  el.innerHTML = `
    <div style="margin-bottom:16px">
      ${PB_ADM.pkgs.map(pkg => {
        const its = PB_ADM.items.filter(i => i.package_id === pkg.id);
        return `
          <div style="background:var(--s2);border:1px solid var(--bd);border-radius:var(--r8);padding:12px 14px;margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
              <strong style="font-size:12px;color:var(--tx)">${esc(pkg.package_name)}</strong>
              <div style="display:flex;gap:4px;flex-shrink:0">
                <button class="btn bgh bsm" style="font-size:11px" onclick="openEditPkg('${pkg.id}')">Edit</button>
                <button class="btn brd bsm" style="font-size:11px" onclick="delPkg('${pkg.id}')">Hapus</button>
              </div>
            </div>
            <p style="font-size:11px;color:var(--txs);margin:4px 0 6px">${esc(pkg.target_segment || '—')}</p>
            <div style="display:flex;flex-wrap:wrap;gap:4px">
              ${its.map(i => `
                <span style="display:inline-flex;align-items:center;gap:4px;background:var(--pua);
                     border:1px solid var(--bd);border-radius:20px;padding:2px 8px;font-size:10px">
                  ${esc(i.custom_label || (i.brand ? i.brand.label : '—'))}
                  <button onclick="delPkgItem('${i.id}')"
                    style="background:none;border:none;cursor:pointer;color:var(--red);font-size:10px;padding:0;line-height:1">✕</button>
                </span>`).join('')}
            </div>
            <div class="pkg-add-item h" id="pai-${pkg.id}"
                 style="margin-top:8px;padding-top:8px;border-top:1px solid var(--bd)">
              <div style="display:flex;gap:6px;align-items:flex-end">
                <div class="fg" style="flex:1;margin:0">
                  <label>Brand (opsional)</label>
                  <select id="pai-brand-${pkg.id}">
                    <option value="">— custom label —</option>${brandOpts}
                  </select>
                </div>
                <div class="fg" style="flex:1;margin:0">
                  <label>Label Item *</label>
                  <input id="pai-label-${pkg.id}" placeholder="Arwana (keramik)">
                </div>
                <button class="btn bgd bsm" style="margin-bottom:0" onclick="addPkgItem('${pkg.id}')">+ Tambah</button>
              </div>
            </div>
            <button class="btn bgh bsm" style="font-size:10px;margin-top:6px"
              onclick="document.getElementById('pai-${pkg.id}').classList.toggle('h')">+ Item</button>
          </div>
          <div class="pkg-edit-form h" id="pef-${pkg.id}"
               style="border:1px solid var(--bd);border-radius:var(--r8);padding:14px;margin-bottom:10px;margin-top:-6px">
            <div class="fg" style="margin-bottom:8px"><label>Nama Paket *</label>
              <input id="pef-name-${pkg.id}" value="${esc(pkg.package_name)}">
            </div>
            <div class="fg" style="margin-bottom:8px"><label>Target Segmen</label>
              <input id="pef-seg-${pkg.id}" value="${esc(pkg.target_segment || '')}">
            </div>
            <div class="fg" style="margin-bottom:10px"><label>Selling Point</label>
              <textarea id="pef-sp-${pkg.id}" rows="2">${esc(pkg.selling_point || '')}</textarea>
            </div>
            <div class="br">
              <button class="btn bgh bsm" onclick="document.getElementById('pef-${pkg.id}').classList.add('h')">Batal</button>
              <button class="btn bgd bsm" onclick="savePkg('${pkg.id}')">💾 Update</button>
            </div>
          </div>`;
      }).join('')}
    </div>
    <div style="border-top:1px solid var(--bd);padding-top:14px">
      <p style="font-size:12px;font-weight:600;color:var(--txs);margin-bottom:10px">+ Tambah Paket Baru</p>
      <div class="fg"><label>Nama Paket *</label>
        <input id="new-pkg-name" placeholder="PAKET 5 — …">
      </div>
      <div class="fr">
        <div class="fg"><label>Target Segmen</label>
          <input id="new-pkg-seg" placeholder="Developer, arsitek…">
        </div>
        <div class="fg"><label>Selling Point</label>
          <input id="new-pkg-sp" placeholder="Tagline paket ini…">
        </div>
      </div>
      <div class="br" style="margin-top:8px">
        <button class="btn bgd bsm" onclick="addPkg()">💾 Buat Paket</button>
      </div>
    </div>`;
}

function openEditPkg(id) {
  document.querySelectorAll('.pkg-edit-form').forEach(f => f.classList.add('h'));
  document.getElementById('pef-' + id).classList.remove('h');
}

async function savePkg(id) {
  const name = document.getElementById('pef-name-' + id).value.trim();
  const seg  = document.getElementById('pef-seg-' + id).value.trim();
  const sp   = document.getElementById('pef-sp-' + id).value.trim();
  if (!name) { toast('Nama paket wajib diisi', 'err'); return; }
  const { error } = await sb.from('playbook_packages').update({
    package_name: name, target_segment: seg || null, selling_point: sp || null
  }).eq('id', id);
  if (error) { toast('Gagal simpan: ' + error.message, 'err'); return; }
  toast('Paket diupdate!', 'ok');
  loadAdmPlay();
}

async function addPkg() {
  const name = document.getElementById('new-pkg-name').value.trim();
  const seg  = document.getElementById('new-pkg-seg').value.trim();
  const sp   = document.getElementById('new-pkg-sp').value.trim();
  if (!name) { toast('Nama paket wajib diisi', 'err'); return; }
  const { error } = await sb.from('playbook_packages').insert({
    package_name: name, target_segment: seg || null, selling_point: sp || null
  });
  if (error) { toast('Gagal buat paket: ' + error.message, 'err'); return; }
  toast('Paket ditambahkan!', 'ok');
  document.getElementById('new-pkg-name').value = '';
  document.getElementById('new-pkg-seg').value  = '';
  document.getElementById('new-pkg-sp').value   = '';
  loadAdmPlay();
}

async function delPkg(id) {
  if (!confirm('Hapus paket ini beserta semua itemnya?')) return;
  const { error } = await sb.from('playbook_packages').delete().eq('id', id);
  if (error) { toast('Gagal hapus', 'err'); return; }
  toast('Paket dihapus', 'ok');
  loadAdmPlay();
}

async function addPkgItem(pkgId) {
  const brand_id = document.getElementById('pai-brand-' + pkgId).value || null;
  const label    = document.getElementById('pai-label-' + pkgId).value.trim();
  if (!label) { toast('Label item wajib diisi', 'err'); return; }
  const { error } = await sb.from('playbook_package_items').insert({
    package_id: pkgId, brand_id, custom_label: label
  });
  if (error) { toast('Gagal tambah item: ' + error.message, 'err'); return; }
  toast('Item ditambahkan!', 'ok');
  loadAdmPlay();
}

async function delPkgItem(id) {
  const { error } = await sb.from('playbook_package_items').delete().eq('id', id);
  if (error) { toast('Gagal hapus item', 'err'); return; }
  toast('Item dihapus', 'ok');
  loadAdmPlay();
}

/* ── E-LEARNING CRUD ─────────────────────────────────────── */
let learnFile = null;

function initLearnForm() {
  const catSel = document.getElementById('nl-cat');
  if (!catSel.options.length) {
    catSel.innerHTML = LEARN_CATS.map(c =>
      `<option value="${c.key}">${c.icon} ${esc(c.label)}</option>`).join('');
  }
  onLearnCatChange();
}

function onLearnCatChange() {
  const key = document.getElementById('nl-cat').value;
  const cat = LEARN_CATS.find(c => c.key === key);
  const subSel = document.getElementById('nl-sub');
  if (!cat) { subSel.innerHTML = ''; return; }
  subSel.innerHTML = cat.subs.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join('');
}

async function loadAdmLearn() {
  const el = document.getElementById('all');
  if (!el) return;
  el.innerHTML = '<div class="ldg"><div class="spin"></div></div>';
  const { data, error } = await sb.from('elearning_materials').select('*')
    .order('category').order('subcategory').order('sort_order').order('created_at');
  if (error) {
    el.innerHTML = `<p style="color:var(--red);font-size:12px">
      Gagal load. Pastikan tabel <code>elearning_materials</code> sudah dibuat.</p>`;
    return;
  }
  if (!data || !data.length) {
    el.innerHTML = '<p style="font-size:12px;color:var(--txm)">Belum ada materi. Tambahkan di form bawah.</p>';
    return;
  }
  el.innerHTML = `<table class="atbl">
    <thead><tr><th>Kategori</th><th>Sub</th><th>Judul</th><th>File</th><th>Status</th><th>Aksi</th></tr></thead>
    <tbody>${data.map(m => {
      const cat = LEARN_CATS.find(c => c.key === m.category);
      return `<tr>
        <td><strong>${cat ? cat.icon + ' ' + esc(cat.label) : esc(m.category || '—')}</strong></td>
        <td style="font-size:11px;color:var(--txs)">${esc(m.subcategory || '—')}</td>
        <td style="font-size:11px">${esc(m.title || '—')}</td>
        <td>${m.file_url
          ? `<a href="${esc(m.file_url)}" target="_blank" style="color:var(--pu);font-size:11px">↗ Lihat</a>`
          : '<span style="color:var(--txm);font-size:11px">—</span>'}</td>
        <td><span class="sbadge ${m.is_active ? 'sok' : 'sno'}">${m.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
        <td style="white-space:nowrap">
          <button class="btn bgh bsm" style="font-size:11px" onclick="editLearn('${m.id}')">Edit</button>
          <button class="btn brd bsm" style="font-size:11px;margin-left:4px" onclick="delLearn('${m.id}','${esc(m.title)}')">Hapus</button>
        </td>
      </tr>`;
    }).join('')}
    </tbody>
  </table>`;
}

function prevLearn(input) {
  const f = input.files[0];
  if (!f) return;
  learnFile = f;
  document.getElementById('lppw').innerHTML = `
    <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"
         viewBox="0 0 24 24" style="opacity:.6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
    <p style="color:var(--grn)">${esc(f.name)}</p>`;
}

async function saveLearn() {
  const title = document.getElementById('nl-title').value.trim();
  const cat   = document.getElementById('nl-cat').value;
  const sub   = document.getElementById('nl-sub').value;
  const desc  = document.getElementById('nl-desc').value.trim();
  const act   = document.getElementById('nl-act').value === 'true';
  const eid   = document.getElementById('nl-editid').value;
  if (!title || !cat || !sub) { toast('Judul, kategori, & sub-kategori wajib diisi', 'err'); return; }

  const btn = document.getElementById('nl-savebtn');
  const lbl = document.getElementById('nl-savelbl');
  btn.disabled = true;
  lbl.textContent = 'Mengupload…';

  let fileUrl = document.getElementById('nl-fileurl').value || null;
  if (learnFile) {
    const fn = 'elearning/' + Date.now() + '_' + learnFile.name.replace(/\s+/g, '_');
    const { error: ue } = await sb.storage.from(BUCKET_E).upload(fn, learnFile, {
      upsert: true, contentType: 'application/pdf'
    });
    if (ue) {
      toast('Gagal upload PDF: ' + ue.message, 'err');
      btn.disabled = false;
      lbl.textContent = eid ? 'Update Materi' : 'Simpan Materi';
      return;
    }
    const { data: ud } = sb.storage.from(BUCKET_E).getPublicUrl(fn);
    fileUrl = ud.publicUrl;
  }

  if (!fileUrl) {
    toast('PDF wajib diupload', 'err');
    btn.disabled = false;
    lbl.textContent = eid ? 'Update Materi' : 'Simpan Materi';
    return;
  }

  const payload = {
    title, category: cat, subcategory: sub,
    description: desc || null, file_url: fileUrl, is_active: act
  };
  const { error } = eid
    ? await sb.from('elearning_materials').update(payload).eq('id', eid)
    : await sb.from('elearning_materials').insert(payload);
  btn.disabled = false;
  if (error) {
    toast('Gagal simpan: ' + error.message, 'err');
    lbl.textContent = eid ? 'Update Materi' : 'Simpan Materi';
    return;
  }
  toast(eid ? 'Materi diupdate!' : 'Materi ditambahkan!', 'ok');
  clearLearnForm();
  loadAdmLearn();
}

async function editLearn(id) {
  const { data } = await sb.from('elearning_materials').select('*').eq('id', id).single();
  if (!data) return;
  document.getElementById('nl-title').value   = data.title       || '';
  document.getElementById('nl-cat').value     = data.category    || LEARN_CATS[0].key;
  onLearnCatChange();
  document.getElementById('nl-sub').value     = data.subcategory || '';
  document.getElementById('nl-desc').value    = data.description || '';
  document.getElementById('nl-act').value     = String(data.is_active);
  document.getElementById('nl-fileurl').value = data.file_url    || '';
  document.getElementById('nl-editid').value  = id;
  document.getElementById('nl-savelbl').textContent = 'Update Materi';
  document.getElementById('nl-formlbl').textContent = '✏ Edit Materi';
  document.getElementById('nl-canceledit').style.display = '';
  if (data.file_url) {
    document.getElementById('lppw').innerHTML =
      '<p style="color:var(--grn);font-size:12px">✓ File sudah ada — upload baru untuk ganti</p>';
  }
  toast('Edit: ' + data.title, 'info');
}

async function delLearn(id, title) {
  if (!confirm('Hapus materi "' + title + '"?')) return;
  const { error } = await sb.from('elearning_materials').delete().eq('id', id);
  if (error) { toast('Gagal hapus', 'err'); return; }
  toast('Materi dihapus', 'ok');
  loadAdmLearn();
}

function clearLearnForm() {
  ['nl-title','nl-desc','nl-fileurl','nl-editid'].forEach(i => {
    const e = document.getElementById(i);
    if (e) e.value = '';
  });
  document.getElementById('nl-cat').value = LEARN_CATS[0].key;
  onLearnCatChange();
  document.getElementById('nl-act').value = 'true';
  learnFile = null;
  document.getElementById('lpi').value = '';
  document.getElementById('nl-savelbl').textContent = 'Simpan Materi';
  document.getElementById('nl-formlbl').textContent = '+ Tambah Materi E-Learning';
  document.getElementById('nl-canceledit').style.display = 'none';
  document.getElementById('nl-savebtn').disabled = false;
  document.getElementById('lppw').innerHTML = `
    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5"
         viewBox="0 0 24 24" style="opacity:.4">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
    <p>Klik untuk upload PDF materi</p>`;
}
