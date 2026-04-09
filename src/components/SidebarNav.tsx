'use client'

import { usePathname } from 'next/navigation'

const links = [
  {
    href: '/',
    label: 'Fila de Aprovação',
    icon: (
      <svg className="h-[15px] w-[15px] text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.1 13.177a2.25 2.25 0 0 0-.1.661Z" />
      </svg>
    ),
  },
  {
    href: '/aprovadas',
    label: 'Aprovadas',
    icon: (
      <svg className="h-[15px] w-[15px] text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    href: '/rejeitadas',
    label: 'Rejeitadas',
    icon: (
      <svg className="h-[15px] w-[15px] text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    href: '/todos',
    label: 'Todos',
    icon: (
      <svg className="h-[15px] w-[15px] text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 py-3 px-2 space-y-[1px]">
      <p className="px-2 pb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
        Moderação
      </p>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`flex items-center gap-2 px-2 py-[5px] rounded-[6px] text-[13px] text-gray-700 ${
            pathname === link.href
              ? 'bg-gray-100 font-medium'
              : 'hover:bg-gray-50'
          }`}
        >
          {link.icon}
          {link.label}
        </a>
      ))}
    </nav>
  )
}
