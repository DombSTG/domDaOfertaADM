export const dynamic = 'force-dynamic'

import { db } from '@/src/db/db'
import { offers } from '@/src/db/schema'
import { eq, count } from 'drizzle-orm'
import { OfferPageShell } from '@/src/components/OfferPageShell'

export default async function PendingPage() {
  const [pendingOffers, rows] = await Promise.all([
    db.select().from(offers).where(eq(offers.status, 'pending')).orderBy(offers.createdAt),
    db.select({ status: offers.status, n: count() }).from(offers).groupBy(offers.status),
  ])

  const counts: Record<string, number> = { pending: 0, approved: 0, rejected: 0 }
  for (const r of rows) counts[r.status] = Number(r.n)

  const total = counts.approved + counts.rejected
  const approvalRate = total > 0 ? Math.round((counts.approved / total) * 100) : 0

  return (
    <OfferPageShell
      title="Fila de Aprovação"
      label="Pendentes"
      offers={pendingOffers}
      statsItems={[
        { label: 'Pendentes', value: counts.pending, delta: 'na fila agora' },
        { label: 'Aprovadas', value: counts.approved, delta: 'total', deltaDir: 'up' },
        { label: 'Rejeitadas', value: counts.rejected, delta: 'total' },
        { label: 'Taxa de aprovação', value: `${approvalRate}%`, delta: 'aprovadas / decididas', deltaDir: 'up' },
      ]}
    />
  )
}
