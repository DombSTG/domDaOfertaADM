'use client'

import { OfferCard } from '@/src/components/OfferCard'
import type { Offer } from '@/src/db/schema'

interface OfferDrawerProps {
  offer: Offer | null
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  hasPrev?: boolean
  hasNext?: boolean
}

export function OfferDrawer({ offer, onClose, onPrev, onNext, hasPrev, hasNext }: OfferDrawerProps) {
  return (
    <>
      <div
        className={`drawer-overlay ${offer ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`drawer ${offer ? 'open' : ''}`}>
        {offer && (
          <OfferCard
            offer={offer}
            onClose={onClose}
            onPrev={onPrev}
            onNext={onNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
        )}
      </div>
    </>
  )
}
