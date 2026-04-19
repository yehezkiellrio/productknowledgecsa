// Admin view — PIN gate, dashboard CRUD mock
const { DIVISIONS: AD_DIVS, BRANDS: AD_BRANDS, PRODUCTS: AD_PRODS, ACTIVITY: AD_ACT } = window.CSAP_DATA;

const AdminView = () => {
  const [stage, setStage] = useState(() => sessionStorage.getItem('csap_admin') === 'ok' ? 'dash' : 'pin');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);
  const toast = useToast();

  const submitPin = () => {
    if (pin === '2468') {
      sessionStorage.setItem('csap_admin', 'ok');
      setStage('dash');
      toast.push('Admin session dimulai', 'success');
    } else {
      setErr(true);
      setPin('');
      setTimeout(() => setErr(false), 600);
    }
  };

  if (stage === 'pin') {
    return (
      <div className="page fade-up" style={{ maxWidth: 420, margin: '80px auto', textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12,
          background: 'var(--paper-2)', border: '1px solid var(--hair)',
          display: 'grid', placeItems: 'center',
          margin: '0 auto 24px',
          color: 'var(--ink-2)'
        }}><Icon name="pin" size={22} /></div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Restricted</div>
        <h1 className="font-display" style={{ fontSize: 26, letterSpacing: '-.02em', marginBottom: 10 }}>Masuk Admin Panel</h1>
        <p style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: 28 }}>
          Admin panel buat maintain katalog, playbook, dan paket bundling. Masukkan 4-digit PIN (demo: <span className="mono" style={{ color: 'var(--accent)' }}>2468</span>).
        </p>
        <div style={{
          display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20,
          animation: err ? 'shake .4s' : 'none'
        }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: 48, height: 54,
              border: '1.5px solid ' + (err ? '#C54A3B' : (pin.length === i ? 'var(--ink)' : 'var(--hair)')),
              background: 'var(--surface)',
              borderRadius: 'var(--r-m)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'Inter Tight', fontSize: 22, fontWeight: 600,
              transition: 'var(--t-m)'
            }}>
              {pin[i] ? '•' : ''}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxWidth: 220, margin: '0 auto' }}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => { setErr(false); pin.length < 4 && setPin(pin + n); }} style={{
              height: 52,
              background: 'var(--surface)',
              border: '1px solid var(--hair)',
              borderRadius: 'var(--r-m)',
              fontFamily: 'Inter Tight', fontSize: 20, fontWeight: 500,
              color: 'var(--ink)',
              transition: 'var(--t-q)',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}>
              {n}
            </button>
          ))}
          <button onClick={() => setPin('')} style={{
            height: 52, background: 'transparent', border: '1px solid var(--hair)',
            borderRadius: 'var(--r-m)', fontSize: 11, color: 'var(--ink-3)', cursor: 'pointer'
          }}>Clear</button>
          <button onClick={() => { setErr(false); pin.length < 4 && setPin(pin + 0); }} style={{
            height: 52, background: 'var(--surface)', border: '1px solid var(--hair)',
            borderRadius: 'var(--r-m)', fontFamily: 'Inter Tight', fontSize: 20, fontWeight: 500, cursor: 'pointer'
          }}>0</button>
          <button onClick={submitPin} disabled={pin.length !== 4} style={{
            height: 52, background: pin.length === 4 ? 'var(--ink)' : 'var(--paper-2)',
            color: pin.length === 4 ? 'var(--paper)' : 'var(--ink-4)',
            border: 'none', borderRadius: 'var(--r-m)',
            fontSize: 12, fontWeight: 600, letterSpacing: '.05em',
            textTransform: 'uppercase',
            cursor: pin.length === 4 ? 'pointer' : 'not-allowed',
            transition: 'var(--t-m)'
          }}>OK</button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => { sessionStorage.removeItem('csap_admin'); setStage('pin'); setPin(''); toast.push('Logout berhasil'); }} />;
};

const AdminDashboard = ({ onLogout }) => {
  const [tab, setTab] = useState('overview');
  const tabs = [
    { id: 'overview',  label: 'Overview',  icon: 'chart' },
    { id: 'brands',    label: 'Brands',    icon: 'layers' },
    { id: 'products',  label: 'Products',  icon: 'catalog' },
    { id: 'playbook',  label: 'Playbook',  icon: 'playbook' },
    { id: 'audit',     label: 'Audit Log', icon: 'doc' }
  ];
  return (
    <div className="page fade-up" style={{ maxWidth: 1300 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow" style={{ color: 'var(--accent)' }}>Admin · Session aktif</div>
          <h1 className="font-display">Control Panel</h1>
          <p className="lead">
            Maintain katalog, playbook, dan paket bundling. Perubahan di sini langsung ke sales tim.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={onLogout}><Icon name="x" size={13} /> Logout</button>
          <button className="btn btn-primary"><Icon name="plus" size={13} /> Add New</button>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 2,
        borderBottom: '1px solid var(--hair)',
        marginBottom: 28
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 16px 12px',
            fontSize: 13, fontWeight: tab === t.id ? 600 : 500,
            color: tab === t.id ? 'var(--ink)' : 'var(--ink-3)',
            borderBottom: '2px solid ' + (tab === t.id ? 'var(--ink)' : 'transparent'),
            marginBottom: -1,
            display: 'flex', alignItems: 'center', gap: 7,
            transition: 'var(--t-m)'
          }}>
            <Icon name={t.icon} size={13} />{t.label}
          </button>
        ))}
      </div>

      <div key={tab} className="fade-up">
        {tab === 'overview' && <AdminOverview />}
        {tab === 'brands'   && <AdminBrands />}
        {tab === 'products' && <AdminProducts />}
        {tab === 'playbook' && <AdminPlaybookTable />}
        {tab === 'audit'    && <AdminAudit />}
      </div>
    </div>
  );
};

const AdminOverview = () => {
  const stats = [
    { k: 'Brand aktif',   v: AD_BRANDS.length, d: '+2 bulan ini', up: true },
    { k: 'Produk',        v: AD_PRODS.length, d: '+12 minggu ini', up: true },
    { k: 'Playbook item', v: 27, d: 'Stabil', up: null },
    { k: 'Katalog PDF',   v: 6,  d: '+1 baru',  up: true }
  ];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.k} className="card card-pad">
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 10 }}>{s.k}</div>
            <div className="num-xl font-display">{s.v}</div>
            <div style={{ fontSize: 12, color: s.up ? 'var(--accent)' : 'var(--ink-3)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              {s.up && <Icon name="trend" size={11} />} {s.d}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        <div>
          <SectionTitle eyebrow="Per divisi" title="Distribusi produk" />
          <div className="card" style={{ padding: 22 }}>
            {AD_DIVS.map(d => {
              const count = AD_BRANDS.filter(b => b.division === d.no).reduce((s, b) => s + b.products, 0);
              const pct = Math.min(100, (count / 800) * 100);
              return (
                <div key={d.no} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={'badge badge-div-' + d.no}>D{d.no}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{d.title}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{count}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--paper-2)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: pct + '%',
                      background: `var(--div${d.no})`,
                      transition: 'width .6s cubic-bezier(.2,.6,.2,1)'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <SectionTitle eyebrow="Activity" title="Recent changes" />
          <div className="card" style={{ padding: 16 }}>
            {AD_ACT.map((a, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '10px 0',
                borderTop: i ? '1px solid var(--hair)' : 'none'
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 99,
                  background: 'var(--paper-2)', border: '1px solid var(--hair)',
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'Inter Tight', fontWeight: 600, fontSize: 11, flexShrink: 0
                }}>{a.user.slice(0,2).toUpperCase()}</div>
                <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.5 }}>
                  <div><strong>{a.user}</strong> <span style={{ color: 'var(--ink-3)' }}>{a.action}</span></div>
                  <div style={{ fontWeight: 500 }}>{a.what}</div>
                </div>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{a.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminBrands = () => {
  const toast = useToast();
  const [q, setQ] = useState('');
  const filtered = AD_BRANDS.filter(b => !q || b.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 12px', height: 36,
          background: 'var(--surface)', border: '1px solid var(--hair)',
          borderRadius: 'var(--r-m)'
        }}>
          <Icon name="search" size={14} className="muted" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari brand..." style={{ border: 'none', outline: 'none', flex: 1, fontSize: 13, background: 'transparent' }} />
        </div>
        <button className="btn btn-ghost btn-sm"><Icon name="filter" size={13} /> Filter</button>
        <button className="btn btn-primary btn-sm"><Icon name="plus" size={13} /> Brand Baru</button>
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 100px 180px 80px 100px',
          padding: '10px 16px',
          fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)',
          textTransform: 'uppercase', letterSpacing: '.08em',
          background: 'var(--paper-2)', borderBottom: '1px solid var(--hair)'
        }}>
          <div></div><div>Brand</div><div>Divisi</div><div>Kategori</div><div>SKU</div><div>Aksi</div>
        </div>
        {filtered.map((b, i) => (
          <div key={b.id} style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 100px 180px 80px 100px',
            padding: '12px 16px',
            fontSize: 13,
            borderTop: i ? '1px solid var(--hair)' : 'none',
            alignItems: 'center',
            transition: 'background var(--t-q)'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'var(--paper-2)', border: '1px solid var(--hair)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 11
            }}>{b.label.slice(0, 2).toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{b.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 1 }}>{b.website}</div>
            </div>
            <div><span className={'badge badge-div-' + b.division}>D{b.division}</span></div>
            <div style={{ color: 'var(--ink-3)' }}>{b.category}</div>
            <div className="mono" style={{ fontSize: 12 }}>{b.products}</div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="icon-btn" onClick={() => toast.push('Edit: ' + b.label)}><Icon name="edit" size={13} /></button>
              <button className="icon-btn" onClick={() => toast.push('Hapus pending: ' + b.label)}><Icon name="trash" size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const toast = useToast();
  const [q, setQ] = useState('');
  const filtered = AD_PRODS.filter(p =>
    !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.code.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 40);
  const label = id => AD_BRANDS.find(b => b.id === id)?.label;
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 36, background: 'var(--surface)', border: '1px solid var(--hair)', borderRadius: 'var(--r-m)' }}>
          <Icon name="search" size={14} className="muted" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari kode atau nama produk..." style={{ border: 'none', outline: 'none', flex: 1, fontSize: 13, background: 'transparent' }} />
        </div>
        <button className="btn btn-ghost btn-sm"><Icon name="upload" size={13} /> Import CSV</button>
        <button className="btn btn-primary btn-sm"><Icon name="plus" size={13} /> Produk Baru</button>
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '110px 1fr 110px 120px 110px 80px 100px',
          padding: '10px 16px',
          fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)',
          textTransform: 'uppercase', letterSpacing: '.08em',
          background: 'var(--paper-2)', borderBottom: '1px solid var(--hair)'
        }}>
          <div>Code</div><div>Nama</div><div>Brand</div><div>Series</div><div>Ukuran</div><div>SP</div><div>Aksi</div>
        </div>
        {filtered.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid',
            gridTemplateColumns: '110px 1fr 110px 120px 110px 80px 100px',
            padding: '11px 16px',
            fontSize: 13,
            borderTop: i ? '1px solid var(--hair)' : 'none',
            alignItems: 'center'
          }}>
            <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{p.code}</div>
            <div style={{ fontWeight: 500 }}>{p.name}</div>
            <div style={{ color: 'var(--ink-3)', fontSize: 12 }}>{label(p.brand)}</div>
            <div style={{ color: 'var(--ink-3)' }}>{p.series}</div>
            <div style={{ color: 'var(--ink-3)' }}>{p.size}</div>
            <div style={{ fontWeight: 600, color: 'var(--accent)' }}>{p.sp}</div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="icon-btn" onClick={() => toast.push('Edit ' + p.code)}><Icon name="edit" size={12} /></button>
              <button className="icon-btn"><Icon name="copy" size={12} /></button>
              <button className="icon-btn"><Icon name="trash" size={12} /></button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 4px', fontSize: 12, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Menampilkan {filtered.length} dari {AD_PRODS.length} produk</span>
        <span>Page 1 / {Math.ceil(AD_PRODS.length / 40)}</span>
      </div>
    </div>
  );
};

const AdminPlaybookTable = () => {
  const { ARGS: A, BRANDS: B } = window.CSAP_DATA;
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost btn-sm"><Icon name="filter" size={13} /> Divisi</button>
        <button className="btn btn-primary btn-sm"><Icon name="plus" size={13} /> Argument Baru</button>
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 140px 140px 1fr 80px',
          padding: '10px 16px',
          fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)',
          textTransform: 'uppercase', letterSpacing: '.08em',
          background: 'var(--paper-2)', borderBottom: '1px solid var(--hair)'
        }}>
          <div>Div</div><div>Brand</div><div>vs</div><div>Argument</div><div>Aksi</div>
        </div>
        {A.map((a, i) => {
          const b = B.find(x => x.id === a.brand);
          return (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '60px 140px 140px 1fr 80px',
              padding: '11px 16px',
              fontSize: 13,
              borderTop: i ? '1px solid var(--hair)' : 'none',
              alignItems: 'center'
            }}>
              <div><span className={'badge badge-div-' + b?.division}>D{b?.division}</span></div>
              <div style={{ fontWeight: 600 }}>{b?.label}</div>
              <div style={{ color: 'var(--ink-3)' }}>{a.vs}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5, paddingRight: 14 }}>{a.text}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="icon-btn"><Icon name="edit" size={12} /></button>
                <button className="icon-btn"><Icon name="trash" size={12} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AdminAudit = () => {
  const log = [
    ...AD_ACT,
    { t: '3h', user: 'Yehezkiel', action: 'created', what: 'Killer Arg — Mowilex vs Nippon Paint', kind: 'playbook' },
    { t: '4h', user: 'Admin',     action: 'deleted', what: 'Produk lama: BRX-2019-OLD',            kind: 'product' },
    { t: '1d', user: 'Yehezkiel', action: 'imported',what: 'CSV 120 produk Arwana',                kind: 'product' },
    { t: '2d', user: 'Admin',     action: 'updated', what: 'Paket Kamar Tidur Nyaman',             kind: 'playbook' },
    { t: '3d', user: 'Yehezkiel', action: 'created', what: 'Brand: Sterlyn Hybrid Panel',          kind: 'brand' }
  ];
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px 120px 120px 1fr 100px',
        padding: '10px 16px',
        fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)',
        textTransform: 'uppercase', letterSpacing: '.08em',
        background: 'var(--paper-2)', borderBottom: '1px solid var(--hair)'
      }}>
        <div>Waktu</div><div>User</div><div>Action</div><div>Target</div><div>Kategori</div>
      </div>
      {log.map((a, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '80px 120px 120px 1fr 100px',
          padding: '11px 16px',
          fontSize: 13,
          borderTop: i ? '1px solid var(--hair)' : 'none',
          alignItems: 'center'
        }}>
          <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{a.t} lalu</div>
          <div style={{ fontWeight: 500 }}>{a.user}</div>
          <div style={{ color: 'var(--ink-3)' }}>{a.action}</div>
          <div>{a.what}</div>
          <div><span className="badge">{a.kind}</span></div>
        </div>
      ))}
    </div>
  );
};

Object.assign(window, { AdminView });
