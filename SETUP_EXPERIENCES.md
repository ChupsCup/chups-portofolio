# Setup Experiences Table

## Quick Start

Buka Supabase Dashboard → SQL Editor → New Query → Copy-paste SQL di bawah → Run

## SQL Setup

```sql
-- Drop existing table if it exists
DROP TABLE IF EXISTS public.experiences CASCADE;

-- Create table
CREATE TABLE public.experiences (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  technologies TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Disable RLS for now (can be enabled later with proper policies)
ALTER TABLE public.experiences DISABLE ROW LEVEL SECURITY;
```

## Langkah-Langkah Setup

1. **Buka Supabase Dashboard**
   - Pergi ke https://supabase.com
   - Login ke project Anda

2. **Buka SQL Editor**
   - Klik "SQL Editor" di sidebar kiri
   - Klik "New Query"

3. **Copy-Paste SQL**
   - Copy seluruh SQL di atas
   - Paste di SQL Editor

4. **Run Query**
   - Klik tombol "Run" atau tekan Ctrl+Enter
   - Tunggu sampai selesai

5. **Selesai!**
   - Refresh admin panel
   - Klik tab "💼 My Experience"
   - Mulai tambahkan experience Anda

## Checklist

- [ ] SQL query sudah di-run
- [ ] Tidak ada error di Supabase
- [ ] Admin panel sudah di-refresh
- [ ] Tab "💼 My Experience" sudah muncul

## Troubleshooting

### Error: "relation 'experiences' does not exist"
- Pastikan SQL sudah di-run di Supabase
- Refresh admin panel

### Error: "permission denied"
- Pastikan RLS policies sudah di-create
- Run SQL query lagi

### Tidak bisa upload experience
- Pastikan table sudah dibuat
- Check console browser untuk error message
- Refresh admin panel

## Fitur Experience

- ✅ Add experience baru
- ✅ Edit experience
- ✅ Delete experience
- ✅ Set "Currently working here"
- ✅ Add multiple technologies
- ✅ Auto-display di website

## Admin Panel

Akses admin panel di: http://localhost:3005/chupscupagent
Password: Samsungj7

Tab "💼 My Experience" untuk manage experiences.

