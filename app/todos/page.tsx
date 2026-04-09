import { db } from '@/src/db/db'
import { offers } from '@/src/db/schema'
import { OfferListPage } from '@/src/components/OfferListPage'

export default async function Todos() {
  const allOffers = await db
    .select()
    .from(offers)
    .orderBy(offers.createdAt)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-[44px] px-6 border-b border-gray-100 shrink-0">
        <h1 className="text-[13px] font-semibold text-gray-900">Todos</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <OfferListPage offers={allOffers} label="Todas" />
      </div>
    </div>
  )
}
