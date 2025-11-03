import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CookieOptions } from '@supabase/ssr'

export async function POST() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => {
          const cookie = await cookieStore.get(name)
          return cookie?.value
        },
        set: async (name: string, value: string, options: CookieOptions) => {
          await cookieStore.set(name, value, options)
        },
        remove: async (name: string, options: CookieOptions) => {
          await cookieStore.set(name, '', { ...options, maxAge: 0 })
        }
      }
    }
  )

  try {
    // Check if required tables exist; client cannot run arbitrary SQL.
    const { error: existsError } = await supabase
      .from('skill_categories')
      .select('id')
      .limit(1)

    if (existsError) {
      return NextResponse.json(
        { error: 'Skills tables not found. Please run the SQL setup via Supabase SQL editor or a server-side migration.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Database already set up' })
  } catch (error) {
    console.error('Error setting up database:', error)
    return NextResponse.json({ error: 'Failed to set up database' }, { status: 500 })
  }
}