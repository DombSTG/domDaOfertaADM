'use client'

import { Bell, Search } from 'lucide-react'

interface TopbarProps {
  title: string
  meta?: string | number
  query: string
  setQuery: (q: string) => void
}

export function Topbar({ title, meta, query, setQuery }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      {meta !== undefined && (
        <div className="topbar-meta">· {meta}</div>
      )}
      <div className="topbar-right">
        <div className="search">
          <Search size={13} color="var(--text-faint)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar oferta..."
          />
        </div>
        <button className="icon-btn" aria-label="Notificações">
          <Bell size={16} />
        </button>
      </div>
    </div>
  )
}
