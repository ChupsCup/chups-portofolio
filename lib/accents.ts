export const ACCENTS = {
  mint: '#96E6A1',
  yellow: '#E6E66B',
  cobalt: '#5C6CFF',
  pink: '#F5A9E6',
} as const

const ACCENT_VALUES = [ACCENTS.mint, ACCENTS.yellow, ACCENTS.cobalt, ACCENTS.pink]

export function pickAccentByKey(key: string): string {
  let h = 0
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0
  }
  const idx = h % ACCENT_VALUES.length
  return ACCENT_VALUES[idx]
}

export type AccentName = keyof typeof ACCENTS

export function nearestAccentName(hex: string): AccentName {
  switch (hex.toLowerCase()) {
    case ACCENTS.mint.toLowerCase(): return 'mint'
    case ACCENTS.yellow.toLowerCase(): return 'yellow'
    case ACCENTS.cobalt.toLowerCase(): return 'cobalt'
    case ACCENTS.pink.toLowerCase(): return 'pink'
    default: return 'cobalt'
  }
}
