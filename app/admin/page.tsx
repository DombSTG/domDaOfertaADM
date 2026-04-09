export const dynamic = 'force-dynamic'

import { db } from '@/src/db/db'
import { offers } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { OfferListPage } from '@/src/components/OfferListPage'

export default async function Home() {
  const pendingOffers = await db
    .select()
    .from(offers)
    .where(eq(offers.status, 'pending'))
    .orderBy(offers.createdAt)

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center h-[44px] px-6 border-b border-gray-100 shrink-0">
        <h1 className="text-[13px] font-semibold text-gray-900">Fila de Aprovação</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <OfferListPage offers={pendingOffers} />
      </div>
    </div>
  )
}
