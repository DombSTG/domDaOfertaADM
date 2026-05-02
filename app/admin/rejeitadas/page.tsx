export const dynamic = 'force-dynamic'
import { db } from '@/src/db/db'
import { offers } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { OfferPageShell } from '@/src/components/OfferPageShell'

export default async function Rejeitadas() {
  const rejectedOffers = await db
    .select()
    .from(offers)
    .where(eq(offers.status, 'rejected'))
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
