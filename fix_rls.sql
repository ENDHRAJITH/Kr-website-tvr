-- ==============================================================================
-- KR WEBSITE — FIX ROW LEVEL SECURITY (RLS) FOR ALL TABLES IN SUPABASE
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- URL: https://supabase.com/dashboard
-- ==============================================================================

-- 1. SERVICE CATEGORIES
ALTER TABLE IF EXISTS service_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON service_categories;
DROP POLICY IF EXISTS "admin write" ON service_categories;
DROP POLICY IF EXISTS "allow all service_categories" ON service_categories;
CREATE POLICY "allow all service_categories" ON service_categories FOR ALL USING (true) WITH CHECK (true);

-- 2. STUDIOZ SERVICES
ALTER TABLE IF EXISTS studioz_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON studioz_services;
DROP POLICY IF EXISTS "admin write" ON studioz_services;
DROP POLICY IF EXISTS "allow all studioz_services" ON studioz_services;
CREATE POLICY "allow all studioz_services" ON studioz_services FOR ALL USING (true) WITH CHECK (true);

-- 3. MARKETING SERVICES
ALTER TABLE IF EXISTS marketing_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON marketing_services;
DROP POLICY IF EXISTS "admin write" ON marketing_services;
DROP POLICY IF EXISTS "allow all marketing_services" ON marketing_services;
CREATE POLICY "allow all marketing_services" ON marketing_services FOR ALL USING (true) WITH CHECK (true);

-- 4. PORTFOLIO ITEMS
ALTER TABLE IF EXISTS portfolio_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON portfolio_items;
DROP POLICY IF EXISTS "admin write" ON portfolio_items;
DROP POLICY IF EXISTS "allow all portfolio_items" ON portfolio_items;
CREATE POLICY "allow all portfolio_items" ON portfolio_items FOR ALL USING (true) WITH CHECK (true);

-- 5. TEAM MEMBERS
ALTER TABLE IF EXISTS team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON team_members;
DROP POLICY IF EXISTS "admin write" ON team_members;
DROP POLICY IF EXISTS "allow all team_members" ON team_members;
CREATE POLICY "allow all team_members" ON team_members FOR ALL USING (true) WITH CHECK (true);

-- 6. TESTIMONIALS
ALTER TABLE IF EXISTS testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON testimonials;
DROP POLICY IF EXISTS "admin write" ON testimonials;
DROP POLICY IF EXISTS "allow all testimonials" ON testimonials;
CREATE POLICY "allow all testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);

-- 7. CLIENT LOGOS
ALTER TABLE IF EXISTS client_logos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON client_logos;
DROP POLICY IF EXISTS "admin write" ON client_logos;
DROP POLICY IF EXISTS "allow all client_logos" ON client_logos;
CREATE POLICY "allow all client_logos" ON client_logos FOR ALL USING (true) WITH CHECK (true);

-- 8. SITE STATS
ALTER TABLE IF EXISTS site_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON site_stats;
DROP POLICY IF EXISTS "admin write" ON site_stats;
DROP POLICY IF EXISTS "allow all site_stats" ON site_stats;
CREATE POLICY "allow all site_stats" ON site_stats FOR ALL USING (true) WITH CHECK (true);

-- 9. ENQUIRIES
ALTER TABLE IF EXISTS enquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public insert enquiry" ON enquiries;
DROP POLICY IF EXISTS "admin read enquiry" ON enquiries;
DROP POLICY IF EXISTS "admin update enquiry" ON enquiries;
DROP POLICY IF EXISTS "allow all enquiries" ON enquiries;
CREATE POLICY "allow all enquiries" ON enquiries FOR ALL USING (true) WITH CHECK (true);

-- 10. ENQUIRY ITEMS
ALTER TABLE IF EXISTS enquiry_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public insert enquiry item" ON enquiry_items;
DROP POLICY IF EXISTS "admin read enquiry item" ON enquiry_items;
DROP POLICY IF EXISTS "allow all enquiry_items" ON enquiry_items;
CREATE POLICY "allow all enquiry_items" ON enquiry_items FOR ALL USING (true) WITH CHECK (true);

-- 11. STUDIOZ VIDEOS
ALTER TABLE IF EXISTS studioz_videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read studioz_videos" ON studioz_videos;
DROP POLICY IF EXISTS "allow all studioz_videos" ON studioz_videos;
CREATE POLICY "allow all studioz_videos" ON studioz_videos FOR ALL USING (true) WITH CHECK (true);

-- 12. FOUNDER DECKS
ALTER TABLE IF EXISTS founder_decks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read founder_decks" ON founder_decks;
DROP POLICY IF EXISTS "allow all founder_decks" ON founder_decks;
CREATE POLICY "allow all founder_decks" ON founder_decks FOR ALL USING (true) WITH CHECK (true);



