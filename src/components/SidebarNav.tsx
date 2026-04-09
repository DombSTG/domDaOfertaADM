'use client'

import { usePathname } from 'next/navigation'
import { navLinks } from '@/src/lib/nav-links'

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 py-3 px-2 space-y-[1px]">
      <p className="px-2 pb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
        Moderação
      </p>
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`flex items-center gap-2 px-2 py-[5px] rounded-[6px] text-[13px] text-gray-700 ${
            pathname === link.href
              ? 'bg-gray-100 font-medium'
              : 'hover:bg-gray-50'
          }`}
        >
          <span className="text-gray-500">{link.icon}</span>
          {link.labelFull}
        </a>
      ))}
    </nav>
  )
}
