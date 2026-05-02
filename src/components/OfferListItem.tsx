'use client'

import { Check, X, Pencil } from 'lucide-react'
import Image from 'next/image'
import type { Offer } from '@/src/db/schema'
import { memo, useTransition } from 'react'
import { approveOffer, rejectOffer } from '@/src/actions/offer-actions'
import { toast } from 'sonner'

type Density = 'compact' | 'normal' | 'cozy'

export type ExtendedOffer = Offer & { userEmail?: string | null };

interface OfferListItemProps {
  offer: ExtendedOffer
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

  const email = offer.userEmail || 'dom@admin.com'
  const userName = email.split('@')[0]
  const userInitial = userName.charAt(0).toUpperCase()
  const userNameFormatted = userName.charAt(0).toUpperCase() + userName.slice(1)

  const dateStr = new Date(offer.createdAt).toLocaleDateString('pt-BR')
  
  const showApprovedExtra = offer.status === 'approved'
  const approvedAtObj = offer.approvedAt ? new Date(offer.approvedAt) : null
  const approvedStr = approvedAtObj ? `${approvedAtObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${approvedAtObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : ''

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

      <div className="offer-img-wrapper" style={{ position: "relative" }} aria-hidden>
        {offer.imageUrl && (
          <Image src={offer.imageUrl} alt="" fill unoptimized={false} style={{ objectFit: "contain" }} />
        )}
      </div>

      <div className="offer-main">
        <div className="offer-title" title={offer.title}>{offer.title}</div>
        <div className="offer-meta-row">
          <span className="marketplace-chip" data-mp={mpKey || undefined}>
            {mpKey === 'amazon' ? 'AMZ' : mpKey === 'mercadolivre' ? 'ML' : mpKey === 'shopee' ? 'SHP' : offer.store}
          </span>
          {showApprovedExtra && approvedStr && (
            <span className="approved-extra" title={email}>
              <span className="tiny-avatar" style={{ background: userNameFormatted === 'Dom' ? 'oklch(0.55 0.18 290)' : 'oklch(0.65 0.15 30)' }}>{userInitial}</span>
              {userNameFormatted}{" · "}{approvedStr}
            </span>
          )}
        </div>
      </div>

      <div className="offer-discount tabular">
        {pct > 0 ? `−${pct}%` : ''}
      </div>

      <div className="offer-price-block">
        <div className="offer-price">R$ {fmtBRL(offer.currentPrice)}</div>
        {offer.oldPrice && Number(offer.oldPrice) > 0 && (
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
