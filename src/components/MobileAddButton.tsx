'use client'

import { useState } from 'react'
import { AddOfferDialog } from '@/src/components/AddOfferDialog'

export function MobileAddButton() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className="md:hidden fixed bottom-[72px] right-4 z-50 h-12 w-12 rounded-full bg-violet-600 text-white shadow-lg flex items-center justify-center hover:bg-violet-700 active:scale-95 transition-transform"
        aria-label="Adicionar oferta"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      <AddOfferDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
