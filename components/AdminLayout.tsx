"use client"

import { ReactNode, useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminLayout({ title, children }: { title: string, children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<'light'|'dark'>(() => {
    if (typeof window === 'undefined') return 'dark'
    return (localStorage.getItem('theme') as 'light'|'dark') || 'dark'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="relative min-h-screen text-brown-dark dark:text-cream-100">
      {/* Overkill gradient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0b1020] opacity-90 dark:opacity-100" />
        <div className="absolute -top-20 -left-20 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,#14b8a6,transparent)] opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,#8b5cf6,transparent)] opacity-20 blur-3xl" />
      </div>

      <div className="flex min-h-screen">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <AdminHeader title={title} theme={theme} onToggleTheme={() => setTheme(theme==='dark'?'light':'dark')} onToggleSidebar={() => setSidebarOpen(v=>!v)} />
          <main className="p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                <div className="p-4 md:p-8">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
