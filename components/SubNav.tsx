import Link from 'next/link'

const links = [
  { href: '/', label: 'Home' },
  { href: '/pengalaman', label: 'Pengalaman' },
  { href: '/projects', label: 'Projects' },
  { href: '/sertifikasi', label: 'Sertifikasi' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#contact', label: 'Contact' },
]

export default function SubNav({ current }: { current?: string }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 rounded-2xl bg-[rgba(10,10,10,0.55)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(10,10,10,0.35)]">
          <nav className="flex items-center justify-between px-4 py-3 min-h-14 gap-4">
            <Link href="/" className="font-extrabold text-xl shrink-0" style={{ color: '#5C6CFF' }}>
              Portfolio
            </Link>

            <div className="hidden md:flex items-center gap-1 ml-auto">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    current === l.label ? 'text-white' : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="md:hidden flex items-center gap-3 text-sm text-white/80">
              <Link href="/projects" className="hover:text-white transition">
                Projects
              </Link>
              <Link href="/sertifikasi" className="hover:text-white transition">
                Sertifikasi
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
