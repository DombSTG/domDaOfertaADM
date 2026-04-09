'use client'

import { usePathname } from 'next/navigation'
import { navLinks } from '@/src/lib/nav-links'
import { logout } from '@/src/actions/auth-actions'
import { X, LogOut } from 'lucide-react'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname()

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-white flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <span className="font-semibold text-gray-800">Menu</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 py-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'text-violet-600 bg-violet-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.icon}
                {link.labelFull ?? link.label}
              </a>
            )
          })}
        </nav>
        <div className="border-t border-gray-100 p-4">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full text-sm font-medium text-red-500 hover:text-red-600"
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
