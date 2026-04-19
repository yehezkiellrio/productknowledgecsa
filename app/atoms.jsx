// Shared UI atoms
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const cx = (...xs) => xs.filter(Boolean).join(' ');

// ─── ICONS ─────────────────────────────────────────────
const Icon = ({ name, size = 16, stroke = 1.75, className }) => {
  const P = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round',
    strokeLinejoin: 'round', className
  };
  const paths = {
    home:    <><path d="M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></>,
    catalog: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    playbook:<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    spek:    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></>,
    admin:   <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    search:  <><circle cx="11" cy="11" r="7.5"/><path d="m20 20-3.5-3.5"/></>,
    bell:    <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>,
    help:    <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"/><path d="M12 17h.01"/></>,
    menu:    <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>,
    x:       <><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>,
    arrow:   <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    arrowL:  <><path d="M19 12H5M11 5l-7 7 7 7"/></>,
    chev:    <><path d="m9 6 6 6-6 6"/></>,
    chevD:   <><path d="m6 9 6 6 6-6"/></>,
    plus:    <><path d="M12 5v14M5 12h14"/></>,
    filter:  <><path d="M3 5h18M6 12h12M10 19h4"/></>,
    trend:   <><path d="M3 17 9 11l4 4 8-8"/><path d="M14 7h7v7"/></>,
    pkg:     <><path d="m7.5 4.5 9 5M3 7l9 5 9-5M12 22V12M21 17V7a1 1 0 0 0-.5-.87l-8-4.6a1 1 0 0 0-1 0l-8 4.6A1 1 0 0 0 3 7v10a1 1 0 0 0 .5.87l8 4.6a1 1 0 0 0 1 0l8-4.6A1 1 0 0 0 21 17z"/></>,
    chart:   <><path d="M3 3v18h18"/><rect x="7" y="13" width="3" height="5"/><rect x="13" y="9" width="3" height="9"/><rect x="19" y="5" width="3" height="13"/></>,
    zap:     <><path d="m13 2-9 13h8l-1 7 9-13h-8z"/></>,
    pin:     <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    check:   <><path d="m5 12 5 5L20 7"/></>,
    copy:    <><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    ext:     <><path d="M7 17 17 7M8 7h9v9"/></>,
    doc:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    upload:  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    edit:    <><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></>,
    trash:   <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    dot:     <><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/></>,
    div:     <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    grid:    <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    list:    <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    layers:  <><path d="m12 2 10 6-10 6L2 8z"/><path d="m2 17 10 6 10-6M2 12l10 6 10-6"/></>,
    target:  <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></>,
    bolt:    <><path d="m13 2-9 13h8l-1 7 9-13h-8z"/></>,
    shield:  <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></>,
    bookmark:<><path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></>
  };
  return <svg {...P}>{paths[name]}</svg>;
};

// ─── TOAST ─────────────────────────────────────────────
const ToastContext = React.createContext(null);
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, tone = 'default') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600);
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} className="fade-up"
            style={{
              padding: '10px 14px',
              background: 'var(--ink)',
              color: 'var(--paper)',
              borderRadius: 'var(--r-m)',
              fontSize: 13, fontWeight: 500,
              boxShadow: 'var(--sh-3)',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
            <Icon name={t.tone === 'success' ? 'check' : 'dot'} size={14} />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
const useToast = () => React.useContext(ToastContext);

// ─── DRAWER ────────────────────────────────────────────
const Drawer = ({ open, onClose, children, width = 560 }) => {
  useEffect(() => {
    const esc = e => e.key === 'Escape' && open && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'rgba(23,23,15,.36)',
        backdropFilter: 'blur(2px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity .22s cubic-bezier(.2,.6,.2,1)'
      }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 90,
        width: 'min(96vw,' + width + 'px)',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--hair)',
        boxShadow: 'var(--sh-3)',
        transform: open ? 'none' : 'translateX(100%)',
        transition: 'transform .32s cubic-bezier(.2,.6,.2,1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>{children}</div>
    </>
  );
};

// ─── MODAL ─────────────────────────────────────────────
const Modal = ({ open, onClose, children, width = 480 }) => {
  useEffect(() => {
    const esc = e => e.key === 'Escape' && open && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(23,23,15,.45)',
      backdropFilter: 'blur(4px)',
      display: 'grid', placeItems: 'center',
      padding: 20,
      animation: 'fadeUp .2s both'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: width,
        background: 'var(--surface)',
        border: '1px solid var(--hair)',
        borderRadius: 'var(--r-xl)',
        boxShadow: 'var(--sh-3)',
        overflow: 'hidden'
      }}>{children}</div>
    </div>
  );
};

Object.assign(window, { Icon, cx, Drawer, Modal, ToastProvider, useToast });
