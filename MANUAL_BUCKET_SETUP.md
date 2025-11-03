# 🚀 SETUP BUCKET MANUAL - 2 MENIT

Karena service role key tidak bisa digunakan untuk create bucket via API, silakan buat bucket secara manual di Supabase Dashboard.

## ⚡ Langkah-Langkah (SANGAT MUDAH)

### 1. Buka Supabase Dashboard
- URL: https://supabase.com
- Login dengan akun Anda

### 2. Pilih Project
- Cari project: **oemaqbrvwbosbinjrxei**
- Klik untuk membuka

### 3. Buka Storage
- Di sidebar kiri, cari **"Storage"**
- Klik **"Storage"**

### 4. Buat Bucket Baru
- Klik tombol **"New bucket"** (warna biru di atas)
- Muncul dialog, isi:
  - **Bucket name**: `portfolio` (HARUS SAMA PERSIS)
  - **Public bucket**: CENTANG ✅ (SANGAT PENTING!)
- Klik **"Create bucket"**

### 5. Setup RLS Policies
Setelah bucket dibuat, setup policies agar bisa upload:

1. Klik bucket **"portfolio"**
2. Klik tab **"Policies"**
3. Klik **"New policy"**
4. Pilih template: **"For public access"**
5. Klik **"Review"** → **"Save policy"**

**ATAU** gunakan SQL (lebih cepat):
1. Di sidebar, klik **"SQL Editor"**
2. Klik **"New query"**
3. Copy-paste kode di bawah:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Allow updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio');

CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio');
```

4. Klik **"Run"** (atau Ctrl+Enter)

---

## ✅ Selesai!

Sekarang Anda bisa:
1. Buka admin panel: http://localhost:3004/chupscupagent
2. Masukkan password: `Samsungj7`
3. Klik button **"⚙️ Setup Storage"** untuk verify bucket
4. Upload foto di form!

---

## 🎯 Fitur Upload Foto

Setelah bucket siap, Anda bisa:
- ✅ Upload PNG, JPG, GIF, WebP
- ✅ Max size: 5MB
- ✅ Auto preview sebelum save
- ✅ Foto otomatis tersimpan di Supabase Storage
- ✅ Thumbnail muncul di project list

---

## 🆘 Troubleshooting

### Bucket tidak muncul di list
- Refresh halaman
- Pastikan Anda di project yang benar

### Error saat upload
- Pastikan bucket "portfolio" adalah "Public bucket"
- Pastikan policies sudah di-setup
- Refresh halaman admin

### Masih error?
- Buka browser console: F12 → Console
- Screenshot error message
- Cek Supabase Storage apakah file sudah terupload

---

Selamat! 🎉

