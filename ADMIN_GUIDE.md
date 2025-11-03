# 🔐 Admin Panel Guide

## Akses Admin Panel

### URL Rahasia:
```
http://localhost:3000/chupscupagent
```

### Password:
```
chupscupagent123
```

**PENTING:** 
- URL ini TIDAK ada di navbar
- Hanya bisa diakses dengan URL langsung
- Password akan diminta via JavaScript prompt saat pertama kali akses

---

## Fitur Admin Panel

### 1. **Create Project** ✨
- Isi form dengan data project baru
- Klik tombol "Create"
- Project akan langsung muncul di halaman utama

### 2. **Read Projects** 📖
- Lihat semua projects yang sudah dibuat
- Data diambil real-time dari Supabase

### 3. **Update Project** ✏️
- Klik tombol "Edit" pada project yang ingin diubah
- Form akan terisi dengan data project
- Ubah data sesuai kebutuhan
- Klik "Update" untuk menyimpan

### 4. **Delete Project** 🗑️
- Klik tombol "Delete" pada project
- Konfirmasi penghapusan
- Project akan dihapus dari database

---

## Form Fields

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|-----------|
| Title | Text | ✅ | Nama project |
| Description | Text Area | ✅ | Deskripsi project |
| Image URL | URL | ❌ | Link gambar project |
| Demo URL | URL | ❌ | Link demo/live project |
| GitHub URL | URL | ❌ | Link repository GitHub |
| Technologies | Text | ❌ | Teknologi (pisahkan dengan koma) |

### Contoh Technologies:
```
React, Next.js, TypeScript, Tailwind CSS
```

---

## Keamanan

⚠️ **CATATAN PENTING:**
- Password saat ini: `chupscupagent123` (GANTI SEBELUM DEPLOY!)
- URL `/chupscupagent` bersifat rahasia (obfuscation, bukan enkripsi)
- Untuk production, gunakan authentication yang lebih aman (Supabase Auth, NextAuth, dll)

---

## Troubleshooting

### Password tidak bekerja?
- Pastikan Anda mengetik password dengan benar
- Refresh halaman dan coba lagi

### Project tidak muncul di halaman utama?
- Refresh halaman utama (http://localhost:3000)
- Cek di Supabase dashboard apakah data sudah tersimpan

### Error saat create/update/delete?
- Cek console browser (F12 → Console)
- Pastikan Supabase credentials sudah benar di `.env.local`
- Cek Row Level Security (RLS) policies di Supabase

---

## Deployment

Sebelum deploy ke production:

1. **Ganti password** di file `app/chupscupagent/page.tsx` (line 31)
2. **Ganti URL** jika ingin lebih aman (misal: `/admin-xyz123`)
3. **Implementasikan authentication** yang lebih aman
4. **Aktifkan HTTPS** untuk enkripsi data

---

## Customization

### Mengubah Password:
Edit file `app/chupscupagent/page.tsx` baris 31:
```typescript
if (password === 'chupscupagent123') {  // Ganti password ini
```

### Mengubah URL Admin:
Rename folder `app/chupscupagent/` menjadi nama lain, misal `app/admin-secret/`

---

Selamat menggunakan Admin Panel! 🚀

