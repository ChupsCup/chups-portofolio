import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CookieOptions } from '@supabase/ssr'
import fs from 'fs'
import path from 'path'

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
    // Read the SQL setup file
    const sqlPath = path.join(process.cwd(), 'app', 'api', 'skills', 'setup-database.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')

    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)

    // Execute the SQL statements directly
    const { error } = await supabase.from('skill_categories').select('*')
    if (error) {
      // Tables don't exist, create them
      const { error: setupError } = await supabase
        .from('rpc')
        .select('*')
        .execute(sqlContent)
      if (setupError) throw setupError
    }

    return NextResponse.json({ message: 'Database setup completed successfully' })
  } catch (error) {
    console.error('Error setting up database:', error)
    return NextResponse.json({ error: 'Failed to set up database' }, { status: 500 })
  }
}