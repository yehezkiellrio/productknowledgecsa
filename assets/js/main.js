async function init() {
  if (SB_URL === 'YOUR_SUPABASE_URL' || SB_KEY === 'YOUR_SUPABASE_ANON_KEY') {
    document.getElementById('bl').innerHTML = `
      <div style="padding:14px">
        <p style="color:var(--red-primary);font-size:12px;font-weight:600;margin-bottom:8px">⚠️ Config Belum Diset</p>
        <p style="color:var(--txs);font-size:11px;line-height:1.7">
          Buka <code>assets/js/config.js</code>, isi:<br>
          <code style="color:var(--red-primary)">SB_URL</code> dan <code style="color:var(--red-primary)">SB_KEY</code>
          dari Supabase dashboard.
        </p>
      </div>`;
    return;
  }

  initModalClose();
  initSearch();

  await loadBrands();

  S.curDiv = divList()[0] || 'Housebrand';
  renderDivs();
  renderBrands();

  /* start on beranda — brand list hidden */
  navTo('beranda');
  document.getElementById('dvt').classList.add('hidden');
  document.getElementById('bl').classList.add('hidden');

  initDragDrop();
}

init();
