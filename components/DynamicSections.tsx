'use client'

import dynamic from 'next/dynamic'

const SectionLoading = ({ title }: { title: string }) => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded-full bg-white/10 mx-auto" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-72 rounded-3xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  </section>
)

const Experience = dynamic(() => import('./Experience'), {
  ssr: false,
  loading: () => <SectionLoading title="Experience" />,
})

const Projects = dynamic(() => import('./Projects'), {
  ssr: false,
  loading: () => <SectionLoading title="Projects" />,
})

const Skills = dynamic(() => import('./Skills'), {
  ssr: false,
  loading: () => <SectionLoading title="Skills" />,
})

export default function DynamicSections() {
  return (
    <>
      <Experience />
      <Projects />
      <Skills />
    </>
  )
}
