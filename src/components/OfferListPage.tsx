'use client'

import { useState, useMemo, useCallback } from 'react'
import { OfferListItem } from '@/src/components/OfferListItem'
import { OfferDrawer } from '@/src/components/OfferDrawer'
import type { Offer } from '@/src/db/schema'

type Density = 'compact' | 'normal' | 'cozy'

interface StatItem {
  label: string
  value: string | number
  delta?: string
  deltaDir?: 'up' | 'down' | ''
}

interface OfferListPageProps {
  offers: Offer[]
  query?: string
  density?: Density
  view?: 'pending' | 'approved' | 'rejected' | 'all'
  label?: string
  statsItems?: StatItem[]
  filterLabel?: string
}

const MARKETPLACE_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'amazon', label: 'Amazon' },
  { id: 'mercadolivre', label: 'Mercado Livre' },
  { id: 'shopee', label: 'Shopee' },
  { id: 'magalu', label: 'MagaLu' },
]

function storeToMp(store: string): string {
  const s = store.toLowerCase()
  if (s.includes('amazon')) return 'amazon'
  if (s.includes('mercado')) return 'mercadolivre'
  if (s.includes('shopee')) return 'shopee'
  if (s.includes('magalu') || s.includes('magazine')) return 'magalu'
  return 'other'
}

export function OfferListPage({
  offers,
  query = '',
  density = 'normal',
  label = 'Ofertas',
  statsItems,
  filterLabel,
}: OfferListPageProps) {
  const [marketFilter, setMarketFilter] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = offers
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((o) => {
        const productCode = o.originalUrl.split('/').filter(Boolean).pop() ?? ''
        return (
          o.title.toLowerCase().includes(q) ||
          o.store.toLowerCase().includes(q) ||
          productCode.toLowerCase().includes(q)
        )
      })
    }
    if (marketFilter !== 'all') {
      list = list.filter((o) => storeToMp(o.store) === marketFilter)
    }
    return list
  }, [offers, query, marketFilter])

  const selectedIndex = selectedId !== null ? filtered.findIndex((o) => o.id === selectedId) : -1
  const selected = selectedIndex >= 0 ? filtered[selectedIndex] : null

  const handleSelect = useCallback((index: number) => setSelectedId(filtered[index]?.id ?? null), [filtered])
  const handleClose = useCallback(() => setSelectedId(null), [])
  const handlePrev = useCallback(() => {
    setSelectedId((id) => {
      const idx = filtered.findIndex((o) => o.id === id)
      return idx > 0 ? filtered[idx - 1].id : id
    })
  }, [filtered])
  const handleNext = useCallback(() => {
    setSelectedId((id) => {
      const idx = filtered.findIndex((o) => o.id === id)
      return idx >= 0 && idx < filtered.length - 1 ? filtered[idx + 1].id : id
    })
  }, [filtered])

  const densityLabel =
    density === 'compact' ? 'Compacto' : density === 'cozy' ? 'Confortável' : 'Normal'

  return (
    <>
      {/* Stats Bar */}
      {statsItems && statsItems.length > 0 && (
        <div className="stats-bar">
          {statsItems.map((item, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-label">{item.label}</div>
              <div className="stat-value tabular">{item.value}</div>
              {item.delta && (
                <div className={`stat-delta${item.deltaDir ? ` ${item.deltaDir}` : ''}`}>
                  {item.delta}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Filter Bar */}
      <div className="section-bar">
        <span className="section-label">{filterLabel || label}</span>
        <span className="section-count">{filtered.length}</span>
        <div className="filters">
          {MARKETPLACE_FILTERS.map((f) => (
            <button
              key={f.id}
              className={`chip${marketFilter === f.id ? ' active' : ''}`}
              onClick={() => setMarketFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <div className="empty-title">
            {offers.length === 0 ? 'Nenhuma oferta aqui.' : 'Nenhum resultado.'}
          </div>
          <div className="empty-sub">
            {offers.length === 0
              ? `A fila de ${label.toLowerCase()} está vazia.`
              : `Tente ajustar os filtros ou a busca.`}
          </div>
        </div>
      ) : (
        <div className="offer-list">
          {filtered.map((offer, index) => (
            <OfferListItem
              key={offer.id}
              offer={offer}
              density={density}
              index={index}
              isSelected={offer.id === selectedId}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      {/* Drawer */}
      <OfferDrawer
        offer={selected}
        onClose={handleClose}
        hasPrev={selectedIndex > 0}
        hasNext={selectedIndex >= 0 && selectedIndex < filtered.length - 1}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </>
  )
}
