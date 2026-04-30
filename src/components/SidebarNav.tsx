'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { navLinks } from '@/src/lib/nav-links'
import { logout } from '@/src/actions/auth-actions'
import { AddOfferDialog } from '@/src/components/AddOfferDialog'

export function SidebarNav() {
  const pathname = usePathname()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <nav className="flex flex-col flex-1 py-3 px-2">
        <div className="flex-1 space-y-[1px]">
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
        </div>

        <div className="space-y-[1px]">
          {/* Adicionar Oferta */}
          <button
            onClick={() => setDialogOpen(true)}
            className="w-full flex items-center gap-2 px-2 py-[5px] rounded-[6px] text-[13px] text-violet-600 hover:bg-violet-50 font-medium"
          >
            <svg className="h-[15px] w-[15px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Adicionar Oferta
          </button>

          {/* Logout */}
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-2 py-[5px] rounded-[6px] text-[13px] text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              <svg className="h-[15px] w-[15px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
              </svg>
              Sair
            </button>
          </form>
        </div>
      </nav>

      <AddOfferDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
