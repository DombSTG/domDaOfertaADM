export const dynamic = 'force-dynamic'

import { db } from '@/src/db/db'
import { users } from '@/src/db/schema'
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-[44px] px-6 border-b border-gray-100 shrink-0">
        <h1 className="text-[13px] font-semibold text-gray-900">Membros</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <MembrosClient membros={membros} />
      </div>
    </div>
  )
}
