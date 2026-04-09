'use client'

import type { Offer } from '@/src/db/schema'

interface OfferListItemProps {
  offer: Offer
  onClick: () => void
}

export function OfferListItem({ offer, onClick }: OfferListItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-3 px-4 py-3 md:px-6 md:py-[7px] border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors group"
    >
      {/* Status dot */}
      <div className={`h-[7px] w-[7px] rounded-full shrink-0 ${
        offer.status === 'approved' ? 'bg-emerald-500' :
        offer.status === 'rejected' ? 'bg-red-500' :
        'bg-amber-400'
      }`} />

      {/* Thumbnail */}
      <div className="h-[28px] w-[28px] shrink-0 overflow-hidden rounded-[4px] bg-gray-100 border border-gray-100">
        {offer.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-300">
            —
          </div>
        )}
      </div>

      {/* Loja + Título + Preço */}
      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-y-0.5 md:gap-3">
        {/* Loja */}
        <span className="shrink-0 text-[11px] font-medium text-gray-500 bg-gray-100 rounded-[4px] px-1.5 py-0.5 leading-none self-start">
          {offer.store}
        </span>

        {/* Título */}
        <p className="min-w-0 flex-1 line-clamp-2 md:truncate text-[13px] text-gray-700">
          {offer.title}
        </p>

        {/* Preço */}
        <span className="shrink-0 text-[12px] font-semibold text-emerald-600 tabular-nums">
          R${' '}
          {Number(offer.currentPrice).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* Data */}
      <span className="hidden md:block shrink-0 w-[72px] text-right text-[11px] text-gray-400 tabular-nums">
        {new Date(offer.createdAt).toLocaleDateString('pt-BR')}
      </span>
    </button>
  )
}
