# Setup Supabase Storage untuk Upload Foto

Panduan untuk setup Supabase Storage bucket agar fitur upload foto di admin panel berfungsi.

## ⚡ QUICK SETUP (3 Langkah)

### Step 1: Buka Supabase Dashboard

1. Login ke [supabase.com](https://supabase.com)
2. Pilih project Anda
3. Di sidebar kiri, klik **"Storage"**

### Step 2: Buat Bucket "portfolio"

1. Klik **"New bucket"** atau **"Create a new bucket"**
2. Isi nama: **`portfolio`** (PENTING: harus sama persis)
3. **CENTANG "Public bucket"** ✅
4. Klik **"Create bucket"**

### Step 3: Setup RLS Policies

1. Klik bucket **"portfolio"**
2. Klik tab **"Policies"**
3. Klik **"New policy"**
4. Pilih **"For public access"** template
5. Klik **"Review"** → **"Save policy"**

**ATAU** gunakan SQL (lebih cepat):

1. Di sidebar, klik **"SQL Editor"**
2. Klik **"New query"**
3. Copy-paste dari file `setup-storage.sql`
4. Klik **"Run"**

---

## ✅ Selesai!

Sekarang Anda bisa upload foto di admin panel! 🎉

## 4. Test Upload

1. Buka admin panel: `http://localhost:3004/chupscupagent`
2. Masukkan password: `Samsungj7`
3. Di form "Add New Project", cari section "Upload Foto Project"
4. Pilih file gambar (PNG, JPG, GIF, WebP)
5. Tunggu sampai upload selesai
6. Seharusnya ada preview gambar dan URL otomatis terisi

## 5. Troubleshooting

### Error: "Error uploading image"

**Solusi:**
- Pastikan bucket "portfolio" sudah dibuat
- Pastikan RLS policy sudah di-setup
- Cek di browser console (F12 → Console) untuk error detail
- Pastikan file size < 5MB
- Pastikan format file adalah PNG, JPG, GIF, atau WebP

### Foto tidak muncul di preview

**Solusi:**
- Pastikan bucket adalah "Public bucket"
- Refresh halaman
- Cek di Supabase Storage apakah file sudah terupload

### Foto terupload tapi URL tidak terisi

**Solusi:**
- Cek di browser console untuk error
- Pastikan Supabase credentials di `.env.local` benar
- Restart dev server

## 6. Fitur Upload

Admin panel sekarang memiliki fitur:

✅ **Upload Foto**
- Support format: PNG, JPG, GIF, WebP
- Max size: 5MB
- Auto preview sebelum save

✅ **CRUD Projects**
- Create: Tambah project baru dengan foto
- Read: Lihat semua projects dengan preview foto
- Update: Edit project dan ganti foto
- Delete: Hapus project

✅ **Foto Preview**
- Di form: Preview foto sebelum save
- Di list: Thumbnail foto di setiap project

## 7. Tips

1. **Backup**: Supabase otomatis backup, tapi Anda bisa export data
2. **Cleanup**: Hapus foto lama di Storage jika sudah tidak dipakai
3. **Naming**: Foto otomatis diberi nama dengan timestamp untuk menghindari duplikat
4. **Security**: Jangan share credentials Anda

---

Selamat! Storage sudah siap untuk upload foto! 🎉

