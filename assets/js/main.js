async function init() {
  if (SB_URL === 'YOUR_SUPABASE_URL' || SB_KEY === 'YOUR_SUPABASE_ANON_KEY') {
    document.getElementById('bl').innerHTML = `
      <div style="padding:14px">
        <p style="color:var(--red);font-size:12px;font-weight:600;margin-bottom:8px">⚠️ Config Belum Diset</p>
        <p style="color:var(--txs);font-size:11px;line-height:1.7">
          Buka <code>assets/js/config.js</code>, isi:<br>
          <code style="color:var(--pu)">SB_URL</code> dan <code style="color:var(--pu)">SB_KEY</code>
          dari Supabase dashboard.
        </p>
      </div>`;
    return;
  }

  initModalClose();
  initSearch();

  await loadBrands();
  renderDivs();
  renderBrands();

  const firstDiv = divList()[0];
  if (firstDiv) {
    S.curDiv = firstDiv;
    renderDivs();
    renderBrands();
  }

  initDragDrop();
}

init();
