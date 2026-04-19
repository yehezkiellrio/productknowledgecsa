// Playbook + Spek views
const { DIVISIONS: DIVS, BRANDS: BR, GAPS: GP, ARGS: AR, PACKAGES: PK } = window.CSAP_DATA;

const threatCls = l => ({
  'LOW':'low','LOW-MED':'low','MEDIUM':'med','MEDIUM-HIGH':'med','HIGH':'high','VERY HIGH':'vhi'
}[l] || 'med');

const PlaybookView = ({ initial }) => {
  const tabs = [
    { id: 'exec',   label: 'Executive', icon: 'target' },
    { id: 'div1',   label: 'Divisi 1',  sub: 'Finishing' },
    { id: 'div2',   label: 'Divisi 2',  sub: 'Hardware' },
    { id: 'div3',   label: 'Divisi 3',  sub: 'Flooring' },
    { id: 'div4',   label: 'Divisi 4',  sub: 'Structural' },
    { id: 'bundle', label: 'Cross-Selling', icon: 'pkg' },
    { id: 'cheat',  label: 'Cheatsheet', icon: 'zap' }
  ];
  const [tab, setTab] = useState(initial?.tab || 'exec');
  useEffect(() => { if (initial?.tab) setTab(initial.tab); }, [initial]);

  return (
    <div className="page fade-up" style={{ maxWidth: 1200 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">Sales Playbook · MT Supervisor</div>
          <h1 className="font-display">Peta persaingan, killer arguments & cross-selling.</h1>
          <p className="lead">
            Dokumen lapangan untuk Sales Supervisor. Tau mana yang perlu di-defend, mana yang bisa di-push, dan gimana cara ngomong ke toko.
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 2,
        borderBottom: '1px solid var(--hair)',
        marginBottom: 28,
        overflowX: 'auto'
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 16px 12px',
            fontSize: 13, fontWeight: tab === t.id ? 600 : 500,
            color: tab === t.id ? 'var(--ink)' : 'var(--ink-3)',
            borderBottom: '2px solid ' + (tab === t.id ? 'var(--ink)' : 'transparent'),
            marginBottom: -1,
            display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
            transition: 'var(--t-m)'
          }}>
            {t.icon && <Icon name={t.icon} size={13} />}
            {t.label}
            {t.sub && <span style={{ color: 'var(--ink-4)', fontWeight: 400, fontSize: 12 }}>· {t.sub}</span>}
          </button>
        ))}
      </div>

      <div key={tab} className="fade-up">
        {tab === 'exec' && <PlaybookExec />}
        {tab.startsWith('div') && <PlaybookDiv n={+tab.slice(3)} />}
        {tab === 'bundle' && <PlaybookBundle />}
        {tab === 'cheat' && <PlaybookCheat />}
      </div>
    </div>
  );
};

const PlaybookExec = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 28 }}>
    <div>
      <div className="font-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.015em', marginBottom: 10 }}>
        Executive Summary
      </div>
      <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.7, marginBottom: 28 }}>
        CSAP adalah <em style={{ color: 'var(--accent)' }}>one-stop-shop</em> untuk bahan bangunan — dari pondasi sampai finishing.
        Dokumen ini adalah amunisi lapangan: tau mana yang perlu di-defend, mana yang bisa di-push, dan gimana cara ngomong ke toko biar mereka mau switch atau nambahin brand kita.
      </p>

      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, fontFamily: 'Inter Tight' }}>
        Key takeaways per divisi
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {DIVS.map(d => (
          <div key={d.no} style={{
            padding: 18,
            border: '1px solid var(--hair)',
            borderLeft: `3px solid var(--div${d.no})`,
            borderRadius: 'var(--r-m)',
            background: 'var(--surface)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className={'badge badge-div-' + d.no}>D{d.no}</span>
              <span className="font-display" style={{ fontWeight: 700, fontSize: 14.5, letterSpacing: '-.01em' }}>{d.title}</span>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>{d.key_takeaway}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        padding: 22,
        background: 'var(--ink)',
        color: 'var(--paper)',
        borderRadius: 'var(--r-l)'
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#A3A39B', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>
          Portfolio CSAP
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div>
            <div className="font-display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-.03em' }}>4</div>
            <div style={{ fontSize: 11, color: '#A3A39B', marginTop: 4 }}>Divisi</div>
          </div>
          <div>
            <div className="font-display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-.03em' }}>30+</div>
            <div style={{ fontSize: 11, color: '#A3A39B', marginTop: 4 }}>Brand</div>
          </div>
          <div>
            <div className="font-display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-.03em' }}>Full</div>
            <div style={{ fontSize: 11, color: '#A3A39B', marginTop: 4 }}>Material</div>
          </div>
        </div>
      </div>
      <div className="card card-pad">
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10, fontFamily: 'Inter Tight' }}>
          Rules of engagement
        </div>
        <ol style={{ paddingLeft: 18, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>Never jelek-jelekin kompetitor di depan toko.</li>
          <li>Focus ke value: margin sehat, distribusi reliable, ecosystem.</li>
          <li>Let the numbers do the talking.</li>
          <li>Availability &gt; fancy branding.</li>
        </ol>
      </div>
    </div>
  </div>
);

const PlaybookDiv = ({ n }) => {
  const div = DIVS.find(d => d.no === n);
  const brandIds = BR.filter(b => b.division === n).map(b => b.id);
  const gaps = GP.filter(g => brandIds.includes(g.brand));
  const args = AR.filter(a => brandIds.includes(a.brand));
  const label = id => BR.find(b => b.id === id)?.label || id;

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
        <span className={'badge badge-div-' + n}>Divisi {n}</span>
        <span className="font-display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.015em' }}>{div.title}</span>
      </div>
      {div.tagline && (
        <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6, maxWidth: 720, marginBottom: 24 }}>{div.tagline}</p>
      )}

      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, fontFamily: 'Inter Tight' }}>
        Market Gap Analysis
      </div>
      <div className="card" style={{ overflow: 'hidden', marginBottom: 32 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '180px 110px 120px 1fr',
          padding: '10px 16px',
          fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)',
          textTransform: 'uppercase', letterSpacing: '.08em',
          background: 'var(--paper-2)',
          borderBottom: '1px solid var(--hair)'
        }}>
          <div>Brand</div><div>Threat</div><div>Opportunity</div><div>Catatan</div>
        </div>
        {gaps.map((g, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '180px 110px 120px 1fr',
            padding: '12px 16px',
            fontSize: 13,
            borderTop: i ? '1px solid var(--hair)' : 'none',
            alignItems: 'center'
          }}>
            <div style={{ fontWeight: 600 }}>{label(g.brand)}</div>
            <div><span className={'badge badge-' + threatCls(g.threat)}>{g.threat}</span></div>
            <div><span className={'badge badge-' + threatCls(g.opp)}>{g.opp}</span></div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.55 }}>{g.note}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, fontFamily: 'Inter Tight' }}>
        Killer Arguments
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
        {args.map((a, i) => (
          <div key={i} className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className="font-display" style={{ fontWeight: 700, fontSize: 14 }}>{label(a.brand)}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>vs</span>
              <span style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{a.vs}</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ink-2)', marginBottom: 12 }}>
              "{a.text}"
            </div>
            <div style={{
              padding: '8px 12px',
              background: 'var(--paper-2)',
              borderRadius: 'var(--r-s)',
              fontSize: 11.5,
              color: 'var(--ink-3)',
              display: 'flex', alignItems: 'flex-start', gap: 6,
              borderLeft: '2px solid var(--accent)'
            }}>
              <Icon name="zap" size={12} />
              <span style={{ lineHeight: 1.5 }}>{a.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlaybookBundle = () => (
  <div>
    <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, maxWidth: 720, marginBottom: 24 }}>
      CSAP punya advantage yang kompetitor single-brand nggak punya: <strong style={{ color: 'var(--accent)' }}>ecosystem</strong>.
      Satu kontraktor bisa beli hampir semua kebutuhan dari kita.
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {PK.map((p, i) => (
        <div key={p.id} className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div style={{
              fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 28, letterSpacing: '-.03em',
              color: 'var(--ink-5)', lineHeight: 1
            }}>0{i + 1}</div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div className="font-display" style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.015em', marginBottom: 3 }}>
                {p.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 12 }}>{p.subtitle}</div>
              <div style={{
                padding: 12,
                background: 'var(--paper-2)',
                borderRadius: 'var(--r-m)',
                fontSize: 12.5, color: 'var(--ink-3)',
                marginBottom: 16, lineHeight: 1.6
              }}>
                <strong style={{ color: 'var(--ink-2)', display: 'block', marginBottom: 3, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em' }}>Target</strong>
                {p.target}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {p.items.map(it => (
                  <span key={it.label} className="badge" style={{ fontSize: 11.5, padding: '2px 10px', height: 24 }}>
                    {it.label} <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>· {it.detail}</span>
                  </span>
                ))}
              </div>
              <div style={{
                padding: '14px 16px',
                background: 'var(--ink)', color: 'var(--paper)',
                borderRadius: 'var(--r-m)',
                fontSize: 13, lineHeight: 1.55
              }}>
                <span style={{ color: '#A3A39B', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', display: 'block', marginBottom: 4 }}>Selling point</span>
                {p.sp}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PlaybookCheat = () => (
  <div>
    <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, maxWidth: 720, marginBottom: 20 }}>
      Quick reference lapangan — satu kalimat per brand. Print, screenshot, atau buka dari HP.
    </p>
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '160px 180px 1fr',
        padding: '10px 16px',
        fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)',
        textTransform: 'uppercase', letterSpacing: '.08em',
        background: 'var(--paper-2)',
        borderBottom: '1px solid var(--hair)'
      }}>
        <div>Brand CSAP</div><div>vs Kompetitor</div><div>Killer Argument</div>
      </div>
      {AR.map((a, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '160px 180px 1fr',
          padding: '12px 16px',
          fontSize: 13,
          borderTop: i ? '1px solid var(--hair)' : 'none'
        }}>
          <div style={{ fontWeight: 600 }}>{BR.find(b => b.id === a.brand)?.label}</div>
          <div style={{ color: 'var(--ink-3)' }}>{a.vs}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>{a.note}</div>
        </div>
      ))}
    </div>
    <div style={{
      marginTop: 16,
      padding: 16,
      background: 'var(--accent-soft)',
      border: '1px solid rgba(15,81,50,.16)',
      borderRadius: 'var(--r-m)',
      fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6
    }}>
      💡 <strong>Pro tip:</strong> Jangan pernah jelek-jelekin kompetitor di depan toko. Focus ke value yang kita bawa — margin lebih sehat, distribusi CSAP reliable, ecosystem brand yang bikin toko jadi one-stop-shop. <strong style={{ color: 'var(--accent)' }}>Let the numbers do the talking.</strong>
    </div>
  </div>
);

// ─── SPEK KERAMIK ──────────────────────────────────────
const SpekView = () => {
  const catalogs = [
    { brand: 'UNO + ARNA',   title: 'E-Catalog UNO 3060 mix ARNA 6060', desc: 'Update Oktober 2024', pages: 70 },
    { brand: 'Arwana',        title: 'Arwana Carrara Series Collection', desc: 'Release 2024',      pages: 42 },
    { brand: 'Cotto',         title: 'Cotto Sanitary Catalogue',         desc: 'Luxury Living 2024', pages: 128 },
    { brand: 'Ceranosa',      title: 'Ceranosa Terrazzo Collection',     desc: 'Q3 2024',            pages: 56 },
    { brand: 'Salvador',      title: 'Salvador Granite Tile 6060/8080',  desc: 'Fall 2024',          pages: 64 },
    { brand: 'Casania Floor', title: 'Casania SPC Acoustic Series',      desc: 'Updated Nov 2024',   pages: 48 }
  ];
  return (
    <div className="page fade-up" style={{ maxWidth: 1200 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">Spek Keramik</div>
          <h1 className="font-display">E-catalog produk keramik &amp; granit</h1>
          <p className="lead">
            Semua katalog PDF yang bisa dibuka langsung di HP sales. Tap untuk preview, download, atau share ke customer.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {catalogs.map((c, i) => (
          <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="ph" style={{
              aspectRatio: '3 / 4',
              borderRadius: 0,
              borderWidth: '0 0 1px 0'
            }}>catalog-cover · {c.brand}</div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
                {c.brand}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3, marginBottom: 4, letterSpacing: '-.005em' }}>
                {c.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.desc} · {c.pages} hal</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                <button className="btn btn-sm btn-ghost" style={{ flex: 1 }}>
                  <Icon name="doc" size={12} /> Preview
                </button>
                <button className="btn btn-sm btn-ghost">
                  <Icon name="ext" size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { PlaybookView, SpekView });
