-- ==============================================================================
-- KR WEBSITE — SUPABASE DATABASE SETUP & RLS FIX SQL
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- URL: https://supabase.com/dashboard
-- ==============================================================================

-- 1. Table for Studioz Video Carousel (YouTube, Instagram Reels, MP4)
CREATE TABLE IF NOT EXISTS studioz_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Wedding Film',
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and add public write/read policies for studioz_videos
ALTER TABLE studioz_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read studioz_videos" ON studioz_videos;
CREATE POLICY "public read studioz_videos" ON studioz_videos FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow all studioz_videos" ON studioz_videos;
CREATE POLICY "allow all studioz_videos" ON studioz_videos FOR ALL USING (true) WITH CHECK (true);


-- 2. Table for Founder PDF Decks (Rajitha & Karthik)
CREATE TABLE IF NOT EXISTS founder_decks (
  id TEXT PRIMARY KEY,
  founder_name TEXT NOT NULL,
  founder_role TEXT NOT NULL,
  division TEXT NOT NULL,
  avatar_url TEXT,
  pdf_url TEXT,
  slides TEXT[],
  bio TEXT,
  display_order INT DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and add public write/read policies for founder_decks
ALTER TABLE founder_decks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read founder_decks" ON founder_decks;
CREATE POLICY "public read founder_decks" ON founder_decks FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow all founder_decks" ON founder_decks;
CREATE POLICY "allow all founder_decks" ON founder_decks FOR ALL USING (true) WITH CHECK (true);


-- 3. Insert initial sample videos if table is empty
INSERT INTO studioz_videos (title, category, thumbnail_url, video_url, display_order, is_active)
VALUES
  ('Grand Cinematic Wedding Story', 'Wedding Film', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, true),
  ('Pre-Wedding Love Story Highlights', 'Pre-Wedding', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=85', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2, true),
  ('Royal Reception Celebration Teaser', 'Reception', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 3, true);


-- 4. Insert initial deck data for Rajitha and Karthik
INSERT INTO founder_decks (id, founder_name, founder_role, division, avatar_url, pdf_url, bio, slides, display_order)
VALUES
  (
    'rajitha-deck',
    'Rajitha',
    'Founder & Creative Director (KR Studioz)',
    'studioz',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    '/docs/rajitha-studioz-portfolio.pdf',
    'Pioneer of high-end wedding cinematography and storytelling. Over 10+ years shaping unforgettable visual legacies across South India.',
    ARRAY[
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85'
    ],
    1
  ),
  (
    'karthik-deck',
    'Karthik',
    'Founder & Managing Director (KR Digital)',
    'marketing',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    '/docs/karthik-digital-marketing-deck.pdf',
    'Brand strategist & growth hacker driving multi-million reach for top business brands, influencers, and digital campaigns.',
    ARRAY[
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=85'
    ],
    2
  )
ON CONFLICT (id) DO NOTHING;
