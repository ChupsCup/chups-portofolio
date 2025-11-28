import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Try to list CV files inside portfolio/cv bucket folder
    const { data: items, error: listError } = await supabase
      .storage
      .from('portfolio')
      .list('cv', { limit: 100, offset: 0 })

    if (listError) {
      return NextResponse.json({ message: 'Failed to list CV files' }, { status: 500 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'CV not found' }, { status: 404 })
    }

    // Pick the most recent by name (filenames have timestamp e.g., cv-<ts>.pdf)
    const latest = [...items]
      .filter((f) => f.name.toLowerCase().endsWith('.pdf'))
      .sort((a, b) => (a.name < b.name ? 1 : -1))[0]

    if (!latest) {
      return NextResponse.json({ message: 'CV file missing' }, { status: 404 })
    }

    const filePath = `cv/${latest.name}`
    const { data: file, error: downloadError } = await supabase
      .storage
      .from('portfolio')
      .download(filePath)

    if (downloadError || !file) {
      return NextResponse.json({ message: 'Failed to download CV' }, { status: 500 })
    }

    const buf = await file.arrayBuffer()
    return new NextResponse(Buffer.from(buf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${latest.name}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (e) {
    return NextResponse.json({ message: 'Unexpected server error' }, { status: 500 })
  }
}
