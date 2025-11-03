# 📸 SETUP UPLOAD FOTO - PANDUAN LENGKAP

Admin panel sudah siap dengan fitur upload foto! Ikuti langkah-langkah di bawah untuk setup.

---

## 🎯 LANGKAH 1: Buat Bucket di Supabase (2 MENIT)

Silakan ikuti file: **`MANUAL_BUCKET_SETUP.md`**

Ringkas:
1. Buka https://supabase.com
2. Login & pilih project
3. Storage → New bucket
4. Nama: `portfolio` (HARUS SAMA)
5. Centang "Public bucket" ✅
6. Create
7. Setup RLS Policies (lihat file untuk SQL)

---

## 🎯 LANGKAH 2: Test di Admin Panel

1. Buka: http://localhost:3004/chupscupagent
2. Masukkan password: `Samsungj7`
3. Klik button **"⚙️ Setup Storage"** (untuk verify bucket)
4. Seharusnya muncul pesan: **"✅ Bucket 'portfolio' sudah ada!"**

---

## 🎯 LANGKAH 3: Upload Foto

1. Di form "Add New Project", cari section **"Upload Foto Project"**
2. Klik input file
3. Pilih gambar (PNG, JPG, GIF, WebP)
4. Tunggu upload selesai
5. Seharusnya ada preview gambar
6. Isi form lainnya (title, description, dll)
7. Klik **"Add Project"**

---

## ✅ FITUR YANG SUDAH SIAP

### Upload Foto
- ✅ Support: PNG, JPG, GIF, WebP
- ✅ Max size: 5MB
- ✅ Auto preview sebelum save
- ✅ Foto otomatis tersimpan di Supabase Storage

### CRUD Projects
- ✅ **Create**: Tambah project baru dengan foto
- ✅ **Read**: Lihat semua projects dengan thumbnail
- ✅ **Update**: Edit project dan ganti foto
- ✅ **Delete**: Hapus project

### Admin Panel
- ✅ Password protection: `Samsungj7`
- ✅ Setup Storage button untuk verify bucket
- ✅ Form untuk tambah/edit project
- ✅ Project list dengan thumbnail foto

---

## 🆘 TROUBLESHOOTING

### Error: "Error uploading image"
**Solusi:**
1. Pastikan bucket "portfolio" sudah dibuat
2. Pastikan bucket adalah "Public bucket"
3. Pastikan RLS policies sudah di-setup
4. Refresh halaman admin
5. Coba upload lagi

### Foto terupload tapi tidak muncul
**Solusi:**
1. Refresh halaman
2. Cek di Supabase Storage → portfolio folder
3. Pastikan file ada di sana

### Button "Setup Storage" tidak berfungsi
**Solusi:**
1. Pastikan Anda sudah login ke admin panel
2. Buka browser console: F12 → Console
3. Lihat error message
4. Cek apakah bucket "portfolio" sudah ada di Supabase

### Masih error?
1. Buka browser console: F12 → Console
2. Screenshot error message
3. Cek dokumentasi Supabase: https://supabase.com/docs/guides/storage

---

## 📚 FILE REFERENSI

- **MANUAL_BUCKET_SETUP.md** - Panduan setup bucket di Supabase
- **QUICK_STORAGE_SETUP.md** - Quick setup guide
- **SETUP_STORAGE.md** - Detailed setup guide

---

## 🚀 NEXT STEPS

Setelah upload foto berfungsi:
1. Upload beberapa project dengan foto
2. Test edit dan delete
3. Customize form sesuai kebutuhan
4. Deploy ke production

---

Selamat! 🎉 Admin panel dengan upload foto sudah siap!

