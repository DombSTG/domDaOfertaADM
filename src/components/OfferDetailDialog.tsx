'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { OfferCard } from '@/src/components/OfferCard'
import type { Offer } from '@/src/db/schema'

interface OfferDetailDialogProps {
  offer: Offer | null
  isOpen: boolean
  onClose: () => void
}

export function OfferDetailDialog({ offer, isOpen, onClose }: OfferDetailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-[14px] font-semibold text-gray-900">Detalhes da Oferta</DialogTitle>
        </DialogHeader>
        {offer && <OfferCard offer={offer} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  )
}
