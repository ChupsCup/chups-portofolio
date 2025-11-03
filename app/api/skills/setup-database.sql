-- Reset existing tables
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS skill_categories;
DROP TABLE IF EXISTS soft_skills;

-- Create categories table
CREATE TABLE skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  efficiency INTEGER NOT NULL CHECK (efficiency >= 0 AND efficiency <= 100),
  type TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
  type TEXT NOT NULL,
  note TEXT,
  category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS soft_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE soft_skills ENABLE ROW LEVEL SECURITY;

-- Policies for reading data
CREATE POLICY "Enable read access for all users" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON skills FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON soft_skills FOR SELECT USING (true);

-- Sample data for skill categories
INSERT INTO skill_categories (title, efficiency) VALUES
('Frontend Development', 90),
('Backend Development', 85),
('DevOps & Infrastructure', 80);

-- Sample data for skills
INSERT INTO skills (name, level, type, category_id, note)
SELECT 'React.js', 90, 'frontend', id, 'Proficient in React hooks and modern patterns'
FROM skill_categories WHERE title = 'Frontend Development';

INSERT INTO skills (name, level, type, category_id, note)
SELECT 'Node.js', 85, 'backend', id, 'Expert in building scalable APIs'
FROM skill_categories WHERE title = 'Backend Development';

INSERT INTO skills (name, level, type, category_id, note)
SELECT 'Docker', 80, 'devops', id, 'Experienced in containerization'
FROM skill_categories WHERE title = 'DevOps & Infrastructure';

-- Sample data for soft skills
INSERT INTO soft_skills (name) VALUES
('Problem Solving'),
('Team Leadership'),
('Communication');