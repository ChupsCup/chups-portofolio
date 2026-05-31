import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import DynamicSections from '@/components/DynamicSections'
import Education from '@/components/Education'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="relative">
        <Hero />
      </section>
      <section className="relative">
        <About />
      </section>
      <DynamicSections />
      <Education />
      <Contact />
      <Footer />
    </main>
  )
}

