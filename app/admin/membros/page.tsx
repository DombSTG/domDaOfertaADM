export const dynamic = 'force-dynamic'

import { db } from '@/src/db/db'
import { users, offers } from '@/src/db/schema'
import { count } from 'drizzle-orm'
import { MembrosClient } from './MembrosClient'

export default async function MembrosPage() {
  const membros = await db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.createdAt)

  const approvedCounts = await db
    .select({ userId: offers.approvedBy, n: count() })
    .from(offers)
    .groupBy(offers.approvedBy)

  const rejectedCounts = await db
    .select({ userId: offers.rejectedBy, n: count() })
    .from(offers)
    .groupBy(offers.rejectedBy)

  const approvedMap = Object.fromEntries(
    approvedCounts.map((r) => [r.userId, Number(r.n)])
  )
  const rejectedMap = Object.fromEntries(
    rejectedCounts.map((r) => [r.userId, Number(r.n)])
  )

  const membrosComStats = membros.map((m) => ({
    ...m,
    approvedCount: approvedMap[m.id] ?? 0,
    rejectedCount: rejectedMap[m.id] ?? 0,
  }))

  return (
    <>
      <div className="topbar">
        <div className="topbar-title">Membros</div>
        <div className="topbar-meta">· {membros.length}</div>
      </div>
      <div className="content">
        <MembrosClient membros={membrosComStats} />
      </div>
    </>
  )
}
