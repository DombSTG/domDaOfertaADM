"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import {
  ExternalLink,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  X,
  Check,
} from "lucide-react";
import {
  approveOffer,
  rejectOffer,
  updateOfferPrice,
  updateOfferCurrentPrice,
  updateOfferAffiliateUrl,
  getPriceHistory,
} from "@/src/actions/offer-actions";
import type { Offer, PriceHistory } from "@/src/db/schema";

interface OfferCardProps {
  offer: Offer;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

function sanitizeTelegramHtml(text: string): string {
  let result = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
  result = result
    .replace(/&lt;(b|i|u|s|code)&gt;/gi, "<$1>")
    .replace(/&lt;\/(b|i|u|s|code)&gt;/gi, "</$1>")
    .replace(/&lt;a href="([^"]*)"&gt;/gi, '<a href="$1" target="_blank" rel="noopener">')
    .replace(/&lt;\/a&gt;/gi, "</a>")
    .replace(/\n/g, "<br>")
  return result
}

const fmtBRL = (v: number | string) =>
  Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function storeToMp(store: string): string {
  const s = store.toLowerCase()
  if (s.includes('amazon')) return 'amazon'
  if (s.includes('mercado')) return 'mercadolivre'
  if (s.includes('shopee')) return 'shopee'
  if (s.includes('magalu') || s.includes('magazine')) return 'magalu'
  return ''
}

export function OfferCard({ offer, onClose, onPrev, onNext, hasPrev, hasNext }: OfferCardProps) {
  const [title, setTitle] = useState(offer.title);
  const [copy, setCopy] = useState(offer.copyText ?? "");
  const [showPreview, setShowPreview] = useState(false);
  const [editedPrice, setEditedPrice] = useState(offer.oldPrice ?? "");
  const [editedCurrentPrice, setEditedCurrentPrice] = useState(offer.currentPrice ?? "");
  const [affiliateUrl, setAffiliateUrl] = useState(offer.affiliateUrl ?? "");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setTitle(offer.title);
    setCopy(offer.copyText ?? "");
    setEditedPrice(offer.oldPrice ?? "");
    setEditedCurrentPrice(offer.currentPrice ?? "");
    setAffiliateUrl(offer.affiliateUrl ?? "");
    setHistoryOpen(false);
    setHistoryLoaded(false);
    setHistory([]);
    setShowPreview(false);
  }, [offer.id]);

  useEffect(() => {
    if (historyOpen && !historyLoaded) {
      getPriceHistory(offer.id).then((rows) => {
        setHistory(rows);
        setHistoryLoaded(true);
      });
    }
  }, [historyOpen, historyLoaded, offer.id]);

  const handleApprove = () => {
    startTransition(async () => {
      await approveOffer(offer.id, title, copy);
      toast.success("Oferta aprovada!", { description: title });
      onClose();
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      await rejectOffer(offer.id);
      toast.info("Oferta descartada.", { description: offer.title });
      onClose();
    });
  };

  const pct =
    editedPrice && Number(editedPrice) > Number(editedCurrentPrice)
      ? Math.round((1 - Number(editedCurrentPrice) / Number(editedPrice)) * 100)
      : 0;

  const mpKey = storeToMp(offer.store);
  const dateStr = new Date(offer.createdAt).toLocaleDateString("pt-BR");

  return (
    <>
      {/* Header */}
      <div className="drawer-header">
        <button className="icon-btn" onClick={onClose} aria-label="Fechar">
          <X size={16} />
        </button>
        <div className="drawer-title-block">
          <div className="drawer-eyebrow">Revisão de oferta</div>
          <div className="drawer-title">
            {offer.id.slice(0, 8).toUpperCase()} · {offer.store}
          </div>
        </div>
        <div className="drawer-nav-btns">
          <button
            className="icon-btn"
            onClick={onPrev}
            disabled={!hasPrev}
            aria-label="Anterior"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            className="icon-btn"
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Próxima"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="drawer-body">
        {/* Hero */}
        <div className="review-hero">
          <div
            className="review-img"
            style={offer.imageUrl ? { backgroundImage: `url('${offer.imageUrl}')` } : undefined}
          />
          <div className="review-side">
            <div className="review-meta">
              <span className="marketplace-chip" data-mp={mpKey || undefined}>
                {offer.store}
              </span>
              <span>·</span>
              <span>{dateStr}</span>
            </div>
            <div className="review-prices">
              <span className="review-price-current">
                R$ {fmtBRL(editedCurrentPrice || offer.currentPrice)}
              </span>
              {editedPrice && Number(editedPrice) > Number(editedCurrentPrice) && (
                <span className="review-price-original">
                  R$ {fmtBRL(editedPrice)}
                </span>
              )}
            </div>
            {pct > 0 && (
              <span className="discount-badge">
                <TrendingUp size={11} /> −{pct}% de desconto
              </span>
            )}
            {(offer.rating || offer.reviews) && (
              <div className="review-rating">
                {offer.rating && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ color: 'var(--warning)' }}>★</span>
                    <strong style={{ color: 'var(--text)' }}>{offer.rating}</strong>
                  </span>
                )}
                {offer.reviews && (
                  <span>({Number(offer.reviews).toLocaleString('pt-BR')} avaliações)</span>
                )}
              </div>
            )}
            <a
              className="review-link"
              href={offer.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={12} /> Abrir na loja
            </a>
          </div>
        </div>

        {/* Título */}
        <div className="field-group">
          <label className="field-label">Título</label>
          <input
            className="field-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
          />
        </div>

        {/* Texto da mensagem */}
        <div className="field-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="field-label">Texto da mensagem</label>
            <button
              type="button"
              onClick={() => setShowPreview((p) => !p)}
              className="btn btn-ghost"
              style={{ padding: '2px 6px', fontSize: 11 }}
            >
              {showPreview ? 'Editar' : 'Preview'}
            </button>
          </div>
          {showPreview ? (
            <div
              className="field-preview"
              dangerouslySetInnerHTML={{ __html: sanitizeTelegramHtml(copy) }}
            />
          ) : (
            <textarea
              className="field-textarea"
              value={copy}
              onChange={(e) => setCopy(e.target.value)}
              placeholder="Escreva o texto promocional..."
              disabled={isPending}
              rows={4}
            />
          )}
        </div>

        {/* Preços */}
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Preço original</label>
            <div className="field-action-row">
              <div className="input-with-prefix" style={{ flex: 1 }}>
                <span className="prefix">R$</span>
                <input
                  className="field-input"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await updateOfferPrice(offer.id, editedPrice);
                    toast.success("Preço atualizado!");
                  });
                }}
              >
                Salvar
              </button>
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Preço da oferta</label>
            <div className="field-action-row">
              <div className="input-with-prefix" style={{ flex: 1 }}>
                <span className="prefix">R$</span>
                <input
                  className="field-input"
                  value={editedCurrentPrice}
                  onChange={(e) => setEditedCurrentPrice(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await updateOfferCurrentPrice(offer.id, editedCurrentPrice);
                    toast.success("Preço atualizado!");
                  });
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>

        {/* Link de afiliado */}
        <div className="field-group">
          <label className="field-label">Link de afiliado</label>
          <div className="field-action-row">
            <input
              className="field-input"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, flex: 1 }}
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              disabled={isPending}
              placeholder="https://..."
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await updateOfferAffiliateUrl(offer.id, affiliateUrl);
                  toast.success("Link de afiliado atualizado!");
                });
              }}
            >
              Salvar
            </button>
          </div>
        </div>

        {/* Histórico de preços */}
        <div>
          <button
            type="button"
            className="history-toggle"
            onClick={() => setHistoryOpen((o) => !o)}
          >
            <span>Histórico de preços</span>
            {historyOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
          {historyOpen && (
            <div className="history-body">
              {!historyLoaded ? (
                <p style={{ padding: '12px', fontSize: 12, color: 'var(--text-muted)' }}>Carregando…</p>
              ) : history.length === 0 ? (
                <p style={{ padding: '12px', fontSize: 12, color: 'var(--text-muted)' }}>Sem registros.</p>
              ) : (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Atual</th>
                      <th>Anterior</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id}>
                        <td>{new Date(h.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td>R$ {fmtBRL(h.currentPrice)}</td>
                        <td>{h.oldPrice ? `R$ ${fmtBRL(h.oldPrice)}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="drawer-footer">
        <button
          className="btn btn-danger"
          onClick={handleReject}
          disabled={isPending}
        >
          <X size={14} /> Reprovar
        </button>
        <div style={{ flex: 1 }} />
        <button
          className="btn btn-ghost"
          onClick={onClose}
          disabled={isPending}
        >
          Cancelar
        </button>
        <button
          className="btn btn-success"
          onClick={handleApprove}
          disabled={isPending || !title.trim()}
        >
          <Check size={14} /> Aprovar
        </button>
      </div>
    </>
  );
}
