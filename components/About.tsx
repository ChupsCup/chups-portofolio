'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ButtonPill from '@/components/ButtonPill'
import ParallaxSection from './ParallaxSection'
import ScrambleText from './ScrambleText'
import { supabase, AboutInfo } from '@/lib/supabase'

export default function About() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [about, setAbout] = useState<AboutInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [hero, setHero] = useState<{ title_prefix: string; highlight: string; para1: string; para2: string; points: string[] }>({
    title_prefix: "Hello! I'm a",
    highlight: 'passionate developer',
    para1: "I'm a full-stack developer with a passion for creating beautiful and functional web applications.",
    para2: "I specialize in building responsive, user-friendly applications using the latest technologies like React, Next.js, TypeScript, and more. I'm always eager to learn new technologies and improve my skills.",
    points: [
      'Clean & Maintainable Code',
      'Responsive Design',
      'Performance Optimization',
      'Modern Best Practices',
    ],
  })

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const { data, error } = await supabase
          .from('profile_photos')
          .select('photo_url')
          .order('created_at', { ascending: false })
          .limit(1)

        if (error) throw error
        if (data && data.length > 0) {
          setProfilePhoto(data[0].photo_url)
        } else {
          // Fallback ke default image jika tidak ada
          setProfilePhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop')
        }
      } catch (error) {
        console.error('Error fetching profile photo:', error)
        // Fallback ke default image
        setProfilePhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop')
      } finally {
        setLoading(false)
      }
    }

    const fetchAbout = async () => {
      try {
        // 1) Try from Storage JSON
        const { data, error } = await supabase.storage.from('portfolio').download('about/about.json')
        if (!error && data) {
          const text = await data.text()
          const json = JSON.parse(text)
          // If file contains combined object { ...about fields, hero: {...} }
          if (json.hero) {
            const h = json.hero
            setHero({
              title_prefix: h.title_prefix || hero.title_prefix,
              highlight: h.highlight || hero.highlight,
              para1: h.para1 || hero.para1,
              para2: h.para2 || hero.para2,
              points: Array.isArray(h.points) && h.points.length ? h.points : hero.points,
            })
          }
          // Map known about fields if present
          setAbout({
            id: json.id ?? 0,
            name: json.name ?? about?.name ?? '',
            location: json.location ?? about?.location ?? '',
            education: json.education ?? about?.education ?? '',
            email: json.email ?? about?.email ?? '',
            phone: json.phone ?? about?.phone ?? '',
            status: json.status ?? about?.status ?? '',
            cv_url: json.cv_url ?? about?.cv_url ?? '',
            created_at: json.created_at ?? new Date().toISOString(),
          } as AboutInfo)
          return
        }
      } catch {}
    }

    fetchProfilePhoto()
    fetchAbout()
  }, [])
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const infoItems = [
    {
      label: 'Nama',
      value: about?.name || 'Hizkia Siahaan',
      icon: (
        <svg className="w-5 h-5 text-cream-50" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
        </svg>
      ),
    },
    {
      label: 'Domisili',
      value: about?.location || 'Medan, Indonesia',
      icon: (
        <svg className="w-5 h-5 text-cream-50" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C7.589 2 4 5.589 4 10c0 5.25 7 12 8 12s8-6.75 8-12c0-4.411-3.589-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
        </svg>
      ),
    },
    {
      label: 'Pendidikan',
      value: about?.education || 'Teknik Informatika USU',
      icon: (
        <svg className="w-5 h-5 text-cream-50" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3 1 9l11 6 9-4.909V17h2V9L12 3Zm0 11.197L4.236 9 12 4.803 19.764 9 12 14.197ZM5 13.5V18c0 2.209 3.582 4 8 4s8-1.791 8-4v-4.5l-2 1.091V18c0 .825-2.686 2-6 2s-6-1.175-6-2v-3.409L5 13.5Z"/>
        </svg>
      ),
    },
    {
      label: 'Email',
      value: about?.email || 'emma@example.com',
      icon: (
        <svg className="w-5 h-5 text-cream-50" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z" />
        </svg>
      ),
    },
    {
      label: 'Phone',
      value: about?.phone || '+62 812-3456-7890',
      icon: (
        <svg className="w-5 h-5 text-cream-50" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11.85 21 3 12.15 3 1a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.21 2.2Z" />
        </svg>
      ),
    },
    {
      label: 'Status',
      value: about?.status || 'Available for Work',
      icon: (
        <svg className="w-5 h-5 text-cream-50" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 6h-4V4a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2ZM10 4h4v2h-4V4Zm10 14H4V8h16v10Z" />
        </svg>
      ),
    },
  ]

  return (
  <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <ScrambleText text="About Me" className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--foreground-rgb))] mb-4 inline-block" />
          </motion.div>
          <motion.div variants={itemVariants} className="w-20 h-1 mx-auto" style={{ background: '#5C6CFF' }}></motion.div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Photo Section - Left - BULAT with GAHAR Animation but Static Photo */}
          <motion.div
            className="relative flex justify-center items-center"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          >
            <motion.div
              className="absolute w-80 h-80 md:w-[25rem] md:h-[25rem] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(92,108,255,0.08), rgba(0,0,0,0) 70%)',
                zIndex: -1,
              }}
              animate={{ scale: [1, 1.04, 1], opacity: [0.12, 0.2, 0.12] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Main Circular Photo Container - STATIC NO ANIMATION */}
            <div
              className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 40px rgba(255,255,255,0.04)' }}
            >
              {/* Photo */}
              {!loading && profilePhoto && (
                <Image
                  src={profilePhoto}
                  alt="Profile Photo"
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {loading && (
                <div className="w-full h-full bg-gray-700 animate-pulse" />
              )}
            </div>
            <div
              className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full pointer-events-none"
              style={{
                border: '2px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.05), 0 0 20px rgba(0,0,0,0.3)'
              }}
            />
          </motion.div>

          {/* Text Section - Right */}
          <ParallaxSection offset={30}>
            <motion.div className="space-y-6">
              <motion.h3 variants={itemVariants} className="text-3xl md:text-4xl font-extrabold text-[rgb(var(--foreground-rgb))]">
                {hero.title_prefix}{' '}
                <span
                  style={{
                    color: '#5C6CFF',
                  }}
                >
                  {hero.highlight}
                </span>
              </motion.h3>
              <motion.p variants={itemVariants} className="text-white/80 leading-relaxed text-lg">
                {hero.para1}
              </motion.p>
              <motion.p variants={itemVariants} className="text-white/70 leading-relaxed">
                {hero.para2}
              </motion.p>
              <motion.div variants={itemVariants} className="space-y-3 pt-4">
                {hero.points.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#5C6CFF' }}>
                      <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[rgb(var(--foreground-rgb))]">{skill}</span>
                  </div>
                ))}
              </motion.div>

              {/* Info Cards */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6"
              >
                {infoItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative flex items-start gap-3 p-4 bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-xl shadow-sm hover:shadow-md transition-all will-change-transform"
                    onMouseMove={(e) => {
                      const t = e.currentTarget as HTMLDivElement
                      const r = t.getBoundingClientRect()
                      const x = ((e.clientX - r.left) / r.width) * 100
                      const y = ((e.clientY - r.top) / r.height) * 100
                      t.style.setProperty('--x', `${x}%`)
                      t.style.setProperty('--y', `${y}%`)
                    }}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'radial-gradient(240px 100px at var(--x,50%) var(--y,50%), rgba(92,108,255,0.16), transparent 60%)' }} />
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-inner" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70">{item.label}</p>
                      <p className="text-[rgb(var(--foreground-rgb))] font-semibold truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="pt-6 flex flex-wrap gap-3">
                <ButtonPill href={about?.cv_url || '/cv.pdf'} label="Download CV" variant="cobalt" />
                <ButtonPill href="#contact" label="Hire Me Now" variant="mint" />
              </motion.div>
            </motion.div>
          </ParallaxSection>
        </motion.div>
      </div>
    </section>
  )
}
