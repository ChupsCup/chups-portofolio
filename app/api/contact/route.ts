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

    // Prefer Discord webhook if available
    let discordWebhook = process.env.DISCORD_WEBHOOK_URL || ''
    // normalize old domain to new
    if (discordWebhook.startsWith('https://discordapp.com/')) {
      discordWebhook = discordWebhook.replace('https://discordapp.com/', 'https://discord.com/')
    }
    let notified: 'discord' | 'email' | 'none' = 'none'
    if (discordWebhook) {
      try {
        const res = await fetch(discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `📬 New contact message`,
            embeds: [
              {
                title: `From: ${name}`,
                description: message,
                color: 5814783,
                fields: [
                  { name: 'Email', value: email, inline: true },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        })
        if (!res.ok) {
          const t = await res.text()
          console.warn('Discord webhook error:', t)
        } else {
          notified = 'discord'
        }
      } catch (e) {
        console.warn('Failed to send Discord webhook (non-fatal):', e)
      }
    }

    // If no Discord, try Resend email
    if (notified === 'none') {
      const apiKey = process.env.RESEND_API_KEY
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
            notified = 'email'
          }
        } catch (e) {
          console.warn('Failed to send email via Resend (non-fatal):', e)
        }
      } else {
        console.warn('No DISCORD_WEBHOOK_URL or RESEND_API_KEY set; skipping notifications.')
      }
    }

    if (notified === 'none') {
      return NextResponse.json({ ok: false, notified }, { status: 500 })
    }
    return NextResponse.json({ ok: true, notified })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
