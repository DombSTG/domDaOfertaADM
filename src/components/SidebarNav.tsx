'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sun, Moon, LogOut, Plus } from 'lucide-react'
import { navLinks } from '@/src/lib/nav-links'
import { logout } from '@/src/actions/auth-actions'
import { AddOfferDialog } from '@/src/components/AddOfferDialog'
import { useTheme } from '@/src/components/ThemeProvider'

interface SidebarNavProps {
  counts?: Record<string, number>
  userEmail?: string
}

export function SidebarNav({ counts = {}, userEmail = '' }: SidebarNavProps) {
  const pathname = usePathname()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const initial = userEmail?.[0]?.toUpperCase() ?? '?'

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">D</div>
          <div className="brand-name">Dom da Oferta</div>
        </div>

        <div className="sidebar-section-label">Moderação</div>

        <nav className="nav">
          {navLinks.map((link) => {
            const count = link.countKey ? (counts[link.countKey] ?? 0) : null
            const isActive = pathname === link.href
            return (
              <a
                key={link.href}
                href={link.href}
                className={`nav-item${isActive ? ' active' : ''}`}
              >
                {link.icon}
                <span>{link.labelFull}</span>
                {count !== null && (
                  <span className="nav-count">{count}</span>
                )}
              </a>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="add-offer-btn"
            onClick={() => setDialogOpen(true)}
          >
            <Plus size={14} />
            Adicionar oferta
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div className="user-card">
              <div
                className="user-avatar"
                style={{ background: 'oklch(0.55 0.18 290)' }}
              >
                {initial}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="user-name">{userEmail}</div>
                <div className="user-role">Admin</div>
              </div>
            </div>

            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label="Alternar tema"
              title="Alternar tema"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <form action={logout}>
              <button
                type="submit"
                className="icon-btn"
                aria-label="Sair"
                title="Sair"
              >
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <AddOfferDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
