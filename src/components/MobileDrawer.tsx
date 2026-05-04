'use client'

import { usePathname } from 'next/navigation'
import { navLinks } from '@/src/lib/nav-links'
import { logout } from '@/src/actions/auth-actions'
import { X, LogOut, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/src/components/ThemeProvider'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div
        className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col pb-14 md:pb-0"
        style={{
          background: 'var(--bg-elev)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span className="font-semibold" style={{ color: 'var(--text)' }}>Menu</span>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)' }}
            className="transition-colors hover:opacity-70"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="mobile-nav-item flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors"
                style={isActive
                  ? { color: 'var(--accent)', background: 'var(--accent-soft)' }
                  : { color: 'var(--text-soft)' }
                }
              >
                {link.icon}
                {link.labelFull ?? link.label}
              </a>
            )
          })}
        </nav>
        <div className="flex flex-col gap-1 p-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={toggleTheme}
            className="mobile-nav-item flex items-center gap-3 w-full text-sm font-medium px-0 py-2"
            style={{ color: 'var(--text-soft)' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </button>
          <form action={logout}>
            <button
              type="submit"
              className="mobile-nav-item-danger flex items-center gap-3 w-full text-sm font-medium"
              style={{ color: 'var(--danger)' }}
            >
              <LogOut size={18} />
              Sair da conta
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
