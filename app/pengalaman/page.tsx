import type { Metadata } from 'next'
import Link from 'next/link'
import SubNav from '@/components/SubNav'
import Footer from '@/components/Footer'
import { formatDateRange, getExperiences } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Pengalaman Kerja — Fahri Yusuf | System Analyst & Full-Stack Developer',
  description:
    'Pengalaman kerja Fahri Yusuf, System Analyst & Full-Stack Developer di Jakarta: business application (SQL, ERP, Accurate), troubleshooting SQL/SAP/BI, dan operasional sistem broadcasting.',
  alternates: { canonical: '/pengalaman' },
  openGraph: {
    url: '/pengalaman',
    title: 'Pengalaman Kerja — Fahri Yusuf | System Analyst & Full-Stack Developer',
    description:
      'Timeline pengalaman kerja Fahri Yusuf sebagai System Analyst & Full-Stack Developer: aplikasi bisnis SQL & ERP, troubleshooting SAP dan Business Intelligence, serta automasi operasional.',
  },
}

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return (
    <main className="min-h-screen pt-32 pb-20">
      <SubNav current="Pengalaman" />

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <header className="mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--foreground-rgb))] mb-4">
            Pengalaman Kerja — Fahri Yusuf
          </h1>
          <div className="w-20 h-1 rounded-full mb-6" style={{ background: '#5C6CFF' }} />
          <p className="text-white/70 max-w-3xl leading-relaxed">
            Pengalaman saya sebagai System Analyst & Full-Stack Developer di Jakarta — menangani
            aplikasi bisnis (SQL, ERP, Accurate), troubleshooting sistem SAP dan Business
            Intelligence, sampai automasi operasional dan dokumentasi teknis.
          </p>
        </header>

        {experiences.length === 0 ? (
          <p className="text-white/70 py-16">Belum ada data pengalaman yang ditampilkan.</p>
        ) : (
          <ol className="space-y-8">
            {experiences.map((exp) => (
              <li key={exp.id} className="relative pl-8 border-l-2" style={{ borderColor: '#5C6CFF' }}>
                <div
                  className="absolute -left-4 top-0 w-6 h-6 rounded-full border-4"
                  style={{ background: '#5C6CFF', borderColor: 'rgba(12,12,12,1)' }}
                />
                <article
                  className="p-6 rounded-lg border"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-2">
                    <div>
                      <h2 className="text-2xl font-bold text-[rgb(var(--foreground-rgb))] mb-1">
                        {exp.position}
                      </h2>
                      <p className="text-lg text-white/80 font-semibold">{exp.company}</p>
                    </div>
                    <p className="text-sm text-white/70 font-medium md:text-right">
                      {formatDateRange(exp)}
                    </p>
                  </div>

                  {exp.description ? (
                    <p className="text-white/85 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  ) : null}

                  {exp.technologies?.length ? (
                    <ul className="flex flex-wrap gap-2 mt-4">
                      {exp.technologies.map((tech, i) => (
                        <li
                          key={i}
                          className="px-3 py-1 text-black text-xs font-semibold rounded-full"
                          style={{ background: '#5C6CFF' }}
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
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
