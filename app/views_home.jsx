// Home dashboard, Catalog view, Product drawer
const { DIVISIONS, BRANDS, PRODUCTS, GAPS, ARGS, PACKAGES, ACTIVITY } = window.CSAP_DATA;

// ─── HOME ──────────────────────────────────────────────
const HomeView = ({ onGo, onOpenBrand }) => {
  const totalProducts = BRANDS.reduce((s, b) => s + b.products, 0);
  const divStats = DIVISIONS.map(d => ({
    ...d,
    brandCount: BRANDS.filter(b => b.division === d.no).length,
    productCount: BRANDS.filter(b => b.division === d.no).reduce((s, b) => s + b.products, 0)
  }));
  const pinned = ['arna','cotto','mowilex','knauf','sterlyn','timmerman']
    .map(id => BRANDS.find(b => b.id === id));
  return (
    <div className="page fade-up">
      <div className="page-head">
        <div>
          <div className="eyebrow">Dashboard · MT Panel</div>
          <h1 className="font-display">{"\n"}</h1>
          <p className="lead">
            Product Knowledge CSAP. Katalog 30+ brand, Sales Playbook 4 divisi, dan semua amunisi lapangan yang dipakai Sales Supervisor.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => onGo('spek')}>
            <Icon name="spek" /> Spek Keramik
          </button>
          <button className="btn btn-primary" onClick={() => onGo('playbook')}>
            <Icon name="playbook" /> Sales Playbook
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
        border: '1px solid var(--hair)', borderRadius: 'var(--r-l)',
        overflow: 'hidden', background: 'var(--surface)',
        marginBottom: 32
      }}>
        {[
          { k: 'Divisi',      v: 4,             sub: 'Kategori strategi' },
          { k: 'Brand aktif', v: BRANDS.length, sub: '30+ brand portfolio' },
          { k: 'SKU produk',  v: totalProducts.toLocaleString('id-ID'), sub: 'Total katalog master' },
          { k: 'Playbook',    v: ARGS.length,   sub: 'Killer arguments siap pakai' }
        ].map((x, i, a) => (
          <div key={x.k} style={{
            padding: '22px 24px',
            borderRight: i < a.length - 1 ? '1px solid var(--hair)' : 'none'
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
              {x.k}
            </div>
            <div className="num-xl font-display">{x.v}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>{x.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 28, alignItems: 'flex-start' }}>

        {/* Divisions */}
        <div>
          <SectionTitle eyebrow="Portfolio" title="Empat divisi, satu distribusi" action={
            <button className="btn btn-sm btn-ghost" onClick={() => onGo('catalog')}>
              Lihat semua <Icon name="arrow" size={13} />
            </button>
          } />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {divStats.map(d => (
              <button key={d.no} onClick={() => onGo('catalog', { division: d.no })} className="card" style={{ textAlign: 'left', padding: 18, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span className={'badge badge-div-' + d.no}>Divisi {d.no}</span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{d.productCount} SKU</span>
                </div>
                <div className="font-display" style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, letterSpacing: '-.01em' }}>
                  {d.title}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 16 }}>
                  {d.tagline || '—'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--hair)' }}>
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                    <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{d.brandCount}</strong> brand
                  </span>
                  <Icon name="arrow" size={14} className="muted" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Pinned brands */}
          <div>
            <SectionTitle eyebrow="Pinned" title="Brand yang sering di-buka" />
            <div className="card" style={{ overflow: 'hidden' }}>
              {pinned.map((b, i) => (
                <button key={b.id} onClick={() => onOpenBrand(b.id)} style={{
                  width: '100%', padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  borderTop: i ? '1px solid var(--hair)' : 'none',
                  textAlign: 'left', cursor: 'pointer',
                  transition: 'background var(--t-q)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 6,
                    background: 'var(--paper-2)', border: '1px solid var(--hair)',
                    display: 'grid', placeItems: 'center',
                    fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 13, color: 'var(--ink-2)'
                  }}>{b.label.slice(0, 2).toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ink)' }}>{b.label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.category}</div>
                  </div>
                  <span className={'badge badge-div-' + b.division}>D{b.division}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div>
            <SectionTitle eyebrow="Activity" title="Update terakhir" />
            <div className="card" style={{ padding: 18 }}>
              {ACTIVITY.slice(0, 5).map((a, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: i ? '12px 0 0' : 0,
                  borderTop: i ? '1px solid var(--hair)' : 'none',
                  marginTop: i ? 0 : 0,
                  paddingTop: i ? 12 : 0
                }}>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)', width: 28, paddingTop: 2 }}>{a.t}</div>
                  <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--ink-2)' }}>{a.user}</span>
                    <span style={{ color: 'var(--ink-3)' }}> {a.action} </span>
                    <span style={{ fontWeight: 600 }}>{a.what}</span>
                  </div>
                  <span className="badge" style={{ fontSize: 10 }}>{a.kind}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Playbook teaser */}
      <div style={{
        marginTop: 36,
        padding: 28,
        background: 'var(--ink)',
        color: 'var(--paper)',
        borderRadius: 'var(--r-xl)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 32,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: '#A3A39B', marginBottom: 10 }}>
            Sales Playbook · MT Supervisor
          </div>
          <h2 className="font-display" style={{ fontSize: 28, lineHeight: 1.15, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 14 }}>
            Amunisi lapangan. 30+ brand, 27 killer arguments, 4 paket bundling.
          </h2>
          <p style={{ color: '#D9D8D0', fontSize: 13.5, lineHeight: 1.6, maxWidth: 460 }}>
            Tau mana yang perlu di-defend, mana yang bisa di-push, dan gimana cara ngomong ke toko biar mau switch atau nambahin brand kita.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button className="btn btn-accent" onClick={() => onGo('playbook')}>
              Buka Playbook <Icon name="arrow" size={13} />
            </button>
            <button className="btn btn-ghost" onClick={() => onGo('playbook', { tab: 'cheat' })}
              style={{ background: 'transparent', color: '#FAFAF7', borderColor: '#3A3A33' }}>
              ⚡ Cheatsheet
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {DIVISIONS.map(d => (
            <div key={d.no} style={{
              padding: 14,
              border: '1px solid #3A3A33',
              borderRadius: 8,
              background: 'rgba(255,255,255,.03)'
            }}>
              <div style={{ fontSize: 10.5, color: '#A3A39B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
                Divisi {d.no} · {d.short}
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: '#E6E4DC' }}>
                {d.key_takeaway.split('.')[0]}.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ eyebrow, title, action }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4, fontFamily: 'Inter Tight' }}>{eyebrow}</div>
      <div className="font-display" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.01em' }}>{title}</div>
    </div>
    {action}
  </div>
);

// ─── CATALOG ───────────────────────────────────────────
const CatalogView = ({ initial, onOpenBrand, onOpenProduct, query }) => {
  const [division, setDivision] = useState(initial?.division || 0); // 0 = all
  const [brandId, setBrandId] = useState(initial?.brandId || null);
  const [view, setView] = useState('grid');

  useEffect(() => {
    if (initial?.brandId) setBrandId(initial.brandId);
    if (initial?.division) setDivision(initial.division);
  }, [initial]);

  const brandsFiltered = useMemo(() =>
    BRANDS.filter(b => (division === 0 || b.division === division))
          .filter(b => !query || b.label.toLowerCase().includes(query.toLowerCase()) || b.category.toLowerCase().includes(query.toLowerCase())),
    [division, query]
  );
  const activeBrand = brandsFiltered.find(b => b.id === brandId) || null;
  const products = useMemo(() => {
    let list = PRODUCTS;
    if (brandId) list = list.filter(p => p.brand === brandId);
    else if (division) list = list.filter(p => p.division === division);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.series.toLowerCase().includes(q));
    }
    return list;
  }, [brandId, division, query]);

  return (
    <div className="page fade-up" style={{ maxWidth: 1400 }}>
      <div className="page-head">
        <div>
          <div className="eyebrow">Katalog</div>
          <h1 className="font-display">
            {activeBrand ? activeBrand.label : (division ? DIVISIONS.find(d => d.no === division).title : 'Semua produk CSAP')}
          </h1>
          <p className="lead">
            {activeBrand ? activeBrand.desc :
              division ? DIVISIONS.find(d => d.no === division).tagline :
              'Browse semua brand CSAP. Klik brand di samping untuk lihat katalog produk spesifik.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
            <Icon name={view === 'grid' ? 'list' : 'grid'} size={13} /> {view === 'grid' ? 'List' : 'Grid'}
          </button>
          {activeBrand && (
            <a className="btn btn-ghost btn-sm" href={'https://' + activeBrand.website} target="_blank">
              {activeBrand.website} <Icon name="ext" size={12} />
            </a>
          )}
        </div>
      </div>

      {/* Division chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        <DivChip active={division === 0} onClick={() => { setDivision(0); setBrandId(null); }}>Semua Divisi</DivChip>
        {DIVISIONS.map(d => (
          <DivChip key={d.no} active={division === d.no} div={d.no} onClick={() => { setDivision(d.no); setBrandId(null); }}>
            Divisi {d.no} · {d.short}
          </DivChip>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Brand list */}
        <div style={{ position: 'sticky', top: 0 }}>
          <div className="card" style={{ padding: 8, maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
            <button onClick={() => setBrandId(null)} style={{
              width: '100%', padding: '8px 12px', textAlign: 'left',
              borderRadius: 'var(--r-m)', fontSize: 13, fontWeight: 500,
              background: brandId === null ? 'var(--paper-2)' : 'transparent',
              color: brandId === null ? 'var(--ink)' : 'var(--ink-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span>Semua brand</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{brandsFiltered.length}</span>
            </button>
            {brandsFiltered.map(b => (
              <button key={b.id} onClick={() => setBrandId(b.id)} style={{
                width: '100%', padding: '8px 12px', textAlign: 'left',
                borderRadius: 'var(--r-m)', fontSize: 13,
                fontWeight: brandId === b.id ? 600 : 500,
                background: brandId === b.id ? 'var(--paper-2)' : 'transparent',
                color: brandId === b.id ? 'var(--ink)' : 'var(--ink-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 8,
                transition: 'background var(--t-q)'
              }}
              onMouseEnter={e => brandId !== b.id && (e.currentTarget.style.background = 'rgba(23,23,15,.04)')}
              onMouseLeave={e => brandId !== b.id && (e.currentTarget.style.background = 'transparent')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: brandId === b.id ? 'var(--accent)' : 'var(--ink-5)', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.label}</span>
                </span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{b.products}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {activeBrand && <BrandHeader brand={activeBrand} />}

          {products.length === 0 ? (
            <EmptyState
              title={query ? `Tidak ada hasil untuk "${query}"` : 'Pilih brand untuk lihat produk'}
              sub={query ? 'Coba keyword lain, atau hapus filter.' : 'Klik brand di sisi kiri — atau browse dengan command palette (⌘K).'}
            />
          ) : (
            view === 'grid'
              ? <ProductGrid items={products} onOpen={onOpenProduct} />
              : <ProductTable items={products} onOpen={onOpenProduct} />
          )}

          {!activeBrand && brandsFiltered.length > 0 && products.length === 0 && (
            <BrandCloudGrid brands={brandsFiltered} onOpen={id => setBrandId(id)} />
          )}
        </div>
      </div>
    </div>
  );
};

const DivChip = ({ active, children, onClick, div }) => (
  <button onClick={onClick} style={{
    height: 30, padding: '0 12px',
    borderRadius: 99,
    border: '1px solid ' + (active ? 'var(--ink)' : 'var(--hair)'),
    background: active ? 'var(--ink)' : 'var(--surface)',
    color: active ? 'var(--paper)' : 'var(--ink-2)',
    fontSize: 12.5, fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: 6,
    transition: 'var(--t-m)'
  }}>
    {div && <span style={{
      width: 6, height: 6, borderRadius: 99,
      background: active ? 'var(--paper)' : `var(--div${div})`
    }} />}
    {children}
  </button>
);

const BrandHeader = ({ brand }) => (
  <div style={{
    padding: 22,
    background: 'var(--surface)',
    border: '1px solid var(--hair)',
    borderRadius: 'var(--r-l)',
    marginBottom: 18,
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 20,
    alignItems: 'center'
  }}>
    <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: 10,
        background: 'var(--paper-2)', border: '1px solid var(--hair)',
        display: 'grid', placeItems: 'center',
        fontFamily: 'Inter Tight', fontWeight: 800, fontSize: 17, letterSpacing: '-.02em',
        color: 'var(--ink)'
      }}>{brand.label.slice(0, 2).toUpperCase()}</div>
      <div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <span className={'badge badge-div-' + brand.division}>Divisi {brand.division}</span>
          <span className="badge">{brand.category}</span>
        </div>
        <div className="font-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.01em' }}>{brand.label}</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)', maxWidth: 540, lineHeight: 1.5, marginTop: 4 }}>{brand.desc}</div>
      </div>
    </div>
    <div style={{ textAlign: 'right', paddingLeft: 20, borderLeft: '1px solid var(--hair)' }}>
      <div className="num-xl font-display">{brand.products}</div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 4 }}>Produk</div>
    </div>
  </div>
);

const ProductGrid = ({ items, onOpen }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
    {items.map(p => (
      <button key={p.id} onClick={() => onOpen(p)} className="card" style={{ padding: 0, overflow: 'hidden', textAlign: 'left', cursor: 'pointer' }}>
        <div className="ph" style={{ height: 160, borderRadius: 0, borderWidth: '0 0 1px 0' }}>{p.sub}</div>
        <div style={{ padding: 14 }}>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)', marginBottom: 4 }}>{p.code}</div>
          <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 2, letterSpacing: '-.005em' }}>{p.name}</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{p.series} · {p.size}</div>
          <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>{p.sp}</div>
        </div>
      </button>
    ))}
  </div>
);

const ProductTable = ({ items, onOpen }) => (
  <div className="card" style={{ overflow: 'hidden' }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: '110px 1fr 130px 140px 110px 120px 32px',
      padding: '10px 16px',
      fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)',
      textTransform: 'uppercase', letterSpacing: '.08em',
      borderBottom: '1px solid var(--hair)',
      background: 'var(--paper-2)'
    }}>
      <div>Code</div><div>Nama</div><div>Series</div><div>Ukuran</div><div>Finish</div><div>SP</div><div></div>
    </div>
    {items.map((p, i) => (
      <button key={p.id} onClick={() => onOpen(p)} style={{
        width: '100%', textAlign: 'left',
        display: 'grid',
        gridTemplateColumns: '110px 1fr 130px 140px 110px 120px 32px',
        padding: '12px 16px',
        fontSize: 13,
        alignItems: 'center',
        borderTop: i ? '1px solid var(--hair)' : 'none',
        cursor: 'pointer',
        transition: 'background var(--t-q)'
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--paper-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{p.code}</div>
        <div style={{ fontWeight: 600 }}>{p.name}</div>
        <div style={{ color: 'var(--ink-3)' }}>{p.series}</div>
        <div style={{ color: 'var(--ink-3)' }}>{p.size}</div>
        <div style={{ color: 'var(--ink-3)' }}>{p.finish}</div>
        <div style={{ fontWeight: 600, color: 'var(--accent)' }}>{p.sp}</div>
        <Icon name="chev" size={14} className="muted" />
      </button>
    ))}
  </div>
);

const BrandCloudGrid = ({ brands, onOpen }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginTop: 8 }}>
    {brands.map(b => (
      <button key={b.id} onClick={() => onOpen(b.id)} className="card" style={{ padding: 16, textAlign: 'left', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 6,
            background: 'var(--paper-2)', border: '1px solid var(--hair)',
            display: 'grid', placeItems: 'center',
            fontFamily: 'Inter Tight', fontWeight: 700, fontSize: 13
          }}>{b.label.slice(0, 2).toUpperCase()}</div>
          <span className={'badge badge-div-' + b.division}>D{b.division}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3, fontFamily: 'Inter Tight', letterSpacing: '-.01em' }}>{b.label}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginBottom: 10 }}>{b.category}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {b.desc}
        </div>
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--hair)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{b.products} SKU</span>
          <Icon name="arrow" size={13} className="muted" />
        </div>
      </button>
    ))}
  </div>
);

const EmptyState = ({ title, sub }) => (
  <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--ink-3)' }}>
    <div style={{
      width: 48, height: 48, borderRadius: 10,
      margin: '0 auto 18px',
      background: 'var(--paper-2)', border: '1px solid var(--hair)',
      display: 'grid', placeItems: 'center', color: 'var(--ink-4)'
    }}><Icon name="search" size={20} /></div>
    <div style={{ fontFamily: 'Inter Tight', fontSize: 16, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13 }}>{sub}</div>
  </div>
);

// ─── PRODUCT DRAWER ────────────────────────────────────
const ProductDrawer = ({ product, open, onClose }) => {
  const brand = product ? BRANDS.find(b => b.id === product.brand) : null;
  const killer = product ? ARGS.find(a => a.brand === product.brand) : null;
  return (
    <Drawer open={open} onClose={onClose} width={620}>
      {product && (
        <>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--hair)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={'badge badge-div-' + product.division}>Divisi {product.division}</span>
            <span className="badge">{brand.label}</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', marginLeft: 'auto' }}>{product.code}</span>
            <button className="icon-btn" onClick={onClose}><Icon name="x" size={16} /></button>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div className="ph" style={{ height: 280, borderRadius: 0, border: 'none', borderBottom: '1px solid var(--hair)' }}>
              product-shot · {product.name}
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div className="font-display" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.015em', lineHeight: 1.15, marginBottom: 6 }}>
                {product.name}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 18 }}>
                {brand.label} · {product.series}
              </div>

              <div style={{
                padding: '14px 18px',
                background: 'var(--paper-2)',
                borderRadius: 'var(--r-m)',
                border: '1px solid var(--hair)',
                marginBottom: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-3)', fontWeight: 600, marginBottom: 4 }}>SP (Sales Price)</div>
                  <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{product.sp}</div>
                </div>
                <button className="btn btn-sm btn-ghost"><Icon name="copy" size={13} /> Copy</button>
              </div>

              <SpecTable rows={[
                ['Kode Produk', product.code],
                ['Nama', product.name],
                ['Kategori', brand.category],
                ['Subkategori', product.sub],
                ['Series', product.series],
                ['Ukuran', product.size],
                ['Finish', product.finish],
                ['Status', <span className="badge badge-accent">Aktif</span>]
              ]} />

              {killer && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--ink-3)', fontWeight: 600, marginBottom: 10, fontFamily: 'Inter Tight' }}>
                    Killer Argument · {brand.label} vs {killer.vs}
                  </div>
                  <div style={{
                    padding: 18,
                    background: 'var(--ink)', color: 'var(--paper)',
                    borderRadius: 'var(--r-l)',
                    fontSize: 14, lineHeight: 1.6
                  }}>
                    <Icon name="zap" size={14} /> &nbsp;
                    {killer.text}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                <button className="btn btn-ghost">
                  <Icon name="copy" size={13} /> Share link
                </button>
                <button className="btn btn-ghost">
                  <Icon name="doc" size={13} /> Spek PDF
                </button>
                <button className="btn btn-ghost">
                  <Icon name="bookmark" size={13} /> Pin produk
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
};

const SpecTable = ({ rows }) => (
  <div style={{ border: '1px solid var(--hair)', borderRadius: 'var(--r-m)', overflow: 'hidden' }}>
    {rows.map(([k, v], i) => (
      <div key={k} style={{
        display: 'grid', gridTemplateColumns: '140px 1fr',
        padding: '11px 16px',
        fontSize: 13,
        borderTop: i ? '1px solid var(--hair)' : 'none',
        background: i % 2 ? 'var(--paper-2)' : 'transparent'
      }}>
        <div style={{ color: 'var(--ink-3)', fontWeight: 500 }}>{k}</div>
        <div style={{ fontWeight: 500 }}>{v}</div>
      </div>
    ))}
  </div>
);

Object.assign(window, { HomeView, CatalogView, ProductDrawer, SectionTitle, DivChip, EmptyState });
