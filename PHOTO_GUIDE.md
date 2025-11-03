# 📸 Panduan Mengganti Foto Portfolio

## Lokasi Foto

Foto Anda ditampilkan di 2 tempat:

1. **Hero Section** (Halaman Utama) - `components/Hero.tsx`
2. **About Section** - `components/About.tsx`

---

## Cara Mengganti Foto

### Opsi 1: Menggunakan URL Foto Online (Paling Mudah)

1. Siapkan foto Anda di platform hosting (Unsplash, Pexels, Imgur, dll)
2. Copy URL foto tersebut
3. Edit file `components/Hero.tsx` dan `components/About.tsx`
4. Ganti URL di bagian ini:

**Hero.tsx (baris ~85):**
```typescript
<Image
  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
  alt="Profile Photo"
  fill
  className="object-cover"
  priority
/>
```

**About.tsx (baris ~65):**
```typescript
<Image
  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
  alt="Profile Photo"
  fill
  className="object-cover"
/>
```

Ganti URL yang ada dengan URL foto Anda.

---

### Opsi 2: Upload Foto Lokal (Lebih Aman)

1. Buat folder `public/images/` di root project
2. Upload foto Anda ke folder tersebut (misal: `profile.jpg`)
3. Edit `components/Hero.tsx` dan `components/About.tsx`
4. Ganti URL menjadi:

```typescript
<Image
  src="/images/profile.jpg"
  alt="Profile Photo"
  fill
  className="object-cover"
  priority
/>
```

---

## Rekomendasi Foto

✅ **Foto yang Bagus:**
- Ukuran: Minimal 500x500px (square)
- Format: JPG, PNG, atau WebP
- Kualitas: HD/High Resolution
- Jenis: Portrait atau headshot profesional
- Background: Solid atau blur (tidak terlalu ramai)

❌ **Hindari:**
- Foto terlalu kecil (< 300px)
- Foto dengan background terlalu kompleks
- Foto dengan watermark
- Foto yang terlalu gelap atau terang

---

## Contoh Sumber Foto Gratis

- **Unsplash**: https://unsplash.com
- **Pexels**: https://pexels.com
- **Pixabay**: https://pixabay.com
- **Freepik**: https://freepik.com

---

## Troubleshooting

### Foto tidak muncul?
- Pastikan URL foto benar
- Cek console browser (F12 → Console) untuk error
- Refresh halaman (Ctrl+F5)

### Foto terlihat blur/pixelated?
- Gunakan foto dengan resolusi lebih tinggi
- Minimal 500x500px untuk hasil terbaik

### Foto tidak square?
- Gunakan foto dengan aspect ratio 1:1 (square)
- Atau crop foto Anda menjadi square terlebih dahulu

---

## Customization Lanjutan

### Mengubah Ukuran Foto

Edit di `components/Hero.tsx` (baris ~78):
```typescript
<div className="relative w-80 h-80 md:w-96 md:h-96">
```

- `w-80 h-80` = ukuran mobile (320px)
- `md:w-96 md:h-96` = ukuran desktop (384px)

Ubah angka untuk mengubah ukuran.

### Mengubah Border Radius (Sudut Foto)

Edit di `components/Hero.tsx` (baris ~84):
```typescript
<div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
```

- `rounded-3xl` = sudut yang sangat rounded
- Ubah menjadi `rounded-2xl`, `rounded-lg`, atau `rounded-none` untuk efek berbeda

---

Selamat mengganti foto! 📸

