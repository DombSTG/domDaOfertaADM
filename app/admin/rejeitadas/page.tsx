export const dynamic = 'force-dynamic'
import { db } from '@/src/db/db'
import { offers, users } from '@/src/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { OfferPageShell } from '@/src/components/OfferPageShell'

export default async function Rejeitadas() {
  const rejectedOffers = await db
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
      deletedAt: offers.deletedAt,
      userEmail: users.email,
    })
    .from(offers)
    .leftJoin(users, eq(offers.rejectedBy, users.id))
    .where(and(eq(offers.status, 'rejected'), isNull(offers.deletedAt)))
    .orderBy(offers.createdAt)

  return (
    <OfferPageShell
      title="Rejeitadas"
      label="Rejeitadas"
      offers={rejectedOffers}
      statsItems={[
        { label: 'Rejeitadas (total)', value: rejectedOffers.length, delta: 'histórico completo' },
      ]}
    />
  )
}
