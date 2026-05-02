// Sidebar component
function Sidebar({ activeView, setActiveView, counts, theme, setTheme, dom }) {
  const items = [
    { id: 'pending', label: 'Fila de Aprovação', icon: <Icon.Inbox />, count: counts.pending },
    { id: 'approved', label: 'Aprovados', icon: <Icon.Check />, count: counts.approved },
    { id: 'rejected', label: 'Rejeitados', icon: <Icon.X />, count: counts.rejected },
    { id: 'all', label: 'Todos', icon: <Icon.List />, count: counts.all },
    { id: 'members', label: 'Membros', icon: <Icon.Users />, count: counts.members },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">D</div>
        <div className="brand-name">Dom da Oferta</div>
      </div>

      <div className="sidebar-section-label">Moderação</div>
      <nav className="nav">
        {items.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
            <span className="nav-count">{item.count}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="add-offer-btn">
          <Icon.Plus size={14} /> Adicionar oferta
        </button>
        <div style={{display:'flex', alignItems:'center', gap:6}}>
          <div className="user-card" style={{flex:1}}>
            <div className="user-avatar" style={{background: dom.color}}>{dom.avatar}</div>
            <div style={{minWidth:0}}>
              <div className="user-name">{dom.name}</div>
              <div className="user-role">{dom.role}</div>
            </div>
          </div>
          <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
            {theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
          </button>
        </div>
      </div>
    </aside>
  );
}

// Topbar
function Topbar({ title, meta, query, setQuery }) {
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      {meta && <div className="topbar-meta">· {meta}</div>}
      <div className="topbar-right">
        <div className="search">
          <Icon.Search />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar oferta..." />
          <span className="kbd">⌘K</span>
        </div>
        <button className="icon-btn" aria-label="Notificações"><Icon.Bell /></button>
      </div>
    </div>
  );
}

// Marketplace chip
function MarketplaceChip({ id }) {
  const mp = window.MARKETPLACES[id];
  return <span className="marketplace-chip" data-mp={id}>{mp?.short || id}</span>;
}

// Format BRL
const fmtBRL = (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const discountPct = (price, original) => {
  if (!original || original <= price) return 0;
  return Math.round((1 - price / original) * 100);
};

// Single offer row
function OfferRow({ offer, status, density, onClick, isSelected, onApprove, onReject, onEdit, extra }) {
  const pct = discountPct(offer.price, offer.original);
  return (
    <div
      className={`offer-row ${density} ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(offer)}
    >
      <span className={`offer-status ${status}`} aria-hidden></span>
      <div className="offer-img" style={{backgroundImage: `url('${offer.img}')`}} aria-hidden></div>
      <div className="offer-main">
        <div className="offer-title">{offer.title}</div>
        <div className="offer-meta-row">
          <MarketplaceChip id={offer.marketplace} />
          {offer.message && <span className="offer-msg-icon" title={offer.message}><Icon.MessageSquare /></span>}
          {extra}
        </div>
      </div>
      <div className="offer-discount tabular">{pct > 0 ? `−${pct}%` : ''}</div>
      <div className="offer-price-block">
        <div className="offer-price">R$ {fmtBRL(offer.price)}</div>
        {offer.original > offer.price && <div className="offer-price-original">R$ {fmtBRL(offer.original)}</div>}
      </div>
      <div className="offer-tail">
        <span className="offer-date tabular">{offer.date}</span>
        {(onApprove || onReject) && (
          <div className="offer-actions" onClick={e => e.stopPropagation()}>
            {onEdit && <button className="row-action" title="Editar" onClick={() => onEdit(offer)}><Icon.Edit /></button>}
            {onReject && <button className="row-action reject" title="Rejeitar" onClick={() => onReject(offer)}><Icon.X size={14}/></button>}
            {onApprove && <button className="row-action approve" title="Aprovar" onClick={() => onApprove(offer)}><Icon.Check size={14}/></button>}
          </div>
        )}
      </div>
    </div>
  );
}

window.Sidebar = Sidebar;
window.Topbar = Topbar;
window.MarketplaceChip = MarketplaceChip;
window.OfferRow = OfferRow;
window.fmtBRL = fmtBRL;
window.discountPct = discountPct;
