'use client'

import { useEffect, useState } from 'react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const ok = typeof window !== 'undefined' && localStorage.getItem('admin_auth') === 'true'
    if (ok) {
      window.location.href = '/admin'
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Password dikonfigurasi via env; fallback ke password lama agar konsisten
      const VALID = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Samsungj7')
      if (password === VALID) {
        localStorage.setItem('admin_auth', 'true')
        window.location.href = '/admin'
      } else {
        setError('Password salah')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 dark:bg-brown-dark text-brown-dark dark:text-cream-100 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-cream-200 dark:bg-brown-mid rounded-2xl shadow-sm border border-cream-300/60 dark:border-brown-mid p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">Admin Login</h1>
            <p className="text-sm text-brown-light dark:text-cream-300 mt-1">Masuk untuk mengelola konten portofolio</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-brown-dark focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-dark disabled:opacity-60"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
          <div className="mt-6 text-xs text-center text-brown-light dark:text-cream-300">
            © {new Date().getFullYear()} Admin • Portfolio
          </div>
        </div>
      </div>
    </div>
  )
}
