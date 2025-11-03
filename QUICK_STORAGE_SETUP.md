# ⚡ QUICK STORAGE SETUP - 5 MENIT

Panduan tercepat untuk setup Supabase Storage.

## 🎯 Tujuan
Membuat bucket "portfolio" agar fitur upload foto di admin panel berfungsi.

---

## 📋 Langkah-Langkah

### 1️⃣ Login Supabase Dashboard
- Buka: https://supabase.com
- Login dengan akun Anda
- Pilih project: **oemaqbrvwbosbinjrxei**

### 2️⃣ Buka Storage
- Di sidebar kiri, cari **"Storage"**
- Klik **"Storage"**

### 3️⃣ Buat Bucket Baru
- Klik tombol **"New bucket"** (warna biru)
- Muncul dialog, isi:
  - **Bucket name**: `portfolio` (HARUS SAMA PERSIS)
  - **Public bucket**: CENTANG ✅ (PENTING!)
- Klik **"Create bucket"**

### 4️⃣ Setup Policies (Pilih Salah Satu)

#### Opsi A: Via Dashboard (Mudah)
1. Klik bucket **"portfolio"**
2. Klik tab **"Policies"**
3. Klik **"New policy"**
4. Pilih template: **"For public access"**
5. Klik **"Review"** → **"Save policy"**

#### Opsi B: Via SQL (Cepat)
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

### 5️⃣ Test Upload
1. Buka: http://localhost:3004/chupscupagent
2. Masukkan password: `Samsungj7`
3. Di form, cari **"Upload Foto Project"**
4. Pilih file gambar (PNG, JPG, GIF, WebP)
5. Tunggu upload selesai
6. Seharusnya ada preview gambar ✅

---

## ✅ Selesai!

Jika berhasil, Anda bisa:
- ✅ Upload foto di admin panel
- ✅ Lihat preview foto
- ✅ Foto otomatis tersimpan di Supabase Storage
- ✅ Foto muncul di project list dengan thumbnail

---

## 🆘 Troubleshooting

### Error: "Error uploading image"
**Solusi:**
1. Pastikan bucket "portfolio" sudah dibuat
2. Pastikan bucket adalah "Public bucket" (centang ✅)
3. Pastikan policies sudah di-setup
4. Refresh halaman admin
5. Coba upload lagi

### Foto terupload tapi tidak muncul
**Solusi:**
1. Refresh halaman
2. Cek di Supabase Storage → portfolio folder
3. Pastikan file ada di sana

### Masih error?
1. Buka browser console: F12 → Console
2. Screenshot error message
3. Hubungi support atau cek dokumentasi Supabase

---

## 📚 Referensi
- Supabase Docs: https://supabase.com/docs/guides/storage
- Project URL: https://oemaqbrvwbosbinjrxei.supabase.co

Selamat! 🎉

