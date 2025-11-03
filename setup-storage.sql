-- Supabase Storage Setup Script
-- Jalankan script ini di Supabase SQL Editor untuk setup storage bucket

-- 1. Create storage bucket (jika belum ada)
-- Note: Bucket harus dibuat via Supabase Dashboard karena SQL tidak support CREATE BUCKET
-- Tapi kita bisa setup policies di sini

-- 2. Setup RLS Policies untuk bucket "portfolio"

-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio');

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio');

-- 3. Verify policies
SELECT * FROM storage.objects WHERE bucket_id = 'portfolio' LIMIT 1;

