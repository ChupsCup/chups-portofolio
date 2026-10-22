import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Education from '@/components/Education'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import {
  getAboutBundle,
  getCertificates,
  getExperiences,
  getHeroContent,
  getProjects,
  getSkills,
} from '@/lib/content'

// ISR: halaman di-render ulang tiap jam, jadi konten Supabase tetap fresh
// tanpa harus rebuild, tapi tetap di-cache (cepat + murah).
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fahri Yusuf — System Analyst & Full-Stack Developer di Jakarta',
  description:
    'Fahri Yusuf, System Analyst & Full-Stack Developer berbasis di Jakarta, Indonesia. Portfolio lengkap: pengalaman kerja, projects, skill, dan sertifikasi (System Analyst BNSP, CCNA, AWS).',
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'Fahri Yusuf — System Analyst & Full-Stack Developer di Jakarta',
    description:
      'Portfolio Fahri Yusuf, System Analyst & Full-Stack Developer di Jakarta. Spesialis analisis sistem, business application, dan pengembangan web modern.',
  },
}

export default async function Home() {
  const [hero, aboutBundle, projects, experiences, skills, certificates] = await Promise.all([
    getHeroContent(),
    getAboutBundle(),
    getProjects(),
    getExperiences(),
    getSkills(),
    getCertificates(),
  ])

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="relative">
        <Hero initialHero={hero} />
      </section>
      <section className="relative">
        <About
          initialAbout={aboutBundle.about}
          initialAboutContent={aboutBundle.aboutContent}
          initialProfilePhoto={aboutBundle.profilePhoto}
        />
      </section>
      <Experience initialExperiences={experiences} />
      <Projects initialProjects={projects} />
      <Skills initialCategories={skills.categories} initialSoftSkills={skills.softSkills} />
      <Education certificates={certificates.length ? certificates : undefined} />
      <Contact />
      <Footer />
    </main>
  )
}
