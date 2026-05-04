export const dynamic = 'force-dynamic'
import { db } from '@/src/db/db'
import { offers, users } from '@/src/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { OfferPageShell } from '@/src/components/OfferPageShell'

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
    .where(and(eq(offers.status, 'approved'), isNull(offers.deletedAt)))
    .orderBy(offers.createdAt)

  return (
    <OfferPageShell
      title="Aprovadas"
      label="Aprovadas"
      offers={approvedOffers}
      statsItems={[
        { label: 'Aprovadas (total)', value: approvedOffers.length, delta: 'histórico completo' },
      ]}
    />
  )
}
