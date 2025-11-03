# Portfolio Website

Website portofolio profesional yang dibangun dengan Next.js, TypeScript, Tailwind CSS, dan Supabase.

## 🚀 Fitur

- **Responsive Design** - Terlihat sempurna di semua perangkat
- **Modern UI** - Desain yang bersih dan profesional dengan Tailwind CSS
- **Database Integration** - Integrasi dengan Supabase untuk projects dan contact messages
- **Contact Form** - Form kontak yang terhubung langsung ke database
- **Projects Showcase** - Tampilkan portfolio projects Anda
- **Skills Section** - Showcase teknologi dan skill Anda
- **Dark Mode Ready** - Siap untuk dark mode

## 📋 Struktur Proyek

```
.
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Halaman utama
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── Hero.tsx            # Hero section
│   ├── About.tsx           # About section
│   ├── Projects.tsx        # Projects showcase
│   ├── Skills.tsx          # Skills section
│   ├── Contact.tsx         # Contact form
│   └── Footer.tsx          # Footer
├── lib/
│   └── supabase.ts         # Supabase client & types
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── supabase-schema.sql     # Database schema
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Jalankan SQL script dari `supabase-schema.sql` di Supabase SQL Editor
4. Copy credentials Anda:
   - Project URL
   - Anon Key

### 3. Environment Variables

Buat file `.env.local` dan isi dengan:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📝 Customization

### Update Personal Info

Edit file-file komponen untuk mengganti:
- Nama Anda di `components/Hero.tsx`
- Informasi kontak di `components/Contact.tsx`
- Social media links di semua komponen

### Add Projects

Tambahkan projects ke database Supabase melalui dashboard atau gunakan SQL:

```sql
INSERT INTO projects (title, description, image_url, demo_url, github_url, technologies)
VALUES (
  'Project Name',
  'Project Description',
  'image-url',
  'demo-url',
  'github-url',
  ARRAY['Tech1', 'Tech2']
);
```

### Customize Styling

Edit `tailwind.config.js` untuk mengubah warna dan tema:

```js
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
    },
  },
}
```

## 🚀 Deployment

### Deploy ke Vercel (Recommended)

1. Push code ke GitHub
2. Buka [Vercel](https://vercel.com)
3. Import project dari GitHub
4. Add environment variables
5. Deploy!

### Deploy ke Platform Lain

Bisa juga deploy ke:
- Netlify
- Railway
- Render
- AWS Amplify

## 📚 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)

## 📞 Support

Untuk bantuan lebih lanjut, lihat dokumentasi:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 📄 License

MIT License - Feel free to use this template!

