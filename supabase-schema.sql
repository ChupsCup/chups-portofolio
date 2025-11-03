-- Schema untuk database Supabase
-- Jalankan script ini di Supabase SQL Editor

-- Tabel untuk menyimpan projects
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabel untuk menyimpan contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy untuk projects - semua orang bisa membaca
CREATE POLICY "Enable read access for all users" ON projects
  FOR SELECT USING (true);

-- Policy untuk contact_messages - semua orang bisa insert
CREATE POLICY "Enable insert for all users" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Insert sample data untuk projects
INSERT INTO projects (title, description, image_url, demo_url, github_url, technologies) VALUES
  (
    'E-Commerce Platform',
    'A full-featured e-commerce platform with cart, checkout, and payment integration.',
    '',
    'https://example.com',
    'https://github.com',
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe']
  ),
  (
    'Task Management App',
    'A collaborative task management application with real-time updates.',
    '',
    'https://example.com',
    'https://github.com',
    ARRAY['React', 'Firebase', 'Material-UI']
  ),
  (
    'Weather Dashboard',
    'A beautiful weather dashboard with forecasts and interactive maps.',
    '',
    'https://example.com',
    'https://github.com',
    ARRAY['Vue.js', 'OpenWeather API', 'Chart.js']
  ),
  (
    'Portfolio Website',
    'A modern portfolio website built with Next.js and Supabase.',
    '',
    'https://example.com',
    'https://github.com',
    ARRAY['Next.js', 'Supabase', 'Tailwind CSS', 'TypeScript']
  );

