import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const supabase = supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null

export default function App() {
  const [ping, setPing] = useState<string>('')

  useEffect(() => {
    // contoh cek env supabase tersedia
    if (supabase) setPing('Supabase siap dipakai')
    else setPing('Supabase belum dikonfigurasi')
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="px-6 py-4 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-extrabold text-xl" style={{ color: '#5C6CFF' }}>Portfolio SPA</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">Halo!</h1>
        <p className="text-white/80">Ini kerangka SPA (React + Vite) yang akan kita deploy via Supabase.</p>
        <p className="mt-4 text-sm text-white/60">Status: {ping}</p>
      </main>
      <footer className="px-6 py-8 border-t border-white/10 text-center text-white/50">
        &copy; {new Date().getFullYear()} Portfolio
      </footer>
    </div>
  )
}
