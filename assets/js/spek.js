async function openSpek() {
  openMod('mod-spek');
  const body = document.getElementById('spek-body');
  body.innerHTML = '<div class="ldg"><div class="spin"></div></div>';
  let cats = [];
  try {
    const { data, error } = await sb.from('catalogs').select('*')
      .eq('is_active', true).order('sort_order').order('created_at');
    if (!error) cats = data || [];
  } catch (e) {}
  renderSpekBody(cats);
}

function renderSpekBody(cats) {
  const body = document.getElementById('spek-body');
  if (!cats.length) {
    body.innerHTML = `
      <div style="text-align:center;padding:52px 24px;color:var(--txs)">
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"
             viewBox="0 0 24 24" style="opacity:.3;margin-bottom:14px;display:block;margin-left:auto;margin-right:auto">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p style="font-size:14px;color:var(--tx);margin-bottom:6px;font-weight:600">Belum ada katalog</p>
        <p style="font-size:12px">Login Admin → tab <strong>📂 Katalog</strong> untuk upload PDF.</p>
        <p style="font-size:11px;color:var(--txm);margin-top:8px">
          Pastikan tabel <code style="color:var(--pu)">catalogs</code> sudah dibuat di Supabase.
        </p>
      </div>`;
    return;
  }

  const tabsHtml = cats.map((c, i) =>
    `<button class="stb ${i === 0 ? 'on' : ''}" onclick="spekTabDyn(${i},this)">${esc(c.brand)}</button>`
  ).join('');

  const panelsHtml = cats.map((c, i) => {
    const fid = 'spf' + i;
    return `<div class="spek-panel ${i === 0 ? 'on' : ''}" id="spp${i}">
      <div class="pdf-toolbar">
        <div class="pdf-info">
          <span class="spek-brand-badge">📄 ${esc(c.brand)}</span><br>
          <strong>${esc(c.title)}</strong>
          ${c.description ? `<span style="color:var(--txm)"> · ${esc(c.description)}</span>` : ''}
          ${c.pages       ? `<span style="color:var(--txm)"> · ${c.pages} hal</span>`       : ''}
        </div>
        ${c.file_url ? `
          <a href="${esc(c.file_url)}" target="_blank" class="btn bpu bsm">↗ Buka Full</a>
          <a href="${esc(c.file_url)}" download class="btn bgh bsm">⬇ Download</a>
        ` : ''}
      </div>
      ${c.file_url ? `
        <iframe id="${fid}" class="pdf-frame" src="${esc(c.file_url)}"
          onload="spekFrameLoad('${fid}')" onerror="spekFrameErr('${fid}')"></iframe>
        <div id="${fid}fb" class="pdf-fallback">
          <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="opacity:.3">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p>Embed tidak tersedia di browser ini</p>
          <a href="${esc(c.file_url)}" target="_blank" class="btn bpu bsm">↗ Buka PDF</a>
        </div>
      ` : `
        <div class="pdf-fallback" style="display:flex">
          <p style="color:var(--txm)">File belum di-upload</p>
        </div>
      `}
    </div>`;
  }).join('');

  body.innerHTML = `<div class="spek-tabs">${tabsHtml}</div>${panelsHtml}`;

  cats.forEach((_, i) => {
    const fid = 'spf' + i;
    setTimeout(() => spekFrameLoad(fid), 2000);
  });
}

function spekTabDyn(idx, el) {
  document.querySelectorAll('#mod-spek .stb').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('#spek-body .spek-panel').forEach((p, i) =>
    p.classList.toggle('on', i === idx)
  );
}

function spekFrameLoad(fid) {
  const f = document.getElementById(fid);
  if (!f) return;
  try {
    const d = f.contentDocument || (f.contentWindow && f.contentWindow.document);
    if (!d || (d.readyState === 'complete' && (!d.body || d.body.innerHTML.trim() === ''))) {
      spekFrameErr(fid);
    }
  } catch (e) {
    spekFrameErr(fid);
  }
}

function spekFrameErr(fid) {
  const f  = document.getElementById(fid);
  const fb = document.getElementById(fid + 'fb');
  if (f)  f.style.display  = 'none';
  if (fb) fb.style.display = 'flex';
}
