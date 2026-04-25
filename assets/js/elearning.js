/* ── E-LEARNING USER VIEW ────────────────────────────────── */
let LEARN = { items: [], curCat: null, curSub: null };
let elearningLoaded = false;

async function loadElearningIfNeeded() {
  if (elearningLoaded) return;
  elearningLoaded = true;
  const body = document.getElementById('learn-body');
  body.innerHTML = '<div class="ldg"><div class="spin"></div></div>';
  const { data, error } = await sb.from('elearning_materials').select('*')
    .eq('is_active', true).order('sort_order').order('created_at');
  if (error) {
    elearningLoaded = false;
    body.innerHTML = `
      <div style="text-align:center;padding:48px 24px;color:var(--txs)">
        <p style="font-size:14px;color:var(--red);font-weight:600;margin-bottom:6px">Gagal memuat materi</p>
        <p style="font-size:12px;color:var(--txm)">${esc(error.message)}</p>
        <p style="font-size:11px;color:var(--txm);margin-top:10px">
          Pastikan tabel <code style="color:var(--pu)">elearning_materials</code> sudah dibuat di Supabase.
        </p>
      </div>`;
    return;
  }
  LEARN.items = data || [];
  LEARN.curCat = LEARN_CATS[0].key;
  LEARN.curSub = null;
  renderLearnBody();
}

function openLearn() { navTo('elearning'); }

function renderLearnBody() {
  const body = document.getElementById('learn-body');
  const tabs = LEARN_CATS.map(c => {
    const n = LEARN.items.filter(i => i.category === c.key).length;
    return `<button class="ltab ${c.key === LEARN.curCat ? 'on' : ''}"
            onclick="selLearnCat('${c.key}')">
            <span style="font-size:13px">${c.icon}</span> ${esc(c.label)}
            <span class="lcnt">${n}</span>
          </button>`;
  }).join('');
  body.innerHTML = `
    <div class="ltabs">${tabs}</div>
    <div id="learn-panel"></div>`;
  renderLearnPanel();
}

function selLearnCat(key) {
  LEARN.curCat = key;
  LEARN.curSub = null;
  renderLearnBody();
}

function renderLearnPanel() {
  const panel = document.getElementById('learn-panel');
  const cat = LEARN_CATS.find(c => c.key === LEARN.curCat);
  if (!cat) { panel.innerHTML = ''; return; }

  const catItems = LEARN.items.filter(i => i.category === cat.key);
  const subs = cat.subs;
  const subFilter = LEARN.curSub;

  const subChips = `
    <button class="lsub ${!subFilter ? 'on' : ''}" onclick="selLearnSub(null)">
      Semua <span class="lcnt">${catItems.length}</span>
    </button>
    ${subs.map(s => {
      const n = catItems.filter(i => i.subcategory === s).length;
      return `<button class="lsub ${subFilter === s ? 'on' : ''}" onclick="selLearnSub('${esc(s).replace(/'/g,"\\'")}')">
        ${esc(s)} <span class="lcnt">${n}</span>
      </button>`;
    }).join('')}`;

  const shown = subFilter ? catItems.filter(i => i.subcategory === subFilter) : catItems;

  const cards = shown.length ? shown.map(i => learnCard(i, cat)).join('') : `
    <div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:var(--txm)">
      <svg width="42" height="42" fill="none" stroke="currentColor" stroke-width="1.5"
           viewBox="0 0 24 24" style="opacity:.3;margin-bottom:10px">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      <p style="font-size:13px;color:var(--txs)">Belum ada materi di ${subFilter ? esc(subFilter) : esc(cat.label)}</p>
      <small style="font-size:11px">Admin bisa upload di tab 🎓 E-Learning</small>
    </div>`;

  panel.innerHTML = `
    <div class="lsubs">${subChips}</div>
    <div class="lgrid">${cards}</div>`;
}

function selLearnSub(sub) {
  LEARN.curSub = sub;
  renderLearnPanel();
}

function learnCard(m, cat) {
  return `<div class="lcard" onclick="openLearnDoc('${m.id}')" style="--lc:${cat.color}">
    <div class="lthumb">
      <div class="lthumb-ic">${cat.icon}</div>
      <div class="lthumb-pdf">PDF</div>
    </div>
    <div class="lcardb">
      <div class="lsubtag">${esc(m.subcategory || cat.label)}</div>
      <div class="ltitle">${esc(m.title)}</div>
      ${m.description ? `<div class="ldesc">${esc(m.description)}</div>` : ''}
    </div>
  </div>`;
}

function openLearnDoc(id) {
  const m = LEARN.items.find(x => x.id === id);
  if (!m) return;
  const cat = LEARN_CATS.find(c => c.key === m.category) || { label: '—', icon: '📄', color: '#9b7428' };
  const body = document.getElementById('learn-doc-body');
  body.innerHTML = `
    <div style="margin-bottom:14px">
      <div class="spek-brand-badge" style="background:${cat.color}22;border-color:${cat.color};color:${cat.color}">
        ${cat.icon} ${esc(cat.label)} · ${esc(m.subcategory || '—')}
      </div>
      <h3 style="margin-bottom:4px">${esc(m.title)}</h3>
      ${m.description ? `<p class="sub" style="margin-bottom:10px">${esc(m.description)}</p>` : ''}
    </div>
    <div class="pdf-toolbar" style="padding-top:0">
      ${m.file_url ? `
        <a href="${esc(m.file_url)}" target="_blank" class="btn bpu bsm">↗ Buka Full</a>
        <a href="${esc(m.file_url)}" download class="btn bgh bsm">⬇ Download</a>
      ` : ''}
    </div>
    ${m.file_url ? `
      <iframe id="lpf" class="pdf-frame" src="${esc(m.file_url)}"
        onload="learnFrameLoad()" onerror="learnFrameErr()"></iframe>
      <div id="lpffb" class="pdf-fallback">
        <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"
             viewBox="0 0 24 24" style="opacity:.3">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p>Embed tidak tersedia di browser ini</p>
        <a href="${esc(m.file_url)}" target="_blank" class="btn bpu bsm">↗ Buka PDF</a>
      </div>
    ` : `
      <div class="pdf-fallback" style="display:flex">
        <p style="color:var(--txm)">File belum di-upload</p>
      </div>
    `}`;
  openMod('mod-learn-doc');
  setTimeout(learnFrameLoad, 2000);
}

function learnFrameLoad() {
  const f = document.getElementById('lpf');
  if (!f) return;
  try {
    const d = f.contentDocument || (f.contentWindow && f.contentWindow.document);
    if (!d || (d.readyState === 'complete' && (!d.body || d.body.innerHTML.trim() === ''))) {
      learnFrameErr();
    }
  } catch (e) { learnFrameErr(); }
}

function learnFrameErr() {
  const f  = document.getElementById('lpf');
  const fb = document.getElementById('lpffb');
  if (f)  f.style.display  = 'none';
  if (fb) fb.style.display = 'flex';
}
