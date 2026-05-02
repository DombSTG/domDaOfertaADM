export const dynamic = 'force-dynamic'
import { db } from '@/src/db/db'
import { offers } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { OfferPageShell } from '@/src/components/OfferPageShell'

export default async function Aprovadas() {
  const approvedOffers = await db
    .select()
    .from(offers)
    .where(eq(offers.status, 'approved'))
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
