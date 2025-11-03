'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Projects' },
  { href: '/admin/skills', label: 'Skills' },
  { href: '/admin/about', label: 'About' },
]

export default function AdminSidebar({ open, onClose }: { open: boolean, onClose: () => void }) {
  const pathname = usePathname()
  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer (mobile) */}
      <aside
        className={`fixed z-50 md:static md:z-auto top-0 left-0 h-full w-72 md:w-64 flex-col border-r border-white/10 bg-white/10 dark:bg-white/10 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transform transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-5 py-4 border-b border-white/10">
          <div className="text-xl font-extrabold tracking-tight">Admin Panel</div>
          <div className="text-xs text-cream-300/80">Portfolio Management</div>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(({ href, label }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active ? 'bg-accent text-white' : 'hover:bg-white/10 text-cream-100'
                    }`}
                    onClick={onClose}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${active ? 'bg-white' : 'bg-transparent border border-white/30'}`} />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="p-4 text-xs text-cream-300/70 border-t border-white/10">© {new Date().getFullYear()} Admin</div>
      </aside>
    </>
  )
}
