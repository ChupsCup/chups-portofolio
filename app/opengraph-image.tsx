import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Fahri Yusuf — System Analyst & Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const photoUrl = 'https://oemaqbrvwbosbinjrxei.supabase.co/storage/v1/object/public/portfolio/profile/profile-1764578196789-IMG_20251201153204946.png'

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: '#050508', display: 'flex', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 4, height: 630, background: '#5C6CFF' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, width: 520, height: 630, display: 'flex' }}>
          <img src={photoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', opacity: 0.5 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #050508 20%, transparent 80%)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', zIndex: 1, width: 720 }}>
          <div style={{ color: '#5C6CFF', fontSize: 14, fontWeight: 400, letterSpacing: 4, marginBottom: 24, fontFamily: 'sans-serif' }}>PORTFOLIO · 2025</div>
          <div style={{ color: 'white', fontSize: 96, fontWeight: 800, lineHeight: 1, letterSpacing: -3, fontFamily: 'sans-serif' }}>Fahri</div>
          <div style={{ color: '#5C6CFF', fontSize: 96, fontWeight: 800, lineHeight: 1.1, letterSpacing: -3, fontFamily: 'sans-serif', marginBottom: 20 }}>Yusuf</div>
          <div style={{ width: 500, height: 2, background: '#5C6CFF', opacity: 0.4, marginBottom: 20 }} />
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 26, fontFamily: 'sans-serif', marginBottom: 8 }}>System Analyst & Developer</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ background: '#5C6CFF', color: 'white', fontSize: 14, fontWeight: 600, padding: '4px 14px', borderRadius: 20, fontFamily: 'sans-serif' }}>Entry Level</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16, fontFamily: 'sans-serif' }}>📍 Jakarta, Indonesia</div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 15, letterSpacing: 2, fontFamily: 'sans-serif' }}>chups-portofolio.vercel.app</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
