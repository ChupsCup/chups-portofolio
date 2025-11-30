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

    // Telegram Bot API
    const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    let TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''

    if (!TG_TOKEN) {
      return NextResponse.json({ ok: false, hint: 'Telegram not configured. Set TELEGRAM_BOT_TOKEN (and optionally TELEGRAM_CHAT_ID).' }, { status: 501 })
    }

    const base = `https://api.telegram.org/bot${TG_TOKEN}`
    const text = `📬 Portfolio Contact\n\nName: ${name}\nEmail: ${email}\n\n${message}`.slice(0, 3900)

    async function sendTo(chatId: string) {
      const resp = await fetch(`${base}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok || data?.ok === false) {
        throw new Error(JSON.stringify(data))
      }
      return data
    }

    try {
      if (!TG_CHAT_ID) {
        // Try to discover chat_id from recent updates
        const updResp = await fetch(`${base}/getUpdates`)
        const upd = await updResp.json().catch(() => ({}))
        const updates = upd?.result || []
        const lastMsg = [...updates].reverse().find((u: any) => u?.message?.chat?.id)
        if (lastMsg?.message?.chat?.id) TG_CHAT_ID = String(lastMsg.message.chat.id)
      }
      if (!TG_CHAT_ID) {
        // Provide helpful hint including bot username
        const meResp = await fetch(`${base}/getMe`)
        const me = await meResp.json().catch(() => ({}))
        const handle = me?.result?.username ? `https://t.me/${me.result.username}` : undefined
        const hint = handle ? `Open ${handle} and send any message once to initialize chat, then retry.` : 'Open your bot in Telegram and send any message to initialize chat, then retry.'
        return NextResponse.json({ ok: false, provider: 'telegram', error: 'Missing chat id', hint }, { status: 400 })
      }

      const result = await sendTo(TG_CHAT_ID)
      return NextResponse.json({ ok: true, notified: 'telegram', id: result?.result?.message_id, chat_id: TG_CHAT_ID })
    } catch (e: any) {
      return NextResponse.json({ ok: false, provider: 'telegram', error: String(e?.message || e) }, { status: 500 })
    }
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
