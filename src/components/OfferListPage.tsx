'use client'

import { useState } from 'react'
import { OfferListItem } from '@/src/components/OfferListItem'
import { OfferDetailDialog } from '@/src/components/OfferDetailDialog'
import type { Offer } from '@/src/db/schema'

interface OfferListPageProps {
  offers: Offer[]
}

export function OfferListPage({ offers }: OfferListPageProps) {
  const [selected, setSelected] = useState<Offer | null>(null)

  if (offers.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-[13px] text-gray-400">
        Nenhuma oferta na fila no momento.
      </div>
    )
  }

  return (
    <>
      {/* Group header */}
      <div className="flex items-center gap-2 px-6 py-2 border-b border-gray-100 bg-white sticky top-0 z-10">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          Pendentes
        </span>
        <span className="text-[11px] font-medium text-gray-400">
          {offers.length}
        </span>
      </div>

      {/* Lista */}
      <div className="flex flex-col">
        {offers.map((offer) => (
          <OfferListItem
            key={offer.id}
            offer={offer}
            onClick={() => setSelected(offer)}
          />
        ))}
      </div>

      <OfferDetailDialog
        offer={selected}
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
