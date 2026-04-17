/* ── ESCAPE ──────────────────────────────────────────────── */
function esc(s) {
  return (s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ── EMOJI FALLBACK ──────────────────────────────────────── */
function emoji(p) {
  const c = (p.cat || '').toLowerCase();
  const s = (p.subcategory || p.cat || '').toLowerCase();
  if (c === 'tile')        return s.includes('dark') ? '🖤' : s.includes('wood') ? '🪵' : '🔲';
  if (c === 'toilet')      return '🚽';
  if (c === 'toilet seat') return '🪑';
  if (c === 'basin')       return '🫧';
  if (c === 'faucet')      return '🚰';
  if (c === 'shower')      return '🚿';
  if (c === 'accessories') return '🔩';
  if (c === 'drain')       return '⬇️';
  if (c === 'cabinet')     return '🗄️';
  return '📦';
}

/* ── TOAST ───────────────────────────────────────────────── */
function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = `ti t${type}`;
  el.textContent = msg;
  document.getElementById('tos').appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ── MODALS ──────────────────────────────────────────────── */
function openMod(id)  { document.getElementById(id).classList.remove('h'); }
function closeMod(id) { document.getElementById(id).classList.add('h'); }

function initModalClose() {
  document.querySelectorAll('.ov').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target === el) el.classList.add('h');
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.ov:not(.h)').forEach(el => el.classList.add('h'));
    }
  });
}
