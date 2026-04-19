/* ── LOAD BRANDS ─────────────────────────────────────────── */
async function loadBrands() {
  document.getElementById('bl').innerHTML = '<div class="ldg"><div class="spin"></div></div>';
  const { data, error } = await sb.from('brands').select('*')
    .order('sort_order', { nullsFirst: false }).order('label');
  if (error) {
    document.getElementById('bl').innerHTML = `
      <div style="padding:14px">
        <p style="color:var(--red);font-size:12px;font-weight:600;margin-bottom:6px">❌ Gagal load brand</p>
        <p style="color:var(--txm);font-size:11px;line-height:1.6">${esc(error.message)}</p>
        <p style="color:var(--txs);font-size:11px;margin-top:8px">
          Pastikan Supabase URL &amp; Key sudah benar, dan tabel <code>brands</code> sudah ada.
        </p>
        <button class="btn bgh bsm" style="margin-top:10px;font-size:11px"
          onclick="loadBrands().then(()=>{renderDivs();renderBrands()})">
          🔄 Retry
        </button>
      </div>`;
    return;
  }
  S.brands = (data || []).filter(b => b.is_active !== false);
}

/* ── DIVISION HELPERS ────────────────────────────────────── */
function divList() {
  if (!S.brands.length) return [];
  const all = [...new Set(S.brands.map(b => b.division || 'Umum'))];
  return all.sort((a, b) => {
    const ai = a.startsWith('Divisi') ? parseInt(a.split(' ')[1] || 99) : 99;
    const bi = b.startsWith('Divisi') ? parseInt(b.split(' ')[1] || 99) : 99;
    return ai - bi || a.localeCompare(b);
  });
}

function brandsInDiv(d) {
  return S.brands.filter(b => (b.division || 'Umum') === d);
}

/* ── RENDER: DIVISION TABS ───────────────────────────────── */
function renderDivs() {
  const divs = divList();
  document.getElementById('dvt').innerHTML = divs.map(d =>
    `<button class="dvb ${d === S.curDiv ? 'on' : ''}" onclick="selDiv('${d}')">${d}</button>`
  ).join('');
}

function selDiv(d) {
  S.curDiv = d;
  S.curFilt = 'Semua';
  renderDivs();
  renderBrands();
}

/* ── RENDER: BRAND LIST ──────────────────────────────────── */
function renderBrands() {
  const list = brandsInDiv(S.curDiv);
  const el   = document.getElementById('bl');
  if (!S.brands.length) {
    el.innerHTML = '<p style="padding:12px;font-size:12px;color:var(--txm)">Belum ada data brand</p>';
    return;
  }
  if (!list.length) {
    el.innerHTML = `<p style="padding:12px;font-size:12px;color:var(--txm)">Tidak ada brand di ${S.curDiv}</p>`;
    return;
  }
  el.innerHTML = list.map(b => {
    const icon = b.brand_type === 'flipbook' ? '📖' : b.brand_type === 'external' ? '🔗' : '';
    const dot  = b.color ? `background:${b.color}` : '';
    return `<div class="bi ${b.id === S.curBrand ? 'on' : ''}" onclick="selBrand('${b.id}')">
      <div class="bid" style="${dot}"></div>
      <div class="bin">${esc(b.label)}${icon ? ` <span style="font-size:10px;opacity:.6">${icon}</span>` : ''}</div>
    </div>`;
  }).join('');
}

function selBrand(id) {
  closeSidebar();
  S.curFilt = 'Semua';
  const b = S.brands.find(x => x.id === id);
  if (b && b.brand_type === 'flipbook') {
    S.curBrand = id;
    renderBrands();
    showFlipbook(b);
  } else {
    loadProds(id).then(() => renderBrands());
  }
}

/* ── FLIPBOOK ────────────────────────────────────────────── */
function showFlipbook(b) {
  document.getElementById('bhname').textContent = b.label;
  document.getElementById('bhdesc').textContent = b.description || '';
  const wa = document.getElementById('bhweb');
  if (b.website) {
    wa.textContent = b.website;
    wa.href = 'https://' + b.website.replace(/^https?:\/\//, '');
    wa.style.display = '';
  } else {
    wa.style.display = 'none';
  }
  document.getElementById('bhcnt').textContent = '—';
  document.getElementById('tbadge').textContent = 'Flipbook';
  document.getElementById('fb').innerHTML = '';
  const gr  = document.getElementById('gr');
  const emp = document.getElementById('emp');
  gr.style.display = 'none';
  emp.style.display = 'flex';
  if (b.flipbook_url) {
    emp.innerHTML = `
      <div style="width:100%;height:100%;display:flex;flex-direction:column;gap:14px;align-items:center;justify-content:center">
        <p style="color:var(--txs);font-size:13px">📖 Katalog ${esc(b.label)}</p>
        <a href="${esc(b.flipbook_url)}" target="_blank" class="btn bpu" style="font-size:13px">
          Buka Flipbook ↗
        </a>
        <div style="width:100%;max-width:900px;height:62vh;border-radius:var(--r12);overflow:hidden;border:1px solid var(--bd)">
          <iframe src="${esc(b.flipbook_url)}" width="100%" height="100%" frameborder="0" allowfullscreen style="display:block"></iframe>
        </div>
      </div>`;
  } else {
    emp.innerHTML = `
      <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="opacity:.3">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
      <p>Flipbook URL belum diset</p>
      <small>Update di Admin Panel → Edit Brand</small>`;
  }
}

/* ── LOAD PRODUCTS ───────────────────────────────────────── */
async function loadProds(bid) {
  S.curBrand = bid;
  const gr  = document.getElementById('gr');
  const emp = document.getElementById('emp');
  gr.style.display  = 'none';
  emp.style.display = 'flex';
  emp.innerHTML = '<div class="ldg"><div class="spin"></div></div>';

  const { data, error } = await sb.from('products')
    .select('*').eq('brand', bid).order('cat').order('name');
  if (error) {
    emp.style.display = 'flex';
    emp.innerHTML = `
      <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
           style="opacity:.4;color:var(--red)">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p style="color:var(--red)">Gagal memuat produk</p>
      <small style="color:var(--txm)">${esc(error.message)}</small>
      <button class="btn bgh bsm" style="margin-top:8px" onclick="loadProds('${bid}')">🔄 Retry</button>`;
    return;
  }
  S.products = data || [];
  renderBH();
  renderFilters();
  applyFilt('Semua');
}

/* ── RENDER: BRAND HEADER ────────────────────────────────── */
function renderBH() {
  const b = S.brands.find(x => x.id === S.curBrand);
  if (!b) return;
  document.getElementById('bhname').textContent = b.label;
  document.getElementById('bhdesc').textContent = b.description || '';
  const wa = document.getElementById('bhweb');
  if (b.website) {
    wa.textContent = b.website;
    wa.href = 'https://' + b.website.replace(/^https?:\/\//, '');
    wa.style.display = '';
  } else {
    wa.style.display = 'none';
  }
  document.getElementById('bhcnt').textContent = S.products.length;
  document.getElementById('tbadge').textContent = S.products.length + ' produk';
}

/* ── RENDER: FILTERS ─────────────────────────────────────── */
function renderFilters() {
  const cats = ['Semua', ...new Set(S.products.map(p => p.cat || 'Lainnya'))].filter(Boolean);
  document.getElementById('fb').innerHTML = cats.map(c =>
    `<button class="fc ${c === S.curFilt ? 'on' : ''}" onclick="applyFilt('${c}')">${c}</button>`
  ).join('');
}

function applyFilt(cat) {
  S.curFilt = cat;
  document.querySelectorAll('.fc').forEach(e => e.classList.toggle('on', e.textContent === cat));
  S.filtered = cat === 'Semua' ? [...S.products] : S.products.filter(p => (p.cat || 'Lainnya') === cat);
  const q = document.getElementById('si').value.trim().toLowerCase();
  if (q) doSearch(q); else renderGrid();
}

/* ── RENDER: PRODUCT GRID ────────────────────────────────── */
function renderGrid() {
  const emp = document.getElementById('emp');
  const gr  = document.getElementById('gr');
  if (!S.filtered.length) {
    emp.style.display = 'flex';
    emp.innerHTML = `
      <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"
           viewBox="0 0 24 24" style="opacity:.3">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <p>Tidak ada produk ditemukan</p>
      <small>Coba kata kunci lain</small>`;
    gr.style.display = 'none';
    return;
  }
  emp.style.display = 'none';
  gr.style.display  = 'grid';
  gr.innerHTML = S.filtered.map(cardHTML).join('');
}

/* ── CARD HTML ───────────────────────────────────────────── */
function cardHTML(p) {
  const img = p.image_url
    ? `<img src="${p.image_url}" alt="${esc(p.name)}" loading="lazy"
         onerror="this.parentNode.innerHTML='<div class=cph>${emoji(p)}</div>'">`
    : `<div class="cph">${emoji(p)}</div>`;

  const tags = [];
  if (p.series)                              tags.push(`<span class="tag tgd">${esc(p.series)}</span>`);
  if (p.finish)                              tags.push(`<span class="tag tfin">${esc(p.finish.split(',')[0])}</span>`);
  if (!p.series && !p.finish && p.subcategory) tags.push(`<span class="tag tcat">${esc(p.subcategory)}</span>`);
  if (!p.series && !p.finish && !p.subcategory && p.cat) tags.push(`<span class="tag tcat">${esc(p.cat)}</span>`);
  if (p.size) tags.push(`<span class="tag tsz">${esc(p.size)}</span>`);

  const adm = S.admin ? `<div class="cac">
    <button class="cab ced" onclick="editProd(event,'${p.id}')">✏</button>
    <button class="cab cdl" onclick="delProd(event,'${p.id}','${esc(p.name)}')">✕</button>
  </div>` : '';

  const nb = (p.sp || '').toLowerCase().includes('new arrival')
    ? '<div class="cnew">New</div>' : '';

  return `<div class="card ${S.admin ? 'am' : ''}" onclick="showDet('${p.id}')">
    <div class="ci">${img}${adm}${nb}</div>
    <div class="cb">
      ${p.product_code ? `<div class="cc">${esc(p.product_code)}</div>` : ''}
      <div class="cn">${esc(p.name)}</div>
      <div class="ct">${tags.join('')}</div>
    </div>
  </div>`;
}

/* ── DETAIL MODAL ────────────────────────────────────────── */
function showDet(id) {
  if (S.admin) return;
  const p = S.products.find(x => x.id === id);
  if (!p) return;
  const imgEl = p.image_url
    ? `<img class="dimg" src="${p.image_url}">`
    : `<div class="diph">${emoji(p)}</div>`;

  const fields = [
    p.product_code && ['Kode',        p.product_code],
    p.cat          && ['Kategori',     p.cat],
    p.subcategory  && ['Sub-Kategori', p.subcategory],
    p.series       && ['Series',       p.series],
    p.finish       && ['Finish',       p.finish],
    p.size         && ['Ukuran',       p.size],
    p.face_type    && ['Face Type',    p.face_type],
    p.kw           && ['Keywords',     p.kw],
  ].filter(Boolean);

  document.getElementById('detcont').innerHTML = `
    ${imgEl}
    <h3 style="margin-bottom:6px">${esc(p.name)}</h3>
    ${p.product_code ? `<p style="color:var(--pu);font-size:12px;font-family:monospace;margin-bottom:12px">${esc(p.product_code)}</p>` : ''}
    ${fields.length ? `<div class="dgr">${fields.map(([l, v]) =>
      `<div class="di"><label>${l}</label><span>${esc(v)}</span></div>`
    ).join('')}</div>` : ''}
    ${p.sp ? `<div class="ddesc">${esc(p.sp)}</div>` : ''}
  `;
  openMod('mod-det');
}
