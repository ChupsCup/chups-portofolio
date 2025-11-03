import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types untuk database
export interface Project {
  id: number
  title: string
  description: string
  image_url: string
  demo_url?: string
  github_url?: string
  technologies: string[]
  created_at: string
}

export interface Experience {
  id: number
  company: string
  position: string
  description: string
  start_date: string
  end_date?: string
  is_current: boolean
  technologies: string[]
  created_at: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  created_at: string
}

export interface AboutInfo {
  id: number
  name: string
  location: string
  education: string
  email: string
  phone: string
  status: string
  cv_url?: string
  created_at: string
}

