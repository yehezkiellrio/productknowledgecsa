function doSearch(q) {
  if (!S.curBrand) return;
  const base = S.curFilt === 'Semua'
    ? S.products
    : S.products.filter(p => p.cat === S.curFilt);
  S.filtered = q
    ? base.filter(p =>
        (p.name         || '').toLowerCase().includes(q) ||
        (p.product_code || '').toLowerCase().includes(q) ||
        (p.series       || '').toLowerCase().includes(q) ||
        (p.subcategory  || p.cat || '').toLowerCase().includes(q) ||
        (p.sp           || '').toLowerCase().includes(q)
      )
    : base;
  renderGrid();
}

function initSearch() {
  document.getElementById('si').addEventListener('input', function () {
    doSearch(this.value.trim().toLowerCase());
  });
}
