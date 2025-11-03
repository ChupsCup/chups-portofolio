'use client'

export default function AdminHeader({ title, theme, onToggleTheme, onToggleSidebar }: { title: string, theme?: 'light'|'dark', onToggleTheme?: () => void, onToggleSidebar?: () => void }) {
  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_auth')
      window.location.href = '/admin/login'
    }
  }
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="px-3 md:px-6 lg:px-8 py-3 md:py-4 flex items-center gap-3 md:gap-6">
        <button onClick={onToggleSidebar} className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-cream-100 hover:bg-white/20" aria-label="Toggle sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <h1 className="text-lg md:text-2xl font-bold tracking-tight flex-1">{title}</h1>
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
          <div className="relative w-full">
            <input className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/10 border border-white/10 placeholder:text-cream-300/60 focus:outline-none focus:ring-2 focus:ring-accent text-cream-100" placeholder="Search (Ctrl+/)" />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-300/80">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleTheme} className="px-3 py-2 text-sm rounded-md bg-white/10 text-cream-100 hover:bg-white/20">
            {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
          <button onClick={handleLogout} className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700">Logout</button>
          <div className="hidden md:block w-9 h-9 rounded-full bg-gradient-to-br from-accent to-purple-500 ring-2 ring-white/20" />
        </div>
      </div>
    </header>
  )
}
