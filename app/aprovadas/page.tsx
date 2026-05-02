
export const dynamic = 'force-dynamic'
import { db } from '@/src/db/db'
import { offers, users } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { OfferListPage } from '@/src/components/OfferListPage'

export default async function Aprovadas() {
  const approvedOffers = await db
    .select({
      id: offers.id,
      store: offers.store,
      category: offers.category,
      title: offers.title,
      currentPrice: offers.currentPrice,
      oldPrice: offers.oldPrice,
      originalUrl: offers.originalUrl,
      affiliateUrl: offers.affiliateUrl,
      imageUrl: offers.imageUrl,
      status: offers.status,
      createdAt: offers.createdAt,
      approvedAt: offers.approvedAt,
      rejectedAt: offers.rejectedAt,
      copyText: offers.copyText,
      rating: offers.rating,
      reviews: offers.reviews,
      approvedBy: offers.approvedBy,
      rejectedBy: offers.rejectedBy,
      userEmail: users.email,
    })
    .from(offers)
    .leftJoin(users, eq(offers.approvedBy, users.id))
    .where(eq(offers.status, 'approved'))
    .orderBy(offers.createdAt)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-[44px] px-6 border-b border-gray-100 shrink-0">
        <h1 className="text-[13px] font-semibold text-gray-900">Aprovadas</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <OfferListPage offers={approvedOffers} label="Aprovadas" />
      </div>
    </div>
  )
}
