import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Save to Supabase (best-effort)
    try {
      await supabase.from('contact_messages').insert([{ name, email, message }])
    } catch (e) {
      console.warn('Failed to insert contact message to Supabase (non-fatal):', e)
    }

    // Send email via Resend (no extra dependency needed)
    const apiKey = process.env.RESEND_API_KEY
    let emailed = false
    if (apiKey) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'Portfolio <onboarding@resend.dev>',
            to: ['fahriysuf@gmail.com'],
            subject: `New contact message from ${name}`,
            reply_to: email,
            text: `You have a new contact message.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          }),
        })
        if (!res.ok) {
          const t = await res.text()
          console.warn('Resend error:', t)
        } else {
          emailed = true
        }
      } catch (e) {
        console.warn('Failed to send email via Resend (non-fatal):', e)
      }
    } else {
      console.warn('RESEND_API_KEY not set; skipping email send.')
    }

    return NextResponse.json({ ok: true, emailed })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
