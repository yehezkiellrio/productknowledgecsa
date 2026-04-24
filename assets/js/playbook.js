const PB = { loaded: false, divisions: [], gaps: [], args: [], packages: [], items: [] };

async function loadPlaybookIfNeeded() {
  if (PB.loaded) return;
  document.querySelectorAll('#sec-playbook .play-panel').forEach(p => {
    p.innerHTML = '<div class="ldg"><div class="spin"></div></div>';
  });
  await loadPlaybookData();
  PB.loaded = true;
  renderAllPlaybookPanels();
}

async function loadPlaybookData() {
  document.querySelectorAll('.play-panel').forEach(p => {
    p.innerHTML = '<div class="ldg"><div class="spin"></div></div>';
  });
  const [r1, r2, r3, r4, r5] = await Promise.all([
    sb.from('playbook_divisions').select('*').order('division_no'),
    sb.from('playbook_gap_analysis').select('*, brand:brands(label,division)').order('sort_order'),
    sb.from('playbook_killer_args').select('*, brand:brands(label,division)').order('sort_order'),
    sb.from('playbook_packages').select('*').order('sort_order'),
    sb.from('playbook_package_items').select('*, brand:brands(label)').order('sort_order')
  ]);
  PB.divisions = r1.data || [];
  PB.gaps      = r2.data || [];
  PB.args      = r3.data || [];
  PB.packages  = r4.data || [];
  PB.items     = r5.data || [];
}

function renderAllPlaybookPanels() {
  renderExecPanel();
  [1, 2, 3, 4].forEach(renderDivPanel);
  renderBundlePanel();
  renderCheatPanel();
}

function badgeHTML(level) {
  if (!level) return '<span class="play-badge">—</span>';
  const cls = {
    'LOW': 'pblow', 'LOW-MED': 'pblow',
    'MEDIUM': 'pbmed', 'MEDIUM-HIGH': 'pbmed',
    'HIGH': 'pbhigh', 'VERY HIGH': 'pbvhi'
  }[level] || 'pbmed';
  return `<span class="play-badge ${cls}">${esc(level)}</span>`;
}

function renderExecPanel() {
  const el = document.getElementById('pp-exec');
  const keys = PB.divisions.map(d => `
    <div class="exec-key">
      <strong style="color:var(--pu)">${esc(d.title)}</strong> — ${esc(d.key_takeaway || '')}
    </div>`).join('');
  el.innerHTML = `
    <div class="play-section">
      <h4>Executive Summary</h4>
      <p style="font-size:12px;color:var(--txs);line-height:1.8;margin-bottom:16px">
        CSAP adalah one-stop-shop untuk bahan bangunan — dari pondasi sampai finishing.
        Dokumen ini adalah amunisi lapangan: tau mana yang perlu di-defend, mana yang bisa di-push,
        dan gimana cara ngomong ke toko biar mereka mau switch atau nambahin brand kita.
      </p>
      <h5>Key Takeaways per Divisi</h5>
      ${keys || '<p style="color:var(--txm);font-size:12px">Belum ada data divisi.</p>'}
      <div style="background:var(--s2);border:1px solid var(--bd);border-radius:var(--r12);
           padding:16px 18px;margin-top:16px">
        <p style="font-size:11px;color:var(--txm);font-weight:700;text-transform:uppercase;
             letter-spacing:.5px;margin-bottom:12px">Portfolio CSAP</p>
        <div style="display:flex;gap:24px;flex-wrap:wrap">
          <div style="text-align:center">
            <div style="font-size:28px;font-weight:800;color:var(--gd)">${PB.divisions.length || 4}</div>
            <div style="font-size:10px;color:var(--txs);margin-top:2px">Divisi</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:28px;font-weight:800;color:var(--gd)">30+</div>
            <div style="font-size:10px;color:var(--txs);margin-top:2px">Brand</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:28px;font-weight:800;color:var(--gd)">Full</div>
            <div style="font-size:10px;color:var(--txs);margin-top:2px">Building Material</div>
          </div>
        </div>
      </div>
    </div>`;
}

function renderDivPanel(n) {
  const el   = document.getElementById('pp-div' + n);
  const div  = PB.divisions.find(d => d.division_no === n);
  const gaps = PB.gaps.filter(g => g.brand && g.brand.division === 'Divisi ' + n);
  const args = PB.args.filter(a => a.brand && a.brand.division === 'Divisi ' + n);

  if (!div && !gaps.length && !args.length) {
    el.innerHTML = '<p style="color:var(--txm);font-size:12px;padding:16px 0">Belum ada data untuk divisi ini.</p>';
    return;
  }

  el.innerHTML = `
    <div class="play-section">
      <h4>${esc(div ? div.title : 'Divisi ' + n)}</h4>
      ${div && div.tagline
        ? `<p style="font-size:12px;color:var(--txs);margin-bottom:14px">${esc(div.tagline)}</p>`
        : ''}
      ${gaps.length ? `
        <h5>Market Gap Analysis</h5>
        <table class="atbl">
          <thead><tr><th>Brand</th><th>Threat</th><th>Opportunity</th><th>Catatan</th></tr></thead>
          <tbody>${gaps.map(g => `
            <tr>
              <td><strong>${esc(g.brand ? g.brand.label : '—')}</strong></td>
              <td>${badgeHTML(g.threat_level)}</td>
              <td>${badgeHTML(g.opportunity_level)}</td>
              <td style="font-size:11px;color:var(--txs)">${esc(g.note || '')}</td>
            </tr>`).join('')}
          </tbody>
        </table>` : ''}
      ${args.length ? `
        <h5>Killer Arguments</h5>
        ${args.map(a => `
          <div class="arg-card">
            <div class="arg-vs">${esc(a.brand ? a.brand.label : '—')} vs ${esc(a.vs_competitor)}</div>
            <div class="arg-text">${esc(a.argument_text)}</div>
          </div>`).join('')}` : ''}
    </div>`;
}

function renderBundlePanel() {
  const el = document.getElementById('pp-bundle');
  if (!PB.packages.length) {
    el.innerHTML = '<p style="color:var(--txm);font-size:12px;padding:16px 0">Belum ada paket bundling.</p>';
    return;
  }
  el.innerHTML = `
    <div class="play-section">
      <h4>Cross-Selling &amp; Bundling Strategy</h4>
      <p style="font-size:12px;color:var(--txs);margin-bottom:18px">CSAP punya advantage yang
        kompetitor single-brand nggak punya: <strong>ecosystem</strong>. Satu kontraktor bisa beli
        hampir semua kebutuhan dari kita.</p>
      ${PB.packages.map(pkg => {
        const its = PB.items.filter(i => i.package_id === pkg.id);
        return `
          <div class="pkg-card">
            <h5>${esc(pkg.package_name)}</h5>
            ${pkg.target_segment
              ? `<div class="pkg-target">Target: ${esc(pkg.target_segment)}</div>` : ''}
            <div class="pkg-items">
              ${its.map(i =>
                `<span class="pkg-item">${esc(i.custom_label || (i.brand ? i.brand.label : '—'))}</span>`
              ).join('')}
            </div>
            ${pkg.selling_point
              ? `<div class="pkg-sp">💬 "${esc(pkg.selling_point)}"</div>` : ''}
          </div>`;
      }).join('')}
    </div>`;
}

function renderCheatPanel() {
  const el = document.getElementById('pp-cheat');
  if (!PB.args.length) {
    el.innerHTML = '<p style="color:var(--txm);font-size:12px;padding:16px 0">Belum ada killer arguments.</p>';
    return;
  }
  el.innerHTML = `
    <div class="play-section">
      <h4>⚡ Killer Arguments Cheatsheet</h4>
      <p style="font-size:12px;color:var(--txs);margin-bottom:14px">Quick reference lapangan — 1 kalimat per brand.</p>
      <div style="overflow-x:auto">
        <table class="atbl">
          <thead><tr><th>Brand CSAP</th><th>vs Kompetitor</th><th>Killer Argument</th></tr></thead>
          <tbody>${PB.args.map(a => `
            <tr>
              <td><strong>${esc(a.brand ? a.brand.label : '—')}</strong></td>
              <td style="color:var(--txs)">${esc(a.vs_competitor)}</td>
              <td style="font-size:11px">${esc(a.cheatsheet_note || a.argument_text || '')}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div style="margin-top:16px;background:var(--s2);border:1px solid var(--bd);border-radius:var(--r8);
           padding:12px 16px;font-size:12px;color:var(--txs);line-height:1.8">
        💡 <strong style="color:var(--tx)">Pro Tip:</strong> Jangan pernah jelek-jelekin kompetitor
        di depan toko. Fokus ke value yang kita bawa: margin lebih sehat, distribusi CSAP yang
        reliable, dan ecosystem brand yang bikin toko jadi one-stop-shop.
        <strong style="color:var(--pu)">Let the numbers do the talking.</strong>
      </div>
    </div>`;
}

function playTab(t, el) {
  document.querySelectorAll('#play-tabs .atb').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('#sec-playbook .play-panel').forEach(p => p.classList.remove('on'));
  document.getElementById('pp-' + t).classList.add('on');
}
