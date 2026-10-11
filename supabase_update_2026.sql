-- ==============================================================================
-- KR DIGITAL MARKETING & STUDIOZ — 2026 SUPABASE TABLES UPDATE
-- Copy & Run this query in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- URL: https://supabase.com/dashboard/project/vdqajlvcaqudzzjsnntd/sql/new
-- ==============================================================================

-- 1. SITE SETTINGS (Used for Dynamic "Why Choose Us" & Global Config)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read site_settings" ON site_settings;
CREATE POLICY "public read site_settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "allow write site_settings" ON site_settings;
CREATE POLICY "allow write site_settings" ON site_settings FOR ALL USING (true);

-- 2. WEDDING PACKAGES (Hindu, Christian, Muslim Plans A, B, C)
CREATE TABLE IF NOT EXISTS wedding_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  religion TEXT NOT NULL,
  plan_code TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  tagline TEXT,
  badge TEXT,
  price TEXT NOT NULL,
  hero_image_url TEXT,
  photo_video_inclusions TEXT[],
  deliverables_inclusions TEXT[],
  gallery_urls TEXT[],
  is_popular BOOLEAN DEFAULT FALSE,
  is_ultra BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wedding_packages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read wedding_packages" ON wedding_packages;
CREATE POLICY "public read wedding_packages" ON wedding_packages FOR SELECT USING (true);
DROP POLICY IF EXISTS "allow write wedding_packages" ON wedding_packages;
CREATE POLICY "allow write wedding_packages" ON wedding_packages FOR ALL USING (true);

-- 3. FOUNDER DECKS (Rajitha & Karthik Portfolio Decks & Slides)
CREATE TABLE IF NOT EXISTS founder_decks (
  id TEXT PRIMARY KEY,
  founder_name TEXT NOT NULL,
  founder_role TEXT NOT NULL,
  division TEXT NOT NULL,
  avatar_url TEXT,
  pdf_url TEXT,
  slides TEXT[],
  bio TEXT,
  youtube_url TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  whatsapp_url TEXT,
  linkedin_url TEXT,
  social_links JSONB,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE founder_decks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read founder_decks" ON founder_decks;
CREATE POLICY "public read founder_decks" ON founder_decks FOR SELECT USING (true);
DROP POLICY IF EXISTS "allow write founder_decks" ON founder_decks;
CREATE POLICY "allow write founder_decks" ON founder_decks FOR ALL USING (true);

-- 4. STUDIOZ VIDEOS (Cinematic Films & Reels Carousel at Bottom)
CREATE TABLE IF NOT EXISTS studioz_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  category TEXT DEFAULT 'reels',
  thumbnail_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE studioz_videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read studioz_videos" ON studioz_videos;
CREATE POLICY "public read studioz_videos" ON studioz_videos FOR SELECT USING (true);
DROP POLICY IF EXISTS "allow write studioz_videos" ON studioz_videos;
CREATE POLICY "allow write studioz_videos" ON studioz_videos FOR ALL USING (true);
