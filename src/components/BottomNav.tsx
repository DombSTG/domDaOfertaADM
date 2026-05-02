'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { navLinks } from '@/src/lib/nav-links'
import { MobileDrawer } from './MobileDrawer'

interface BottomNavProps {
  counts?: Record<string, number>
}

export function BottomNav({ counts = {} }: BottomNavProps) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const mobileLinks = navLinks.filter((l) => !l.mobileHidden)

  return (
    <>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100">
        <div className="grid grid-cols-5">
          {mobileLinks.map((link) => {
            const isActive = pathname === link.href
            const count = link.countKey ? (counts[link.countKey] ?? 0) : 0
            const isPending = link.countKey === 'pending'
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <span className={`relative ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {link.icon}
                  {count > 0 && (
                    <span className={`absolute -top-1 -right-1.5 text-[9px] font-bold px-1 py-px rounded-full leading-none ${
                      isPending ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'
                    }`}>
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </span>
                {link.label}
              </a>
            )
          })}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium text-gray-400"
          >
            <Menu size={20} />
            Menu
          </button>
        </div>
      </nav>
    </>
  )
}
