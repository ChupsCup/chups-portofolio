import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import SubNav from '@/components/SubNav'
import Footer from '@/components/Footer'
import { getCertificates } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Sertifikasi — Fahri Yusuf | System Analyst & Full-Stack Developer',
  description:
    'Daftar sertifikasi dan kursus Fahri Yusuf, System Analyst & Full-Stack Developer di Jakarta: System Analyst (BNSP), CCNA, AWS Cloud Practitioner, dan materi pendukung System Analysis & Design.',
  alternates: { canonical: '/sertifikasi' },
  openGraph: {
    url: '/sertifikasi',
    title: 'Sertifikasi — Fahri Yusuf | System Analyst & Full-Stack Developer',
    description:
      'Sertifikasi dan kursus Fahri Yusuf: System Analyst (BNSP), CCNA, AWS Cloud Practitioner, dan materi pendukung System Analysis & Design.',
  },
}

export default async function CertificationPage() {
  const certificates = await getCertificates()

  return (
    <main className="min-h-screen pt-32 pb-20">
      <SubNav current="Sertifikasi" />

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <header className="mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--foreground-rgb))] mb-4">
            Sertifikasi & Kursus — Fahri Yusuf
          </h1>
          <div className="w-20 h-1 rounded-full mb-6" style={{ background: '#5C6CFF' }} />
          <p className="text-white/70 max-w-3xl leading-relaxed">
            Sertifikasi dan kursus yang saya ikuti untuk memperkuat kemampuan sebagai System
            Analyst & Full-Stack Developer, mulai dari analisis sistem, desain, sampai implementasi
            web dan komputasi awan.
          </p>
        </header>

        {certificates.length === 0 ? (
          <p className="text-white/70 py-16">Belum ada sertifikat yang ditampilkan.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <li
                key={cert.id}
                className="rounded-2xl overflow-hidden border"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                {cert.imageUrl ? (
                  <div className="relative aspect-[16/9] w-full" style={{ background: '#080808' }}>
                    <Image
                      src={cert.imageUrl}
                      alt={`Sertifikat ${cert.title} — ${cert.issuer}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-5">
                  <p className="text-xs text-white/70 mb-1">
                    {cert.issuer}
                    {cert.date ? ` • ${cert.date}` : ''}
                  </p>
                  <h2 className="text-base font-semibold text-[rgb(var(--foreground-rgb))]">
                    {cert.title}
                  </h2>
                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm font-semibold"
                      style={{ color: '#5C6CFF' }}
                    >
                      Lihat sertifikat →
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-16">
          <Link href="/" className="font-semibold" style={{ color: '#5C6CFF' }}>
            ← Kembali ke beranda
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
