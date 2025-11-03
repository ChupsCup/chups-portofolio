'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Projects' },
    { href: '/admin/skills', label: 'Skills' },
    { href: '/admin/about', label: 'About' },
  ]

  return (
    <nav className="bg-cream-100 dark:bg-brown-dark p-4 mb-8">
      <div className="max-w-7xl mx-auto">
        <ul className="flex space-x-4">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`px-4 py-2 rounded-md transition-colors ${
                  pathname === href
                    ? 'bg-accent text-white'
                    : 'hover:bg-cream-200 dark:hover:bg-brown-light text-brown-dark dark:text-cream-100'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}