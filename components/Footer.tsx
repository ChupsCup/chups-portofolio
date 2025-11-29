'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 border-t border-white/5" style={{background: 'linear-gradient(180deg, rgba(10,10,10,0.2), rgba(10,10,10,0.6))'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-extrabold mb-4" style={{ color: '#5C6CFF' }}>Portfolio</h3>
            <p className="text-white/70">
              Building amazing web experiences with modern technologies.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-white/70 hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              {[
                { href: 'https://github.com/ChupsCup', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
                { href: 'https://www.linkedin.com/in/fahri-yusuf-73bb75217?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
                { href: 'https://wa.me/6285121017198', icon: 'M20.52 3.48C18.2 1.16 15.21 0 12 0 5.37 0 0 5.37 0 12c0 2.11.55 4.19 1.6 6.02L0 24l6.17-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.2-3.48-8.52zM12 22a9.9 9.9 0 0 1-5.06-1.39l-.36-.21-3.7.97.99-3.6-.23-.36A9.94 9.94 0 1 1 22 12c0 5.51-4.49 10-10 10zm5.27-7.59c-.29-.15-1.71-.84-1.98-.94-.26-.1-.45-.15-.64.14-.2.29-.75.95-.92 1.15-.17.2-.33.22-.62.07-.29-.15-1.24-.45-2.36-1.45-.87-.77-1.45-1.7-1.62-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.15-.17.19-.3.28-.49.1-.2.05-.36-.02-.51-.07-.15-.64-1.56-.88-2.14-.24-.58-.47-.5-.64-.5h-.55c-.19 0-.5.07-.77.36-.26.29-1.01 1-1.01 2.45 0 1.45 1.03 2.86 1.18 3.05.15.2 2.04 3.14 4.95 4.4.69.3 1.23.47 1.66.61.69.22 1.32.19 1.82.12.56-.08 1.71-.69 1.96-1.37.24-.68.24-1.25.16-1.37-.08-.12-.26-.2-.55-.34z' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white/80 hover:text-white transition"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-white/60">
          <p>&copy; {currentYear} Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

