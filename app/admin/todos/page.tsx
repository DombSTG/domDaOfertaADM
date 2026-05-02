export const dynamic = 'force-dynamic'
import { db } from '@/src/db/db'
import { offers } from '@/src/db/schema'
import { OfferPageShell } from '@/src/components/OfferPageShell'

export default async function Todos() {
  const allOffers = await db
    .select()
    .from(offers)
    .orderBy(offers.createdAt)

  return (
    <OfferPageShell
      title="Todos"
      label="Todas"
      offers={allOffers}
    />
  )
}
