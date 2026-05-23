-- Add image_urls column to projects table
-- Run this in Supabase SQL Editor

-- Add the column if it doesn't exist
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Update existing projects to have empty image_urls array
UPDATE projects 
SET image_urls = '{}' 
WHERE image_urls IS NULL;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'image_urls';
