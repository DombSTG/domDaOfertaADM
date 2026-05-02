'use client'

import { Check, X, Pencil } from 'lucide-react'
import type { Offer } from '@/src/db/schema'
import { memo, useTransition } from 'react'
import { approveOffer, rejectOffer } from '@/src/actions/offer-actions'
import { toast } from 'sonner'

type Density = 'compact' | 'normal' | 'cozy'

interface OfferListItemProps {
  offer: Offer
  density?: Density
  isSelected?: boolean
  index: number
  onSelect: (index: number) => void
  onApprove?: () => void
  onReject?: () => void
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

export const OfferListItem = memo(function OfferListItem({
  offer,
  density = 'normal',
  isSelected = false,
  index,
  onSelect,
  onApprove,
  onReject,
}: OfferListItemProps) {
  const [isPending, startTransition] = useTransition()

  const pct =
    offer.oldPrice && Number(offer.oldPrice) > Number(offer.currentPrice)
      ? Math.round((1 - Number(offer.currentPrice) / Number(offer.oldPrice)) * 100)
      : 0

  const mpKey = storeToMp(offer.store)
  const dateStr = new Date(offer.createdAt).toLocaleDateString('pt-BR')

  function handleApprove(e: React.MouseEvent) {
    e.stopPropagation()
    if (onApprove) { onApprove(); return }
    startTransition(async () => {
      await approveOffer(offer.id, offer.title, offer.copyText ?? '')
      toast.success('Oferta aprovada!')
    })
  }

  function handleReject(e: React.MouseEvent) {
    e.stopPropagation()
    if (onReject) { onReject(); return }
    startTransition(async () => {
      await rejectOffer(offer.id)
      toast.info('Oferta reprovada.')
    })
  }

  return (
    <div
      className={`offer-row${density !== 'normal' ? ` ${density}` : ''}${isSelected ? ' selected' : ''}`}
      onClick={() => onSelect(index)}
      style={{ opacity: isPending ? 0.5 : 1 }}
    >
      <span className={`offer-status ${offer.status}`} aria-hidden />

      <div
        className="offer-img"
        style={offer.imageUrl ? { backgroundImage: `url('${offer.imageUrl}')` } : undefined}
        aria-hidden
      />

      <div className="offer-main">
        <div className="offer-title">{offer.title}</div>
        <div className="offer-meta-row">
          <span className="marketplace-chip" data-mp={mpKey || undefined}>
            {offer.store}
          </span>
        </div>
      </div>

      <div className="offer-discount tabular">
        {pct > 0 ? `−${pct}%` : ''}
      </div>

      <div className="offer-price-block">
        <div className="offer-price">R$ {fmtBRL(offer.currentPrice)}</div>
        {offer.oldPrice && Number(offer.oldPrice) > Number(offer.currentPrice) && (
          <div className="offer-price-original">R$ {fmtBRL(offer.oldPrice)}</div>
        )}
      </div>

      <div className="offer-tail">
        <span className="offer-date tabular">{dateStr}</span>
        <div className="offer-actions" onClick={(e) => e.stopPropagation()}>
          <button className="row-action" title="Editar" onClick={() => onSelect(index)}>
            <Pencil size={12} />
          </button>
          <button className="row-action reject" title="Reprovar" onClick={handleReject}>
            <X size={13} />
          </button>
          <button className="row-action approve" title="Aprovar" onClick={handleApprove}>
            <Check size={13} />
          </button>
        </div>
      </div>
    </div>
  )
})
