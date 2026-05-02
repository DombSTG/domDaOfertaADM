// Review drawer / modal
function ReviewPanel({ offer, mode, onClose, onApprove, onReject, onPrev, onNext, hasPrev, hasNext }) {
  const [title, setTitle] = React.useState(offer?.title || '');
  const [message, setMessage] = React.useState(offer?.message || '');
  const [price, setPrice] = React.useState(offer?.price?.toFixed(2) || '');
  const [original, setOriginal] = React.useState(offer?.original?.toFixed(2) || '');
  const [link, setLink] = React.useState(offer?.link || '');

  React.useEffect(() => {
    if (offer) {
      setTitle(offer.title);
      setMessage(offer.message || '');
      setPrice(offer.price.toFixed(2));
      setOriginal(offer.original.toFixed(2));
      setLink(offer.link);
    }
  }, [offer?.id]);

  if (!offer) return null;
  const pct = discountPct(parseFloat(price) || 0, parseFloat(original) || 0);
  const mp = window.MARKETPLACES[offer.marketplace];

  return (
    <React.Fragment>
      <div className={`drawer-overlay ${offer ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`drawer ${mode === 'modal' ? 'modal-mode' : ''} ${offer ? 'open' : ''}`}>
        <div className="drawer-header">
          <button className="icon-btn" onClick={onClose} aria-label="Fechar"><Icon.X size={16}/></button>
          <div className="drawer-title-block">
            <div className="drawer-eyebrow">Revisão de oferta</div>
            <div className="drawer-title">#{String(offer.id).padStart(4, '0')} · {mp?.name}</div>
          </div>
          <div className="drawer-nav-btns">
            <button className="icon-btn" onClick={onPrev} disabled={!hasPrev} aria-label="Anterior" style={{opacity: hasPrev?1:0.3}}><Icon.ArrowLeft size={16}/></button>
            <button className="icon-btn" onClick={onNext} disabled={!hasNext} aria-label="Próxima" style={{opacity: hasNext?1:0.3}}><Icon.ArrowRight size={16}/></button>
          </div>
        </div>

        <div className="drawer-body">
          <div className="review-hero">
            <div className="review-img" style={{backgroundImage: `url('${offer.img}')`, backgroundSize: 'cover'}}></div>
            <div className="review-side">
              <div className="review-meta">
                <MarketplaceChip id={offer.marketplace} />
                <span>·</span>
                <span>{offer.category}</span>
                <span>·</span>
                <span>{offer.submitted}</span>
              </div>
              <div className="review-prices">
                <span className="review-price-current">R$ {fmtBRL(parseFloat(price) || 0)}</span>
                {parseFloat(original) > parseFloat(price) && (
                  <span className="review-price-original">R$ {fmtBRL(parseFloat(original) || 0)}</span>
                )}
              </div>
              {pct > 0 && (
                <div>
                  <span className="discount-badge"><Icon.TrendingUp size={11}/> −{pct}% de desconto</span>
                </div>
              )}
              <a className="review-link" href={`https://${offer.link}`} target="_blank" rel="noopener">
                <Icon.ExternalLink /> Abrir na loja
              </a>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Título</label>
            <input className="field-input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="field-group">
            <label className="field-label">Texto da mensagem</label>
            <textarea className="field-textarea" value={message} onChange={e => setMessage(e.target.value)} placeholder="Adicione uma mensagem para o post (opcional)" />
          </div>

          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Preço original</label>
              <div className="input-with-prefix">
                <span className="prefix">R$</span>
                <input className="field-input" value={original} onChange={e => setOriginal(e.target.value)} />
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Preço da oferta</label>
              <div className="input-with-prefix">
                <span className="prefix">R$</span>
                <input className="field-input" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Link de afiliado</label>
            <input className="field-input" value={link} onChange={e => setLink(e.target.value)} style={{fontFamily: 'var(--font-mono)', fontSize: 12.5}} />
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-danger" onClick={() => onReject(offer)}>
            <Icon.X size={14}/> Reprovar
          </button>
          <div style={{flex: 1}}></div>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-success" onClick={() => onApprove({ ...offer, title, message, price: parseFloat(price), original: parseFloat(original), link })}>
            <Icon.Check size={14}/> Aprovar
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

window.ReviewPanel = ReviewPanel;
