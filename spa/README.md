# Deploy SPA (React + Vite) di Supabase

Struktur ini tidak mengubah proyek Next.js kamu. SPA berada di folder `spa/`.

## 1) Persiapan Lokal

```
cd spa
npm i
npm run dev
```

Isi `.env` berdasarkan `.env.example`:

```
VITE_SUPABASE_URL= https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY= your-anon-key
```

## 2) Build

```
npm run build
```

Hasil build berada di `spa/dist`.

## 3) Upload ke Supabase Storage

- Buat bucket publik bernama `spa` di Supabase > Storage.
- Upload isi folder `spa/dist/` ke root bucket `spa` (index.html, assets/*, dll).

## 4) Edge Function: Serve SPA + Fallback

Folder: `supabase/functions/spa-serve/index.ts`

Deploy via Supabase CLI:

```
supabase functions deploy spa-serve --no-verify-jwt
```

Setelah deploy, function URL akan terlihat, misalnya:

```
https://YOUR-PROJECT-REF.functions.supabase.co/spa-serve
```

Arahkan domain (opsional) ke URL Edge Function di DNS/Reverse proxy.

## 5) Update Situs

- Ubah kode SPA di `spa/` → `npm run build` → upload ulang isi `dist/` ke bucket `spa`.
- Website langsung terbarui. Tidak perlu menyentuh Edge Function lagi kecuali ada perubahan fungsi.

## Catatan

- Pastikan `index.html` ada di bucket `spa`.
- Edge Function melakukan fallback ke `index.html` untuk semua route (SPA routing).
- Jika ingin caching agresif, atur header `cache-control` sesuai kebutuhan.
