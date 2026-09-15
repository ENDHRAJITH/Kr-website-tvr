-- ==============================================================================
-- KR WEBSITE — CLEAN DATABASE SEED & SCHEMA FOR ADMIN TESTING
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- URL: https://supabase.com/dashboard
-- ==============================================================================

-- 1. Ensure founder_decks table exists and has all social link columns
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

-- 2. Clear old data from all tables
TRUNCATE TABLE studioz_services, marketing_services, service_categories, portfolio_items, team_members, testimonials, client_logos, site_stats, founder_decks CASCADE;

-- 3. Insert 5 Studioz Services
INSERT INTO service_categories (id, division, name, slug, display_order) VALUES
  ('11111111-1111-4111-a111-111111111111', 'studioz', 'Weddings & Ceremonies', 'weddings', 1),
  ('22222222-2222-4222-a222-222222222222', 'studioz', 'Pre-Wedding & Couples', 'pre-wedding', 2),
  ('33333333-3333-4333-a333-333333333333', 'studioz', 'Baby & Maternity', 'baby-maternity', 3),
  ('44444444-4444-4444-a444-444444444444', 'studioz', 'Events & Corporate', 'events', 4),
  ('55555555-5555-4555-a555-555555555555', 'marketing', 'Search & Advertising', 'search-ads', 1),
  ('66666666-6666-4666-a666-666666666666', 'marketing', 'Social Media & Growth', 'social-growth', 2),
  ('77777777-7777-4777-a777-777777777777', 'marketing', 'Branding & Strategy', 'branding', 3);

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

-- 4. Insert 5 Digital Marketing Services
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

-- 5. Insert Founder Pitch Decks (Rajitha & Karthik)
INSERT INTO founder_decks (id, founder_name, founder_role, division, avatar_url, pdf_url, bio, youtube_url, instagram_url, facebook_url, whatsapp_url, linkedin_url, slides, display_order)
VALUES
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
