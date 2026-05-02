// Main app

const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "normal",
  "panelMode": "drawer"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeView, setActiveView] = useState('pending');
  const [pending, setPending] = useState(window.PENDING_OFFERS);
  const [approved, setApproved] = useState(window.APPROVED_OFFERS);
  const [rejected, setRejected] = useState(window.REJECTED_OFFERS);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState(null);

  const dom = window.MEMBERS[0];
  const theme = tweaks.theme;
  const density = tweaks.density;
  const panelMode = tweaks.panelMode;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ESC closes drawer; arrow keys navigate when drawer open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelected(null);
      if (selected) {
        if (e.key === 'ArrowRight') gotoNext();
        if (e.key === 'ArrowLeft') gotoPrev();
        if (e.key === 'a' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); doApprove(selected); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const gotoNext = () => {
    if (!selected) return;
    const list = pending;
    const idx = list.findIndex(o => o.id === selected.id);
    if (idx >= 0 && idx < list.length - 1) setSelected(list[idx + 1]);
  };
  const gotoPrev = () => {
    if (!selected) return;
    const list = pending;
    const idx = list.findIndex(o => o.id === selected.id);
    if (idx > 0) setSelected(list[idx - 1]);
  };

  const showToast = (msg, undo) => {
    setToast({ msg, undo });
    setTimeout(() => setToast(t => t?.msg === msg ? null : t), 4000);
  };

  const doApprove = (offer) => {
    setPending(p => p.filter(o => o.id !== offer.id));
    setApproved(a => [{ ...offer, approvedBy: dom.name, approvedAt: 'agora', clicks: 0 }, ...a]);
    const next = pending[pending.findIndex(o => o.id === offer.id) + 1];
    setSelected(next || null);
    showToast(`Oferta aprovada: ${offer.title.slice(0, 50)}…`);
  };
  const doReject = (offer) => {
    setPending(p => p.filter(o => o.id !== offer.id));
    setRejected(r => [{ ...offer, rejectedBy: dom.name, rejectedAt: 'agora', reason: 'Rejeitada' }, ...r]);
    const next = pending[pending.findIndex(o => o.id === offer.id) + 1];
    setSelected(next || null);
    showToast(`Oferta rejeitada: ${offer.title.slice(0, 50)}…`);
  };

  const filteredPending = useMemo(() => {
    if (!query) return pending;
    return pending.filter(o => o.title.toLowerCase().includes(query.toLowerCase()));
  }, [pending, query]);

  const counts = {
    pending: pending.length,
    approved: approved.length,
    rejected: rejected.length,
    all: pending.length + approved.length + rejected.length,
    members: window.MEMBERS.length,
  };

  const titles = {
    pending: { title: 'Fila de Aprovação', meta: `${pending.length} ofertas aguardando` },
    approved: { title: 'Aprovados', meta: `${approved.length} no total` },
    rejected: { title: 'Rejeitados', meta: `${rejected.length} no total` },
    all: { title: 'Todos', meta: `${counts.all} ofertas` },
    members: { title: 'Membros', meta: `${window.MEMBERS.length} pessoas` },
  };

  const selectedIdx = selected ? pending.findIndex(o => o.id === selected.id) : -1;

  return (
    <React.Fragment>
      <div className="app">
        <Sidebar activeView={activeView} setActiveView={setActiveView} counts={counts} theme={theme} setTheme={(v) => setTweak('theme', v)} dom={dom} />
        <div className="main">
          <Topbar title={titles[activeView].title} meta={titles[activeView].meta} query={query} setQuery={setQuery} />
          <div className="content">
            {activeView === 'pending' && (
              <PendingView offers={filteredPending} density={density} onSelect={setSelected} selectedId={selected?.id} onApprove={doApprove} onReject={doReject} />
            )}
            {activeView === 'approved' && (
              <ApprovedView offers={approved} density={density} onSelect={setSelected} />
            )}
            {activeView === 'rejected' && (
              <RejectedView offers={rejected} density={density} onSelect={setSelected} />
            )}
            {activeView === 'all' && (
              <AllView offers={[...pending, ...approved, ...rejected]} density={density} onSelect={setSelected} />
            )}
            {activeView === 'members' && (
              <MembersView members={window.MEMBERS} />
            )}
          </div>
        </div>
      </div>

      <ReviewPanel
        offer={selected}
        mode={panelMode}
        onClose={() => setSelected(null)}
        onApprove={doApprove}
        onReject={doReject}
        onPrev={gotoPrev}
        onNext={gotoNext}
        hasPrev={selectedIdx > 0}
        hasNext={selectedIdx >= 0 && selectedIdx < pending.length - 1}
      />

      {toast && (
        <div className="toast-stack">
          <div className="toast">
            <Icon.Check size={14} />
            <span>{toast.msg}</span>
            <button onClick={() => setToast(null)}>Fechar</button>
          </div>
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Aparência">
          <TweakRadio label="Tema" value={theme} onChange={(v) => setTweak('theme', v)} options={[
            { value: 'light', label: 'Claro' },
            { value: 'dark', label: 'Escuro' },
          ]} />
          <TweakRadio label="Densidade da lista" value={density} onChange={(v) => setTweak('density', v)} options={[
            { value: 'compact', label: 'Compacto' },
            { value: 'normal', label: 'Normal' },
            { value: 'cozy', label: 'Confortável' },
          ]} />
        </TweakSection>
        <TweakSection title="Painel de revisão">
          <TweakRadio label="Modo" value={panelMode} onChange={(v) => setTweak('panelMode', v)} options={[
            { value: 'drawer', label: 'Drawer' },
            { value: 'modal', label: 'Modal' },
          ]} />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
