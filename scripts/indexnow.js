/**
 * Kirim URL portfolio ke IndexNow (api.indexnow.org) supaya Google/Bing
 * dijemput ulang tanpa harus submit manual di Search Console.
 *
 * Cara pakai:
 *   node scripts/indexnow.js
 *
 * Key IndexNow disimpan sebagai file di root domain (public/<key>.txt),
 * itu yang dipakai IndexNow untuk verifikasi kepemilikan domain.
 */

const fs = require('fs')
const path = require('path')

const HOST = 'chups-portofolio.vercel.app'
const BASE = `https://${HOST}`
const KEY_FILE = path.join(__dirname, '..', 'public', 'c8bf15f6d5c0de5ba5d3655a87274a6e.txt')
const KEY = fs.readFileSync(KEY_FILE, 'utf8').trim()

const URL_LIST = [
  `${BASE}/`,
  `${BASE}/projects`,
  `${BASE}/pengalaman`,
  `${BASE}/sertifikasi`,
]

async function main() {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList: URL_LIST,
  }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-IndexNow-Key': KEY,
    },
    body: JSON.stringify(payload),
  })

  const body = await res.text().catch(() => '')
  console.log(`status=${res.status} ${body}`)

  // Verifikasi key bisa diakses publik (wajib untuk IndexNow)
  const keyRes = await fetch(`${BASE}/${KEY}.txt`, { cache: 'no-store' })
  const keyBody = (await keyRes.text().catch(() => '')).trim()
  console.log(`keyCheck=${keyRes.status} match=${keyBody === KEY}`)
}

main().catch((err) => {
  console.error('gagal:', err.message)
  process.exit(1)
})
