export const dynamic = 'force-dynamic'

import { db } from '@/src/db/db'
import { offers } from '@/src/db/schema'
import { count } from 'drizzle-orm'
import { HomeView } from '@/src/components/HomeView'

export default async function InicioPage() {
  const rows = await db
    .select({ status: offers.status, n: count() })
    .from(offers)
    .groupBy(offers.status)

  const counts: Record<string, number> = { pending: 0, approved: 0, rejected: 0 }
  for (const r of rows) counts[r.status] = Number(r.n)

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Início</div>
        <div className="topbar-meta">· Analytics</div>
      </div>
      <div className="content">
        <HomeView pendingCount={counts.pending} />
      </div>
    </>
  )
}
