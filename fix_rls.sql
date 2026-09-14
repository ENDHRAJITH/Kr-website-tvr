-- ==============================================================================
-- KR WEBSITE — FIX ROW LEVEL SECURITY (RLS) ERRORS IN SUPABASE
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Fix RLS for studioz_videos
ALTER TABLE IF EXISTS studioz_videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read studioz_videos" ON studioz_videos;
DROP POLICY IF EXISTS "allow all studioz_videos" ON studioz_videos;
CREATE POLICY "allow all studioz_videos" ON studioz_videos FOR ALL USING (true) WITH CHECK (true);

-- 2. Fix RLS for founder_decks
ALTER TABLE IF EXISTS founder_decks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read founder_decks" ON founder_decks;
DROP POLICY IF EXISTS "allow all founder_decks" ON founder_decks;
CREATE POLICY "allow all founder_decks" ON founder_decks FOR ALL USING (true) WITH CHECK (true);

-- 3. Fix RLS for studioz_services
ALTER TABLE IF EXISTS studioz_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow all studioz_services" ON studioz_services;
CREATE POLICY "allow all studioz_services" ON studioz_services FOR ALL USING (true) WITH CHECK (true);

-- 4. Fix RLS for marketing_services
ALTER TABLE IF EXISTS marketing_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow all marketing_services" ON marketing_services;
CREATE POLICY "allow all marketing_services" ON marketing_services FOR ALL USING (true) WITH CHECK (true);

-- 5. Fix RLS for portfolio_items
ALTER TABLE IF EXISTS portfolio_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow all portfolio_items" ON portfolio_items;
CREATE POLICY "allow all portfolio_items" ON portfolio_items FOR ALL USING (true) WITH CHECK (true);
