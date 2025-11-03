'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { pickAccentByKey, nearestAccentName } from '@/lib/accents'

type Variant = 'mint' | 'yellow' | 'cobalt' | 'pink' | 'neutral' | 'auto'

const VARIANTS: Record<Exclude<Variant, 'auto'>, { bg: string; ring: string; glow: string }> = {
  mint:   { bg: '#96E6A1', ring: 'rgba(150,230,161,0.45)', glow: '0 6px 22px rgba(150,230,161,0.35)' },
  yellow: { bg: '#E6E66B', ring: 'rgba(230,230,107,0.45)', glow: '0 6px 22px rgba(230,230,107,0.35)' },
  cobalt: { bg: '#5C6CFF', ring: 'rgba(92,108,255,0.45)', glow: '0 6px 22px rgba(92,108,255,0.35)' },
  pink:   { bg: '#F5A9E6', ring: 'rgba(245,169,230,0.45)', glow: '0 6px 22px rgba(245,169,230,0.35)' },
  neutral:{ bg: 'rgba(255,255,255,0.06)', ring: 'rgba(255,255,255,0.18)', glow: '0 6px 22px rgba(0,0,0,0.2)' },
}

export default function ButtonPill({ href, label, variant = 'cobalt' }: { href: string; label: string; variant?: Variant }) {
  const chosen = variant === 'auto' ? nearestAccentName(pickAccentByKey(`${label}|${href}`)) : variant
  const theme = VARIANTS[chosen as Exclude<Variant, 'auto'>]
  return (
    <Link href={href} className="inline-block">
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className="relative h-12 sm:h-14 pr-14 pl-6 rounded-full flex items-center gap-3"
        style={{
          background: theme.bg,
          border: `1px solid ${theme.ring}`,
          boxShadow: `${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.35)`,
        }}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.18), transparent 45%), radial-gradient(120% 120% at 50% 100%, rgba(0,0,0,0.18), transparent 45%)',
            opacity: 0.25,
          }}
        />
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '3px 3px',
            opacity: 0.22,
            mixBlendMode: 'overlay',
          }}
        />
        <span className="text-[15px] sm:text-[16px] font-semibold text-black/90" style={{ color: variant === 'neutral' ? 'rgba(255,255,255,0.9)' : '#0A0A0A' }}>{label}</span>
        <span className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square rounded-full flex items-center justify-center shadow-[inset_0_0_12px_rgba(0,0,0,0.45)]" style={{ background: '#0f0f0f', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7"/>
            <path d="M7 7h10v10"/>
          </svg>
        </span>
      </motion.div>
    </Link>
  )
}
