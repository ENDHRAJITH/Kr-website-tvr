-- ==============================================================================
-- KR DIGITAL MARKETING & STUDIOZ — MASTER DATABASE SETUP & SEED SQL
-- Copy and run this whole script in:
-- Supabase Dashboard -> SQL Editor -> New Query -> Run
-- URL: https://supabase.com/dashboard
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CREATE TABLES (IF NOT EXIST)
-- ------------------------------------------------------------------------------

-- 1.1 Service Categories
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  division TEXT NOT NULL CHECK (division IN ('studioz', 'marketing')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Studioz Services
CREATE TABLE IF NOT EXISTS studioz_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_no INT,
  name TEXT NOT NULL,
  category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  label TEXT,
  price TEXT,
  description TEXT,
  icon TEXT,
  hero_image_url TEXT,
  cover_points TEXT[],
  gallery_urls TEXT[],
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 Marketing Services
CREATE TABLE IF NOT EXISTS marketing_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_no INT,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price TEXT,
  price_unit TEXT,
  features TEXT[],
  benefits TEXT[],
  project_tag TEXT,
  category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  links JSONB,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 Portfolio Items
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('studioz', 'digital')),
  cover_image_url TEXT,
  gallery_urls TEXT[],
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.5 Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  photo_url TEXT,
  bio TEXT,
  social_links JSONB,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.6 Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.7 Client Logos
CREATE TABLE IF NOT EXISTS client_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  link TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.8 Site Stats
CREATE TABLE IF NOT EXISTS site_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.9 Enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.10 Enquiry Items
CREATE TABLE IF NOT EXISTS enquiry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID REFERENCES enquiries(id) ON DELETE CASCADE,
  service_division TEXT CHECK (service_division IN ('studioz', 'marketing')),
  service_id UUID,
  service_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.11 Studioz Videos Carousel
CREATE TABLE IF NOT EXISTS studioz_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Wedding Film',
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.12 Founder Pitch Decks (Rajitha & Karthik)
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
  display_order INT DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all optional social columns exist in founder_decks
ALTER TABLE founder_decks ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE founder_decks ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE founder_decks ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE founder_decks ADD COLUMN IF NOT EXISTS whatsapp_url TEXT;
ALTER TABLE founder_decks ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- ------------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) POLICIES — ALLOW ALL READ / WRITE ACCESS
-- ------------------------------------------------------------------------------

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE studioz_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE studioz_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_decks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all service_categories" ON service_categories;
CREATE POLICY "allow all service_categories" ON service_categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow all studioz_services" ON studioz_services;
CREATE POLICY "allow all studioz_services" ON studioz_services FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow all marketing_services" ON marketing_services;
CREATE POLICY "allow all marketing_services" ON marketing_services FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow all portfolio_items" ON portfolio_items;
CREATE POLICY "allow all portfolio_items" ON portfolio_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow all team_members" ON team_members;
CREATE POLICY "allow all team_members" ON team_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow all testimonials" ON testimonials;
CREATE POLICY "allow all testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow all client_logos" ON client_logos;
CREATE POLICY "allow all client_logos" ON client_logos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow all site_stats" ON site_stats;
CREATE POLICY "allow all site_stats" ON site_stats FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow all enquiries" ON enquiries;
CREATE POLICY "allow all enquiries" ON enquiries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow all enquiry_items" ON enquiry_items;
CREATE POLICY "allow all enquiry_items" ON enquiry_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow all studioz_videos" ON studioz_videos;
CREATE POLICY "allow all studioz_videos" ON studioz_videos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow all founder_decks" ON founder_decks;
CREATE POLICY "allow all founder_decks" ON founder_decks FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 3. TRUNCATE OLD TEST DATA (CLEAN RESET)
-- ------------------------------------------------------------------------------

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

-- ------------------------------------------------------------------------------
-- 4. SEED STARTER DATA
-- ------------------------------------------------------------------------------

-- 4.1 Service Categories
INSERT INTO service_categories (id, division, name, slug, display_order) VALUES
  ('11111111-1111-4111-a111-111111111111', 'studioz', 'Weddings & Ceremonies', 'weddings', 1),
  ('22222222-2222-4222-a222-222222222222', 'studioz', 'Pre-Wedding & Couples', 'pre-wedding', 2),
  ('33333333-3333-4333-a333-333333333333', 'studioz', 'Baby & Maternity', 'baby-maternity', 3),
  ('44444444-4444-4444-a444-444444444444', 'studioz', 'Events & Corporate', 'events', 4),
  ('55555555-5555-4555-a555-555555555555', 'marketing', 'Search & Advertising', 'search-ads', 1),
  ('66666666-6666-4666-a666-666666666666', 'marketing', 'Social Media & Growth', 'social-growth', 2),
  ('77777777-7777-4777-a777-777777777777', 'marketing', 'Branding & Strategy', 'branding', 3);

-- 4.2 Studioz Services (5 Photography & Film Services)
INSERT INTO studioz_services (
  service_no, name, category_id, label, price, description, hero_image_url, cover_points, gallery_urls, display_order, is_active
) VALUES
(
  1,
  'Grand Wedding Photography & Films',
  '11111111-1111-4111-a111-111111111111',
  'Most Popular',
  '₹75,000 onwards',
  'Complete wedding coverage by Founder Rajitha and team. Traditional photography, candid emotions, 4K cinematic teasers, and luxury photo albums.',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
  ARRAY['Candid & Traditional Coverage', '4K Cinematic Highlight Trailer', 'Drone Aerial Shots', 'Luxury Synthetic Album (40 Pages)', 'Raw File Delivery'],
  ARRAY['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85'],
  1,
  true
),
(
  2,
  'Cinematic Pre-Wedding Shoot',
  '22222222-2222-4222-a222-222222222222',
  'Trending',
  '₹35,000 onwards',
  'Outdoor destination pre-wedding concept shoots, romantic love story teasers, high-res portraits, and custom concept styling.',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=85',
  ARRAY['Full Day Outdoor Location Shoot', '3 Outfit Outfit Changes', '4K Romantic Reel Teaser (60s)', '30 Retouched High-Res Photos'],
  ARRAY['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85'],
  2,
  true
),
(
  3,
  'Traditional Ceremonies & Function Shoot',
  '11111111-1111-4111-a111-111111111111',
  'Ceremonial Package',
  '₹45,000 onwards',
  'Engagement, Sangeet, Haldi, Nikkah, and Reception ceremony coverage with vibrant candid photos and full ceremony event film.',
  'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1600&q=85',
  ARRAY['Full Ceremony Photography', 'HD Event Video Coverage', 'Family Group Portraits', 'Digital Photo Drive'],
  ARRAY['https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85'],
  3,
  true
),
(
  4,
  'Baby Milestone & Maternity Portraits',
  '33333333-3333-4333-a333-333333333333',
  'Family Special',
  '₹25,000 onwards',
  'Creative themed baby shoots, newborn milestone portraits, and gentle maternity shoot setups with safe studio lighting.',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=85',
  ARRAY['Theme Studio Setup & Costumes', 'Gentle Baby-Friendly Lighting', '20 Edited Digital Photos'],
  ARRAY['https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85'],
  4,
  true
),
(
  5,
  'Corporate & Commercial Video Production',
  '44444444-4444-4444-a444-444444444444',
  'Business Package',
  '₹60,000 onwards',
  'High-impact corporate brand film, product commercial shoots, live event broadcasting, and promotional video reels.',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85',
  ARRAY['Brand Story Video (2-3 Mins)', 'Social Media Reel Edits', 'Voiceover & Professional Audio'],
  ARRAY['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85'],
  5,
  true
);

-- 4.3 Marketing Services (5 Digital Marketing Services)
INSERT INTO marketing_services (
  service_no, name, category_id, subtitle, description, price, price_unit, features, benefits, project_tag, display_order, is_active
) VALUES
(
  1,
  'Search Engine Optimization (SEO)',
  '55555555-5555-4555-a555-555555555555',
  'Rank #1 on Google for Local & National Keywords',
  'Comprehensive technical SEO, keyword research, content optimization, and high-quality backlink building to drive organic leads.',
  '₹25,000',
  '/ month',
  ARRAY['Technical SEO Audit', 'Keyword Optimization & Research', 'Google My Business Setup', 'Monthly Ranking Reports'],
  ARRAY['Consistent Organic Customer Inquiries', 'Zero Per-Click Ad Cost', 'Long-term Brand Authority'],
  'SEO Growth',
  1,
  true
),
(
  2,
  'Google Ads & Performance PPC',
  '55555555-5555-4555-a555-555555555555',
  'Instant Qualified Customer Leads via Search Ads',
  'Target high-intent buyers ready to purchase. High conversion landing page copy, negative keyword filtering, and A/B testing.',
  '₹35,000',
  '/ month',
  ARRAY['High-Intent Keyword Bidding', 'Conversion Landing Page Copy', 'Call Tracking & Lead Capture', 'ROAS Optimization'],
  ARRAY['Instant Inquiries from Day 1', 'Trackable Return on Ad Spend', 'Scalable Lead Pipeline'],
  'PPC Lead Gen',
  2,
  true
),
(
  3,
  'Social Media Growth & Reel Marketing',
  '66666666-6666-4666-a666-666666666666',
  'Build Loyal Audience & Viral Video Reach',
  'End-to-end Instagram and YouTube content management. Viral reel creation, brand aesthetics, community management, and growth strategies.',
  '₹30,000',
  '/ month',
  ARRAY['12 HD Custom Reels per Month', 'Graphic Posts & Carousels', 'Caption Copywriting & Hashtags', 'Community Engagement'],
  ARRAY['Multiplies Social Following', 'Establishes Brand Trust', 'Drives Direct DM Inquiries'],
  'Social Growth',
  3,
  true
),
(
  4,
  'Meta & Instagram Ad Campaigns',
  '66666666-6666-4666-a666-666666666666',
  'Targeted Audience Lead Generation & Sales',
  'Data-driven Meta ad campaigns targeting your ideal customer demographics, interests, and remarketing audiences.',
  '₹28,000',
  '/ month',
  ARRAY['Audience Demographic Targeting', 'High-Converting Video Ad Creatives', 'Retargeting Funnel Setup', 'Daily Ad Budget Management'],
  ARRAY['Low Cost-Per-Lead (CPL)', 'High Engagement Rates', 'Instant Campaign Scalability'],
  'Meta Ads',
  4,
  true
),
(
  5,
  'Complete Brand Identity & Website Overhaul',
  '77777777-7777-4777-a777-777777777777',
  'Premium Logo, Brand Guidelines & Custom Web App',
  'Full brand architecture makeover including logo design, color palette guidelines, typography, stationery, and Next.js website.',
  '₹85,000',
  '/ project',
  ARRAY['Custom Logo & Vector Assets', 'Brand Guideline Playbook', 'Responsive Next.js Web App', 'Domain & SEO Integration'],
  ARRAY['Stand Out from Competitors', 'Instant Premium Brand Perception', 'High Conversion User Experience'],
  'Brand Strategy',
  5,
  true
);

-- 4.4 Founder Pitch Decks
INSERT INTO founder_decks (
  id, founder_name, founder_role, division, avatar_url, pdf_url, bio, youtube_url, instagram_url, facebook_url, whatsapp_url, linkedin_url, slides, display_order
) VALUES
  (
    'rajitha-deck',
    'Rajitha',
    'Founder & Creative Director (KR Studioz)',
    'studioz',
    '/rajitha.png',
    '/docs/rajitha-studioz-portfolio.pdf',
    'Pioneer of high-end wedding cinematography and storytelling.',
    'https://youtube.com/@krstudioz',
    'https://instagram.com/krstudioz',
    'https://facebook.com/krstudioz',
    'https://wa.me/919626759859',
    'https://linkedin.com',
    ARRAY[]::TEXT[],
    1
  ),
  (
    'karthik-deck',
    'Karthik',
    'Founder & Managing Director (KR Digital)',
    'marketing',
    '/karthik.png',
    '/docs/karthik-digital-marketing-deck.pdf',
    'Brand strategist & growth hacker driving multi-million reach.',
    'https://youtube.com/@krdigital',
    'https://instagram.com/krdigital',
    'https://facebook.com/krdigital',
    'https://wa.me/919626759859',
    'https://linkedin.com',
    ARRAY[]::TEXT[],
    2
  );

-- 4.5 Team Members
INSERT INTO team_members (name, role, photo_url, bio, display_order) VALUES
  (
    'KARTHIK',
    'Founder — KR Digital Marketing',
    '/karthik.png',
    'Karthik leads the digital marketing side of KR, focusing on branding, advertising, digital strategy and creative growth.',
    1
  ),
  (
    'RAJITHA',
    'Founder — KR Studioz',
    '/rajitha.png',
    'Rajitha leads KR Studioz with a focus on photography, visual storytelling and capturing meaningful wedding moments.',
    2
  );

-- 4.6 Testimonials
INSERT INTO testimonials (name, text, rating, display_order, is_active) VALUES
  ('Anand & Divya', 'KR Studioz captured our wedding moments with pure emotion and elegance. Every photograph tells a story!', 5, 1, true),
  ('Apex Retail Brands', 'KR Digital Marketing turned our brand vision into a powerful online campaign. Customer leads grew multifold!', 5, 2, true),
  ('Priya Mohan', 'Cinematic composition and incredible professionalism! The team was super patient and brought out natural candid shots.', 5, 3, true);

-- 4.7 Site Stats
INSERT INTO site_stats (label, value, display_order) VALUES
  ('Social Media Followers', '390K+', 1),
  ('Projects Completed', '500+', 2),
  ('Happy Clients', '350+', 3),
  ('Brands & Businesses', '120+', 4);

-- 4.8 Client Logos
INSERT INTO client_logos (name, logo_url, display_order, is_active) VALUES
  ('Brand One', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80', 1, true),
  ('Brand Two', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80', 2, true),
  ('Brand Three', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80', 3, true);

-- 4.9 Studioz Videos Showcase Carousel
INSERT INTO studioz_videos (title, category, thumbnail_url, video_url, display_order, is_active) VALUES
  ('Grand Cinematic Wedding Story', 'Wedding Film', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, true),
  ('Pre-Wedding Love Story Highlights', 'Pre-Wedding', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=85', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2, true),
  ('Royal Reception Celebration Teaser', 'Reception', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 3, true);
