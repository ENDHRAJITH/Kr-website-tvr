-- ==============================================================================
-- KR WEBSITE — TOTAL DATA WIPE SCRIPT (CLEAR ALL TABLES FOR MANUAL TESTING)
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- URL: https://supabase.com/dashboard
-- ==============================================================================

-- 1. Ensure founder_decks table has all social link columns
CREATE TABLE IF NOT EXISTS founder_decks (
  id TEXT PRIMARY KEY,
  founder_name TEXT NOT NULL,
  founder_role TEXT NOT NULL,
  division TEXT NOT NULL,
  avatar_url TEXT,
  pdf_url TEXT,
  slides TEXT[],
  bio TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  whatsapp_url TEXT,
  linkedin_url TEXT,
  display_order INT DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE founder_decks ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE founder_decks ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE founder_decks ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE founder_decks ADD COLUMN IF NOT EXISTS whatsapp_url TEXT;
ALTER TABLE founder_decks ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

ALTER TABLE founder_decks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow all founder_decks" ON founder_decks;
CREATE POLICY "allow all founder_decks" ON founder_decks FOR ALL USING (true) WITH CHECK (true);

-- 2. Wipe/Clear ALL data from all tables completely
TRUNCATE TABLE 
  studioz_services, 
  marketing_services, 
  service_categories, 
  portfolio_items, 
  team_members, 
  testimonials, 
  client_logos, 
  site_stats, 
  enquiries, 
  enquiry_items, 
  studioz_videos, 
  founder_decks 
CASCADE;
