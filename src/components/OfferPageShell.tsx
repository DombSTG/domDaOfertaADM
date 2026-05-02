'use client'

import { useState, useMemo, useEffect } from 'react'
import { Topbar } from '@/src/components/Topbar'
import { OfferListPage } from '@/src/components/OfferListPage'
import type { Offer } from '@/src/db/schema'

interface StatItem {
  label: string
  value: string | number
  delta?: string
  deltaDir?: 'up' | 'down' | ''
}

interface OfferPageShellProps {
  title: string
  offers: Offer[]
  statsItems?: StatItem[]
  filterLabel?: string
  label?: string
}

export function OfferPageShell({
  title,
  offers,
  statsItems,
  filterLabel,
  label,
}: OfferPageShellProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const totalAfterSearch = useMemo(() => {
    if (!debouncedQuery.trim()) return offers.length
    const q = debouncedQuery.trim().toLowerCase()
    return offers.filter(
      (o) => o.title.toLowerCase().includes(q) || o.store.toLowerCase().includes(q)
    ).length
  }, [offers, debouncedQuery])

  return (
    <>
      <Topbar
        title={title}
        meta={totalAfterSearch}
        query={query}
        setQuery={setQuery}
      />
      <div className="content">
        <OfferListPage
          offers={offers}
          query={debouncedQuery}
          label={label ?? title}
          filterLabel={filterLabel}
          statsItems={statsItems}
        />
      </div>
    </>
  )
}
