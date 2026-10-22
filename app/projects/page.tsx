import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import SubNav from '@/components/SubNav'
import Footer from '@/components/Footer'
import { getProjects } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Projects — Fahri Yusuf | System Analyst & Full-Stack Developer',
  description:
    'Portofolio project Fahri Yusuf, System Analyst & Full-Stack Developer di Jakarta. Daftar aplikasi web, sistem informasi, dan dashboard yang pernah dibangun dengan React, Next.js, TypeScript, dan Laravel.',
  alternates: { canonical: '/projects' },
  openGraph: {
    url: '/projects',
    title: 'Projects — Fahri Yusuf | System Analyst & Full-Stack Developer',
    description:
      'Daftar project Fahri Yusuf: aplikasi web, sistem informasi, dan dashboard yang dibangun dengan React, Next.js, TypeScript, dan Laravel.',
  },
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <main className="min-h-screen pt-32 pb-20">
      <SubNav current="Projects" />

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <header className="mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--foreground-rgb))] mb-4">
            Projects — Fahri Yusuf
          </h1>
          <div className="w-20 h-1 rounded-full mb-6" style={{ background: '#5C6CFF' }} />
          <p className="text-white/70 max-w-3xl leading-relaxed">
            Kumpulan project yang pernah saya kerjakan sebagai System Analyst & Full-Stack Developer di
            Jakarta — dari aplikasi web, dashboard operasional, sampai sistem informasi internal.
            Fokus saya adalah membangun sistem yang rapi, mudah dipakai, dan benar-benar jalan di
            operasional bisnis.
          </p>
        </header>

        {projects.length === 0 ? (
          <p className="text-white/70 py-16">Belum ada project yang ditampilkan.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => {
              const cover = project.image_url || (project.image_urls || [])[0]
              return (
                <article
                  key={project.id}
                  className="rounded-2xl overflow-hidden border"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  {cover ? (
                    <div className="relative h-56 w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <Image
                        src={cover}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-[rgb(var(--foreground-rgb))] mb-2">
                      {project.title}
                    </h2>
                    <p className="text-white/80 mb-4 whitespace-pre-line">{project.description}</p>
                    {project.technologies?.length ? (
                      <ul className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, i) => (
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
                    <div className="flex flex-wrap gap-4 text-sm">
                      {project.demo_url ? (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold"
                          style={{ color: '#5C6CFF' }}
                        >
                          Lihat demo →
                        </a>
                      ) : null}
                      {project.github_url ? (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold"
                          style={{ color: '#5C6CFF' }}
                        >
                          Lihat kode →
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
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
