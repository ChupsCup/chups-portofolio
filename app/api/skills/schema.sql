-- Skills categories table
CREATE TABLE IF NOT EXISTS skill_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    efficiency INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL,
    type VARCHAR(50),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Soft skills table
CREATE TABLE IF NOT EXISTS soft_skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RLS Policies
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE soft_skills ENABLE ROW LEVEL SECURITY;

-- Allow read access for everyone
CREATE POLICY "Allow read access for all users" ON skill_categories
    FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON skills
    FOR SELECT USING (true);

CREATE POLICY "Allow read access for all users" ON soft_skills
    FOR SELECT USING (true);

-- Allow write access only for authenticated users
CREATE POLICY "Allow write access for authenticated users" ON skill_categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write access for authenticated users" ON skills
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write access for authenticated users" ON soft_skills
    FOR ALL USING (auth.role() = 'authenticated');