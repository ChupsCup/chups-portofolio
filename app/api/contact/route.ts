import { NextResponse } from 'next/server'
export const runtime = 'nodejs'
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

    // Discord webhook (only)
    let discordWebhook = process.env.DISCORD_WEBHOOK_URL || ''
    // normalize old domain to new
    if (discordWebhook.startsWith('https://discordapp.com/')) {
      discordWebhook = discordWebhook.replace('https://discordapp.com/', 'https://discord.com/')
    }
    let notified: 'discord' | 'none' = 'none'
    if (discordWebhook) {
      try {
        // 1) Minimal payload first (highest compatibility)
        const minimal = await fetch(discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'Portfolio Bot',
            content: `📬 New contact message\n\n**Name:** ${name}\n**Email:** ${email}\n\n${message}`.slice(0, 1800),
            allowed_mentions: { parse: [] },
          }),
        })
        if (minimal.ok) {
          notified = 'discord'
        } else {
          const text1 = await minimal.text()
          console.warn('Discord webhook minimal error:', text1)
          // 2) Try rich embed as fallback
          const rich = await fetch(discordWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: 'Portfolio Bot',
              content: '📬 New contact message',
              embeds: [
                {
                  title: `From: ${name}`,
                  description: (message || '').slice(0, 1800),
                  color: 5814783,
                  fields: [
                    { name: 'Email', value: email, inline: true },
                  ],
                  timestamp: new Date().toISOString(),
                },
              ],
              allowed_mentions: { parse: [] },
            }),
          })
          if (!rich.ok) {
            const text2 = await rich.text()
            return NextResponse.json({ ok: false, notified: 'none', provider: 'discord', error: text2 || text1 }, { status: rich.status || minimal.status || 500 })
          }
          notified = 'discord'
        }
      } catch (e: any) {
        console.warn('Failed to send Discord webhook:', e)
        return NextResponse.json({ ok: false, notified: 'none', provider: 'discord', error: String(e) }, { status: 500 })
      }
    }

    if (notified === 'none') {
      return NextResponse.json({ ok: false, notified, hint: 'Discord webhook not configured or failed. Check DISCORD_WEBHOOK_URL and server logs.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, notified })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
