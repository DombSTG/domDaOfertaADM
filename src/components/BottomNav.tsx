'use client'

import { usePathname } from 'next/navigation'
import { navLinks } from '@/src/lib/nav-links'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100">
      <div className="grid grid-cols-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <a
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors ${
                isActive ? 'text-violet-600' : 'text-gray-400'
              }`}
            >
              <span className={isActive ? 'text-violet-600' : 'text-gray-400'}>
                {link.icon}
              </span>
              {link.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
