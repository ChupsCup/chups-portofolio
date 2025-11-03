import { createServerClient } from '@supabase/ssr'
import { createClient as createServerAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CookieOptions } from '@supabase/ssr'

export async function GET() {
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

  // Fetch all categories with their skills
  const { data: categories, error: categoriesError } = await supabase
    .from('skill_categories')
    .select(`
      *,
      skills:skills(*)
    `)
    .order('created_at', { ascending: true })

  // Fetch soft skills
  const { data: softSkills, error: softSkillsError } = await supabase
    .from('soft_skills')
    .select('*')
    .order('created_at', { ascending: true })

  if (categoriesError || softSkillsError) {
    return NextResponse.json(
      { error: categoriesError || softSkillsError },
      { status: 500 }
    )
  }

  return NextResponse.json({ categories, softSkills })
}

export async function POST(request: Request) {
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
  const json = await request.json()

  const {
    type,
    data,
    serviceRole,
  }: {
    type: 'category' | 'skill' | 'soft-skill' | 'seed'
    data: any
    serviceRole?: string
  } = json

  try {
    let result

    switch (type) {
      case 'category':
        result = await supabase
          .from('skill_categories')
          .insert(data)
          .select()
          .single()
        break

      case 'seed': {
        // Use service role if available to bypass RLS
        const serviceKey = serviceRole || process.env.SUPABASE_SERVICE_ROLE
        const admin = serviceKey
          ? createServerAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)
          : supabase
        const NIL_UUID = '00000000-0000-0000-0000-000000000000'
        // expected shape: {
        //   categories: [{ title, efficiency, skills: [{ name, level, type?, note? }] }],
        //   softSkills: [{ name }]
        // }
        const { categories = [], softSkills = [] } = data || {}

        // 1) delete children first to satisfy FK
        const del1 = await admin.from('skills').delete().neq('id', NIL_UUID)
        if ('error' in del1 && del1.error) throw del1.error
        const del2 = await admin.from('soft_skills').delete().neq('id', NIL_UUID)
        if ('error' in del2 && del2.error) throw del2.error
        const del3 = await admin.from('skill_categories').delete().neq('id', NIL_UUID)
        if ('error' in del3 && del3.error) throw del3.error

        // 2) insert categories and capture ids
        let insertedCategories: any[] = []
        if (categories.length) {
          const insertPayload = categories.map((c: any) => ({ title: c.title, efficiency: c.efficiency }))
          const { data: catRows, error: catErr } = await admin
            .from('skill_categories')
            .insert(insertPayload)
            .select('*')
          if (catErr) throw catErr
          insertedCategories = catRows || []
        }

        // 3) make a title -> id map
        const idByTitle = new Map<string, string>()
        for (const c of insertedCategories) idByTitle.set(c.title, c.id)

        // 4) insert skills flatted with category_id
        const allSkills: any[] = []
        for (const cat of categories) {
          const cid = idByTitle.get(cat.title)
          if (!cid) continue
          for (const s of (cat.skills || [])) {
            allSkills.push({
              name: s.name,
              level: s.level,
              type: s.type || '',
              note: s.note || '',
              category_id: cid,
            })
          }
        }
        if (allSkills.length) {
          const { error: skillsErr } = await admin.from('skills').insert(allSkills)
          if (skillsErr) throw skillsErr
        }

        // 5) insert soft skills
        if (softSkills.length) {
          const { error: softErr } = await admin.from('soft_skills').insert(softSkills)
          if (softErr) throw softErr
        }

        result = { data: { categories: insertedCategories.length, skills: allSkills.length, softSkills: softSkills.length } } as any
        break
      }

      case 'skill':
        result = await supabase
          .from('skills')
          .insert(data)
          .select()
          .single()
        break

      case 'soft-skill':
        result = await supabase
          .from('soft_skills')
          .insert(data)
          .select()
          .single()
        break

      default:
        throw new Error('Invalid type')
    }

    if (result.error) throw result.error

    return NextResponse.json(result.data)
  } catch (error) {
    const message = (error as any)?.message || JSON.stringify(error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
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
  const json = await request.json()

  const {
    type,
    id,
    data,
  }: {
    type: 'category' | 'skill' | 'soft-skill'
    id: string
    data: any
  } = json

  try {
    let result

    switch (type) {
      case 'category':
        result = await supabase
          .from('skill_categories')
          .update(data)
          .eq('id', id)
          .select()
          .single()
        break

      case 'skill':
        result = await supabase
          .from('skills')
          .update(data)
          .eq('id', id)
          .select()
          .single()
        break

      case 'soft-skill':
        result = await supabase
          .from('soft_skills')
          .update(data)
          .eq('id', id)
          .select()
          .single()
        break

      default:
        throw new Error('Invalid type')
    }

    if (result.error) throw result.error

    return NextResponse.json(result.data)
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
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
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const id = searchParams.get('id')

  if (!type || !id) {
    return NextResponse.json(
      { error: 'Missing type or id parameter' },
      { status: 400 }
    )
  }

  try {
    let result

    switch (type) {
      case 'category':
        result = await supabase
          .from('skill_categories')
          .delete()
          .eq('id', id)
        break

      case 'skill':
        result = await supabase
          .from('skills')
          .delete()
          .eq('id', id)
        break

      case 'soft-skill':
        result = await supabase
          .from('soft_skills')
          .delete()
          .eq('id', id)
        break

      default:
        throw new Error('Invalid type')
    }

    if (result.error) throw result.error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}