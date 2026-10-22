import { createClient } from '@supabase/supabase-js'
import type { AboutInfo, Experience, Project } from './supabase'

/**
 * Server-side content layer.
 *
 * Semua data portfolio ditarik di server (Server Component) supaya isi halaman
 * ikut ter-render di HTML — bukan hanya skeleton client-side. Ini penting buat
 * SEO: Google perlu melihat teks "Fahri Yusuf", deskripsi, skill, dsb. di HTML.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const REVALIDATE_SECONDS = 3600

export type HeroContent = {
  title_prefix: string
  highlight: string
  para1: string
  para2: string
  points: string[]
}

export type AboutContent = {
  title_prefix: string
  highlight: string
  para1: string
  para2: string
  points: string[]
}

export type Skill = {
  id: string
  name: string
  level: number
  type: string
  note?: string
  category_id: string
}

export type SkillCategory = {
  id: string
  title: string
  efficiency: number
  skills: Skill[]
}

export type Certificate = {
  id: string
  title: string
  issuer: string
  date: string
  credentialUrl?: string
  imageUrl?: string
}

export const DEFAULT_HERO: HeroContent = {
  title_prefix: "Hi, I'm Fahri Yusuf",
  highlight: 'System Analyst & Developer',
  para1:
    'Fahri Yusuf, System Analyst & Full-Stack Developer berbasis di Jakarta, Indonesia. Berpengalaman membangun sistem informasi, aplikasi web, dan solusi data untuk operasional bisnis.',
  para2: '',
  points: [
    'System Analyst',
    'Business Analyst',
    'Full-Stack Developer',
    'Software Engineer',
    'IT Business Analyst',
    'IT Support',
  ],
}

const EMPTY_ABOUT_CONTENT: AboutContent = {
  title_prefix: '',
  highlight: '',
  para1: '',
  para2: '',
  points: [],
}

function makeClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: any, init: any = {}) =>
        fetch(input, {
          ...init,
          next: { ...(init?.next ?? {}), revalidate: REVALIDATE_SECONDS },
        } as any),
    },
  })
}

function toPoints(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string') as string[]
  if (typeof value === 'string' && value.trim().length) {
    return value
      .split(/\r?\n/)
      .map((v) => v.trim())
      .filter(Boolean)
  }
  return []
}

// Nama ditulis "fahri yusuf" di beberapa sumber data; samakan kapitalisasinya
// supaya konsisten di <h1>, metadata, dan structured data.
function normalizeName(value: string): string {
  if (!value) return value
  return value.replace(/fahri\s+yusuf/gi, 'Fahri Yusuf')
}

export async function getHeroContent(): Promise<HeroContent> {
  const supabase = makeClient()
  if (!supabase) return DEFAULT_HERO
  try {
    const { data, error } = await supabase.storage.from('portfolio').download('hero/hero.json')
    if (error || !data) return DEFAULT_HERO
    const json = JSON.parse(await data.text())
    return {
      title_prefix: normalizeName(json.title_prefix || DEFAULT_HERO.title_prefix),
      highlight: json.highlight || DEFAULT_HERO.highlight,
      para1: json.para1 || DEFAULT_HERO.para1,
      para2: json.para2 || '',
      points: toPoints(json.points).length ? toPoints(json.points) : DEFAULT_HERO.points,
    }
  } catch {
    return DEFAULT_HERO
  }
}

export async function getAboutBundle(): Promise<{
  about: AboutInfo | null
  aboutContent: AboutContent
  profilePhoto: string | null
}> {
  const supabase = makeClient()
  const fallback = { about: null as AboutInfo | null, aboutContent: EMPTY_ABOUT_CONTENT, profilePhoto: null as string | null }
  if (!supabase) return fallback

  try {
    const [photoRes, aboutRes] = await Promise.all([
      supabase.from('profile_photos').select('photo_url').order('created_at', { ascending: false }).limit(1),
      supabase.storage.from('portfolio').download('about/about.json'),
    ])

    const profilePhoto = photoRes.data?.[0]?.photo_url ?? null

    if (aboutRes.error || !aboutRes.data) {
      return { ...fallback, profilePhoto }
    }

    const json = JSON.parse(await aboutRes.data.text())
    const about: AboutInfo = {
      id: json.id ?? 0,
      name: normalizeName(json.name || ''),
      location: json.location || '',
      education: normalizeName(json.education || ''),
      email: json.email || '',
      phone: json.phone || '',
      status: json.status || '',
      cv_url: json.cv_url || '',
      created_at: json.created_at ?? new Date().toISOString(),
    }

    const src = json.about_content || json.hero
    const aboutContent: AboutContent = src
      ? {
          title_prefix: src.title_prefix || '',
          highlight: src.highlight || '',
          para1: src.para1 || '',
          para2: src.para2 || '',
          points: toPoints(src.points),
        }
      : EMPTY_ABOUT_CONTENT

    return { about, aboutContent, profilePhoto }
  } catch {
    return fallback
  }
}

export async function getProjects(): Promise<Project[]> {
  const supabase = makeClient()
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return []
    return (data || []) as Project[]
  } catch {
    return []
  }
}

export async function getExperiences(): Promise<Experience[]> {
  const supabase = makeClient()
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })
    if (error) return []
    return (data || []) as Experience[]
  } catch {
    return []
  }
}

export async function getSkills(): Promise<{ categories: SkillCategory[]; softSkills: string[] }> {
  const supabase = makeClient()
  if (!supabase) return { categories: [], softSkills: [] }
  try {
    const [categoriesRes, softRes] = await Promise.all([
      supabase.from('skill_categories').select('*, skills:skills(*)').order('created_at', { ascending: true }),
      supabase.from('soft_skills').select('*').order('created_at', { ascending: true }),
    ])
    if (categoriesRes.error || softRes.error) return { categories: [], softSkills: [] }
    return {
      categories: (categoriesRes.data || []) as SkillCategory[],
      softSkills: (softRes.data || []).map((s: any) => s.name).filter(Boolean) as string[],
    }
  } catch {
    return { categories: [], softSkills: [] }
  }
}

export async function getCertificates(): Promise<Certificate[]> {
  const supabase = makeClient()
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('educations')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data && data.length) {
      return data.map((x: any) => ({
        id: String(x.id),
        title: x.title,
        issuer: x.issuer,
        date: x.date,
        credentialUrl: x.credentialUrl || undefined,
        imageUrl: x.imageUrl || undefined,
      }))
    }
  } catch {
    /* fallback ke storage */
  }

  try {
    const { data: file, error: fileError } = await supabase.storage
      .from('portfolio')
      .download('education/data.json')
    if (fileError || !file) return []
    const list = JSON.parse(await file.text())
    if (!Array.isArray(list)) return []
    return list.map((x: any) => ({
      id: String(x.id),
      title: x.title,
      issuer: x.issuer,
      date: x.date,
      credentialUrl: x.credentialUrl || undefined,
      imageUrl: x.imageUrl || undefined,
    }))
  } catch {
    return []
  }
}

export function formatDateRange(exp: Experience): string {
  const fmt = (value?: string) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
  }
  const start = fmt(exp.start_date)
  const end = exp.is_current ? 'Present' : fmt(exp.end_date)
  return [start, end].filter(Boolean).join(' - ')
}
