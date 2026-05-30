import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Fahri Yusuf — System Analyst & Full-Stack Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const photoUrl = 'https://oemaqbrvwbosbinjrxei.supabase.co/storage/v1/object/public/portfolio/photos/your-photo.jpg'

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: '#0a0a0f', display: 'flex', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 6, height: 630, background: '#5C6CFF' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, width: 500, height: 630, display: 'flex' }}>
          <img src={photoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0a0a0f 30%, transparent)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px', zIndex: 1 }}>
          <div style={{ color: '#5C6CFF', fontSize: 20, marginBottom: 16, fontFamily: 'sans-serif' }}>Portfolio</div>
          <div style={{ color: 'white', fontSize: 80, fontWeight: 700, lineHeight: 1.1, fontFamily: 'sans-serif' }}>Fahri Yusuf</div>
          <div style={{ width: 600, height: 2, background: '#5C6CFF', margin: '20px 0', opacity: 0.6 }} />
          <div style={{ color: '#5C6CFF', fontSize: 32, fontFamily: 'sans-serif' }}>System Analyst & Full-Stack Developer</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22, marginTop: 12, fontFamily: 'sans-serif' }}>Jakarta, Indonesia</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
            {['Python', 'PHP', 'React', 'Next.js', 'Laravel', 'SQL'].map(skill => (
              <div key={skill} style={{ background: 'rgba(92,108,255,0.2)', border: '1px solid #5C6CFF', color: '#5C6CFF', padding: '8px 20px', borderRadius: 8, fontSize: 18, fontFamily: 'sans-serif' }}>
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
