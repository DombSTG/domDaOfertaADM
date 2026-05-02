// View pages: Pending, Approved, Rejected, All, Members

function StatsBar({ items }) {
  return (
    <div className="stats-bar">
      {items.map((it, i) => (
        <div className="stat-card" key={i}>
          <div className="stat-label">{it.label}</div>
          <div className="stat-value tabular">{it.value}</div>
          <div className={`stat-delta ${it.deltaDir || ''}`}>{it.delta}</div>
        </div>
      ))}
    </div>
  );
}

function FilterBar({ filter, setFilter, options, density, setDensity, showDensity }) {
  return (
    <div className="section-bar">
      <span className="section-label">{options.title}</span>
      <span className="section-count">{options.count}</span>
      <div className="filters">
        {options.chips.map(c => (
          <button key={c.id} className={`chip ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
            {c.label}
          </button>
        ))}
        {showDensity && (
          <button className="chip" title="Mudar densidade" onClick={() => setDensity(density === 'compact' ? 'normal' : density === 'normal' ? 'cozy' : 'compact')}>
            <Icon.Filter size={12} /> {density === 'compact' ? 'Compacto' : density === 'cozy' ? 'Confortável' : 'Normal'}
          </button>
        )}
      </div>
    </div>
  );
}

function PendingView({ offers, density, onSelect, selectedId, onApprove, onReject }) {
  const [filter, setFilter] = React.useState('all');
  const filtered = filter === 'all' ? offers : offers.filter(o => o.marketplace === filter);
  return (
    <React.Fragment>
      <StatsBar items={[
        { label: 'Pendentes', value: offers.length, delta: 'na fila agora', deltaDir: '' },
        { label: 'Hoje', value: 12, delta: '+3 que ontem', deltaDir: 'up' },
        { label: 'Esta semana', value: 87, delta: '−4 vs semana passada', deltaDir: 'down' },
        { label: 'Taxa de aprovação', value: '78%', delta: '+2pp vs mês', deltaDir: 'up' },
      ]} />
      <FilterBar
        filter={filter} setFilter={setFilter}
        options={{
          title: 'Pendentes',
          count: filtered.length,
          chips: [
            { id: 'all', label: 'Todos' },
            { id: 'amazon', label: 'Amazon' },
            { id: 'mercadolivre', label: 'Mercado Livre' },
          ],
        }}
      />
      <div className="offer-list">
        {filtered.map(o => (
          <OfferRow
            key={o.id}
            offer={o}
            status="pending"
            density={density}
            onClick={onSelect}
            isSelected={selectedId === o.id}
            onApprove={onApprove}
            onReject={onReject}
            onEdit={onSelect}
          />
        ))}
      </div>
    </React.Fragment>
  );
}

function ApprovedView({ offers, density, onSelect }) {
  const [filter, setFilter] = React.useState('all');
  const filtered = filter === 'all' ? offers : offers.filter(o => o.approvedBy === filter);
  return (
    <React.Fragment>
      <StatsBar items={[
        { label: 'Aprovados (total)', value: '2.176', delta: 'desde 01/2024', deltaDir: '' },
        { label: 'Esta semana', value: 24, delta: '+18% vs semana passada', deltaDir: 'up' },
        { label: 'Cliques (7d)', value: '4.832', delta: '+12% vs período anterior', deltaDir: 'up' },
        { label: 'CTR médio', value: '6.4%', delta: '+0.3pp', deltaDir: 'up' },
      ]} />
      <FilterBar
        filter={filter} setFilter={setFilter}
        options={{
          title: 'Aprovados',
          count: filtered.length,
          chips: [
            { id: 'all', label: 'Todos' },
            { id: 'Dom', label: 'Por Dom' },
            { id: 'Esposa', label: 'Por Esposa' },
          ],
        }}
      />
      <div className="offer-list">
        {filtered.map(o => (
          <OfferRow
            key={o.id}
            offer={o}
            status="approved"
            density={density}
            onClick={onSelect}
            extra={
              <span className="approved-extra">
                <span className="tiny-avatar" style={{background: o.approvedBy === 'Dom' ? 'oklch(0.55 0.18 290)' : 'oklch(0.65 0.15 30)'}}>{o.approvedBy[0]}</span>
                {o.approvedBy} · {o.approvedAt} · {o.clicks} cliques
              </span>
            }
          />
        ))}
      </div>
    </React.Fragment>
  );
}

function RejectedView({ offers, density, onSelect }) {
  return (
    <React.Fragment>
      <StatsBar items={[
        { label: 'Rejeitados (total)', value: 457, delta: 'desde 01/2024', deltaDir: '' },
        { label: 'Esta semana', value: 8, delta: '−2 vs semana passada', deltaDir: 'down' },
        { label: 'Motivo top', value: 'Sem desconto', delta: '34% dos casos', deltaDir: '' },
        { label: 'Tempo médio', value: '12s', delta: 'até decidir', deltaDir: '' },
      ]} />
      <div className="section-bar">
        <span className="section-label">Rejeitados</span>
        <span className="section-count">{offers.length}</span>
      </div>
      <div className="offer-list">
        {offers.map(o => (
          <OfferRow
            key={o.id}
            offer={o}
            status="rejected"
            density={density}
            onClick={onSelect}
            extra={
              <span className="rejected-extra">
                <span className="rejected-reason">{o.reason}</span>
                · por {o.rejectedBy} · {o.rejectedAt}
              </span>
            }
          />
        ))}
      </div>
    </React.Fragment>
  );
}

function AllView({ offers, density, onSelect }) {
  const [filter, setFilter] = React.useState('all');
  const status = (o) => o.approvedBy ? 'approved' : o.rejectedBy ? 'rejected' : 'pending';
  const filtered = filter === 'all' ? offers : offers.filter(o => status(o) === filter);
  return (
    <React.Fragment>
      <FilterBar
        filter={filter} setFilter={setFilter}
        options={{
          title: 'Todos',
          count: filtered.length,
          chips: [
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendentes' },
            { id: 'approved', label: 'Aprovados' },
            { id: 'rejected', label: 'Rejeitados' },
          ],
        }}
      />
      <div className="offer-list">
        {filtered.map(o => (
          <OfferRow
            key={o.id}
            offer={o}
            status={status(o)}
            density={density}
            onClick={onSelect}
          />
        ))}
      </div>
    </React.Fragment>
  );
}

function MembersView({ members }) {
  return (
    <React.Fragment>
      <div className="section-bar">
        <span className="section-label">Membros</span>
        <span className="section-count">{members.length}</span>
        <div className="filters">
          <button className="chip"><Icon.Plus size={12}/> Convidar</button>
        </div>
      </div>
      <div className="members-grid">
        {members.map(m => (
          <div className="member-card" key={m.id}>
            <div className="member-head">
              <div className="member-avatar" style={{background: m.color}}>{m.avatar}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <span className="member-name">{m.name}</span>
                  <span className={`member-role-badge ${m.role.toLowerCase()}`}>{m.role}</span>
                </div>
                <div className="member-email">{m.email}</div>
              </div>
            </div>
            <div className="member-stats">
              <div className="stat">
                <div className="stat-value success tabular">{m.stats.approved.toLocaleString('pt-BR')}</div>
                <div className="stat-label">Aprovadas</div>
              </div>
              <div className="stat">
                <div className="stat-value danger tabular">{m.stats.rejected}</div>
                <div className="stat-label">Rejeitadas</div>
              </div>
              <div className="stat">
                <div className="stat-value tabular">{m.stats.pending}</div>
                <div className="stat-label">Pendentes</div>
              </div>
            </div>
            <div className="member-foot">
              <span>Entrou em {m.joinedAt}</span>
              <span style={{display:'flex', alignItems:'center', gap:5}}>
                {m.lastActive === 'Agora' && <span className="online-dot"></span>}
                {m.lastActive}
              </span>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

window.PendingView = PendingView;
window.ApprovedView = ApprovedView;
window.RejectedView = RejectedView;
window.AllView = AllView;
window.MembersView = MembersView;
window.StatsBar = StatsBar;
