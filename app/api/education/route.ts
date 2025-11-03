import { createServerClient } from '@supabase/ssr'
import { createClient as createServerAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CookieOptions } from '@supabase/ssr'

const table = 'educations'
const bucket = 'portfolio'
const storageKey = 'education/data.json'

async function getClient() {
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
  return supabase
}

export async function GET() {
  const supabase = await getClient()
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false })
  if (error) {
    // Fallback to storage JSON when table not found
    if (error.message?.toLowerCase().includes('schema') || error.message?.toLowerCase().includes('relation') || error.code === 'PGRST116') {
      const { data: file } = await supabase.storage.from(bucket).download(storageKey)
      if (!file) return NextResponse.json({ items: [] })
      const text = await file.text().catch(() => '[]')
      const list = JSON.parse(text || '[]')
      return NextResponse.json({ items: list })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ items: data || [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { serviceRole, data } = body as { serviceRole?: string, data: any }
  const client = serviceRole ? createServerAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRole) : await getClient()
  const { data: inserted, error } = await client.from(table).insert(data).select().single()
  if (error) {
    if (error.message?.toLowerCase().includes('schema') || error.message?.toLowerCase().includes('relation') || error.code === 'PGRST116') {
      // storage fallback
      const { data: file } = await client.storage.from(bucket).download(storageKey)
      let list: any[] = []
      if (file) {
        const text = await file.text().catch(() => '[]')
        list = JSON.parse(text || '[]')
      }
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const item = { id, ...data, created_at: new Date().toISOString() }
      list.unshift(item)
      const blob = new Blob([JSON.stringify(list)], { type: 'application/json' })
      await client.storage.from(bucket).upload(storageKey, blob, { upsert: true, contentType: 'application/json' })
      return NextResponse.json(item)
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(inserted)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { serviceRole, id, data } = body as { serviceRole?: string, id: string, data: any }
  const client = serviceRole ? createServerAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRole) : await getClient()
  const { data: updated, error } = await client.from(table).update(data).eq('id', id).select().single()
  if (error) {
    if (error.message?.toLowerCase().includes('schema') || error.message?.toLowerCase().includes('relation') || error.code === 'PGRST116') {
      const { data: file } = await client.storage.from(bucket).download(storageKey)
      let list: any[] = []
      if (file) {
        const text = await file.text().catch(() => '[]')
        list = JSON.parse(text || '[]')
      }
      list = list.map((x: any) => (x.id === id ? { ...x, ...data } : x))
      const blob = new Blob([JSON.stringify(list)], { type: 'application/json' })
      await client.storage.from(bucket).upload(storageKey, blob, { upsert: true, contentType: 'application/json' })
      const item = list.find((x) => x.id === id)
      return NextResponse.json(item)
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(updated)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const serviceRole = searchParams.get('serviceRole') || undefined
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const client = serviceRole ? createServerAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRole) : await getClient()
  const { error } = await client.from(table).delete().eq('id', id)
  if (error) {
    if (error.message?.toLowerCase().includes('schema') || error.message?.toLowerCase().includes('relation') || error.code === 'PGRST116') {
      const { data: file } = await client.storage.from(bucket).download(storageKey)
      let list: any[] = []
      if (file) {
        const text = await file.text().catch(() => '[]')
        list = JSON.parse(text || '[]')
      }
      list = list.filter((x: any) => String(x.id) !== String(id))
      const blob = new Blob([JSON.stringify(list)], { type: 'application/json' })
      await client.storage.from(bucket).upload(storageKey, blob, { upsert: true, contentType: 'application/json' })
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
