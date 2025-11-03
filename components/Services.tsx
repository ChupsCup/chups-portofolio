'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const COLORS = {
  mint: '#96E6A1',
  yellow: '#E6E66B',
  cobalt: '#5C6CFF',
  pink: '#F5A9E6',
}

function TiltPill({ href, color, label }: { href: string; color: string; label: string }) {
  return (
    <div className="flex flex-col items-start">
      <Link href={href} className="block">
        <motion.div
          whileHover={{ rotate: -12, y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative w-44 sm:w-56 h-28 rounded-full"
          style={{
            background: color,
            boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.2), 0 10px 30px rgba(0,0,0,0.5)`,
          }}
        >
          <div
            className="absolute -bottom-5 -left-5 w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: '#111',
              color: '#fff',
              boxShadow: '0 8px 20px rgba(0,0,0,0.6), inset 0 0 14px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7"/>
              <path d="M7 7h10v10"/>
            </svg>
          </div>
        </motion.div>
      </Link>
      <div className="mt-5 text-white/90 text-sm sm:text-base">
        {label}
      </div>
      <div className="mt-1 w-20 h-[2px] bg-white/20" />
    </div>
  )
}

export default function Services() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex gap-2 flex-wrap">
          <button className="px-4 h-10 rounded-xl border border-white/10 text-white/85 bg-[rgba(255,255,255,0.04)]">Nos offres</button>
          <button className="px-4 h-10 rounded-xl border border-white/10 text-white/85 bg-[rgba(255,255,255,0.04)]">Nos réalisations</button>
          <button className="px-4 h-10 rounded-xl border border-white/10 text-white/85 bg-[rgba(255,255,255,0.04)]">Nos notes</button>
          <button className="px-4 h-10 rounded-full border border-white/10 text-black" style={{ background: COLORS.mint }}>Contact</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
          <TiltPill href="#saas" color={COLORS.mint} label="SaaS" />
          <TiltPill href="#startup" color={COLORS.yellow} label="Start‑up" />
          <TiltPill href="#agencies" color={COLORS.cobalt} label="Agences" />
          <TiltPill href="#mission" color={COLORS.pink} label="Entreprises à mission" />
        </div>
      </div>
    </section>
  )
}
