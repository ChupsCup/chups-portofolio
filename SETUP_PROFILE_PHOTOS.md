# Setup Profile Photos Database

Untuk menggunakan fitur CRUD foto profile di admin panel, Anda perlu membuat table dan bucket di Supabase.

## ⚡ QUICK START

1. Buka Supabase Dashboard: https://supabase.com
2. Pilih project Anda
3. Follow Step 1 dan Step 2 di bawah
4. Refresh admin panel - selesai!

## Step 1: Buat Table `profile_photos`

1. Di Supabase Dashboard, klik **"SQL Editor"** di sidebar kiri
2. Klik **"New Query"**
3. Copy dan paste SQL query berikut:

```sql
CREATE TABLE IF NOT EXISTS profile_photos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON profile_photos
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON profile_photos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON profile_photos
  FOR DELETE USING (true);
```

4. Klik **"Run"** untuk execute query
5. Tunggu sampai selesai (akan muncul "Success")

## Step 2: Buat Storage Bucket

1. Di Supabase Dashboard, klik **"Storage"** di sidebar kiri
2. Klik **"New bucket"**
3. Isi nama: `portfolio`
4. **PENTING**: Centang **"Public bucket"** ✓
5. Klik **"Create bucket"**

## Step 3: Setup Storage Policies (Optional)

Jika ingin lebih aman, setup policies:

1. Klik bucket **"portfolio"**
2. Klik tab **"Policies"**
3. Klik **"New policy"**
4. Pilih **"For INSERT"** → **"Get started with a template"** → **"Allow public uploads"**
5. Klik **"Review"** → **"Save policy"**

Ulangi untuk **DELETE** policy.

## Step 4: Test di Admin Panel

1. Buka http://localhost:3005/chupscupagent (atau port yang ditampilkan)
2. Masukkan password: `Samsungj7`
3. Klik tab **"👤 Profile Photo"**
4. Upload foto profile Anda!
5. Foto akan otomatis muncul di About section

## ✅ Checklist

- [ ] Table `profile_photos` sudah dibuat
- [ ] Bucket `portfolio` sudah dibuat
- [ ] Bucket di-set sebagai "Public bucket"
- [ ] Foto berhasil diupload di admin panel
- [ ] Foto muncul di About section

## 🆘 Troubleshooting

### Error: "Error uploading profile photo"
**Solusi:**
- Pastikan table `profile_photos` sudah dibuat (Step 1)
- Pastikan bucket `portfolio` sudah dibuat (Step 2)
- Pastikan bucket di-set sebagai "Public bucket"
- Refresh admin panel dan coba lagi

### Foto tidak muncul di About section
**Solusi:**
- Refresh halaman website
- Check browser console (F12) untuk error messages
- Pastikan foto sudah diupload di admin panel

### "Bucket not found" error
**Solusi:**
- Buka Supabase Dashboard → Storage
- Pastikan bucket `portfolio` ada
- Pastikan nama bucket tepat (lowercase): `portfolio`

