'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
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
      <DialogContent bottomSheet className="w-full max-w-md p-0 flex flex-col">
        {offer && <OfferCard offer={offer} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  )
}
