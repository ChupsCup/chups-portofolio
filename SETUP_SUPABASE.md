# Setup Supabase untuk Portfolio Website

Panduan lengkap untuk setup Supabase database.

## 1. Buat Akun Supabase

1. Kunjungi [supabase.com](https://supabase.com)
2. Klik "Sign Up"
3. Daftar dengan email atau GitHub
4. Verifikasi email Anda

## 2. Buat Project Baru

1. Setelah login, klik "New Project"
2. Isi form:
   - **Name**: Portfolio (atau nama pilihan Anda)
   - **Database Password**: Buat password yang kuat
   - **Region**: Pilih region terdekat dengan lokasi Anda
3. Klik "Create new project"
4. Tunggu project selesai dibuat (biasanya 1-2 menit)

## 3. Setup Database Schema

1. Di dashboard Supabase, buka "SQL Editor"
2. Klik "New Query"
3. Copy-paste seluruh isi dari file `supabase-schema.sql`
4. Klik "Run" atau tekan Ctrl+Enter
5. Tunggu sampai selesai

## 4. Dapatkan Credentials

1. Buka "Settings" → "API"
2. Copy:
   - **Project URL** (di bagian "Project URL")
   - **Anon Key** (di bagian "Project API keys" → "anon public")

## 5. Setup Environment Variables

1. Buka file `.env.local` di root project
2. Isi dengan credentials Anda:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Simpan file

## 6. Verifikasi Setup

1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Buka [http://localhost:3000](http://localhost:3000)

3. Scroll ke section "Projects" - seharusnya menampilkan 4 demo projects

4. Scroll ke section "Contact" - coba kirim test message

5. Kembali ke Supabase dashboard → "Table Editor" → "contact_messages"
   - Seharusnya ada message yang Anda kirim

## 7. Tambah Projects Sendiri

### Via Supabase Dashboard:

1. Buka "Table Editor"
2. Klik table "projects"
3. Klik "Insert row"
4. Isi data:
   - **title**: Nama project
   - **description**: Deskripsi singkat
   - **image_url**: URL gambar (optional)
   - **demo_url**: Link demo (optional)
   - **github_url**: Link GitHub (optional)
   - **technologies**: Array teknologi, contoh: `["React", "Node.js"]`

### Via SQL Query:

```sql
INSERT INTO projects (title, description, image_url, demo_url, github_url, technologies)
VALUES (
  'My Awesome App',
  'Aplikasi yang luar biasa dengan fitur-fitur keren',
  'https://example.com/image.jpg',
  'https://my-app.com',
  'https://github.com/username/my-app',
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase']
);
```

## 8. Row Level Security (RLS)

Database sudah dikonfigurasi dengan RLS:
- **projects**: Semua orang bisa membaca
- **contact_messages**: Semua orang bisa mengirim pesan

Untuk production, Anda mungkin ingin:
- Membatasi siapa yang bisa edit projects
- Menambahkan rate limiting untuk contact form
- Menambahkan email notification

## 9. Troubleshooting

### Error: "Failed to fetch projects"

- Pastikan `.env.local` sudah benar
- Restart development server
- Cek di browser console untuk error detail

### Contact form tidak berfungsi

- Pastikan table `contact_messages` sudah dibuat
- Cek RLS policy di Supabase dashboard
- Lihat browser console untuk error

### Projects tidak muncul

- Pastikan ada data di table `projects`
- Cek di Supabase "Table Editor" → "projects"
- Pastikan format `technologies` adalah array

## 10. Tips & Best Practices

1. **Backup Regular**: Supabase otomatis backup, tapi Anda bisa export data
2. **Monitor Usage**: Cek "Usage" di dashboard untuk quota
3. **Security**: Jangan share credentials Anda
4. **Testing**: Test contact form sebelum production
5. **Scaling**: Supabase gratis untuk project kecil, upgrade jika perlu

## Referensi

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

Selamat! Database Anda sudah siap! 🎉

