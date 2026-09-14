-- ==============================================================================
-- KR DIGITAL MARKETING & STUDIOZ — COMPLETE DATABASE SEED SQL
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- URL: https://supabase.com/dashboard
-- ==============================================================================

-- Clean up previous seed data cleanly
TRUNCATE TABLE studioz_services, marketing_services, service_categories, portfolio_items, team_members, testimonials, client_logos, site_stats CASCADE;

-- ------------------------------------------------------------------------------
-- 1. SERVICE CATEGORIES
-- ------------------------------------------------------------------------------
INSERT INTO service_categories (id, division, name, slug, display_order) VALUES
  ('11111111-1111-4111-a111-111111111111', 'studioz', 'Weddings & Ceremonies', 'weddings', 1),
  ('22222222-2222-4222-a222-222222222222', 'studioz', 'Pre-Wedding & Couples', 'pre-wedding', 2),
  ('33333333-3333-4333-a333-333333333333', 'studioz', 'Baby & Maternity', 'baby-maternity', 3),
  ('44444444-4444-4444-a444-444444444444', 'studioz', 'Events & Corporate', 'events', 4),
  ('55555555-5555-4555-a555-555555555555', 'marketing', 'Search & Advertising', 'search-ads', 1),
  ('66666666-6666-4666-a666-666666666666', 'marketing', 'Social Media & Growth', 'social-growth', 2),
  ('77777777-7777-4777-a777-777777777777', 'marketing', 'Branding & Strategy', 'branding', 3);

-- ------------------------------------------------------------------------------
-- 2. STUDIOZ SERVICES (Photography & Cinematography)
-- ------------------------------------------------------------------------------
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
  ARRAY[
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85'
  ],
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
  ARRAY['Full Day Outdoor Location Shoot', '3 Outfit Outfit Changes', '4K Romantic Reel Teaser (60s)', '30 Retouched High-Res Photos', 'Props & Concept Styling'],
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
  ARRAY['Theme Studio Setup & Costumes', 'Gentle Baby-Friendly Lighting', '20 Edited Digital Photos', 'Framed Table Top Canvas'],
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
  ARRAY['Brand Story Video (2-3 Mins)', 'Social Media Reel Edits (Vertical)', 'Voiceover & Professional Audio', 'Commercial Usage Rights'],
  ARRAY['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85'],
  5,
  true
);

-- ------------------------------------------------------------------------------
-- 3. MARKETING SERVICES (Digital Marketing & Branding)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 4. PORTFOLIO ITEMS
-- ------------------------------------------------------------------------------
INSERT INTO portfolio_items (title, category, cover_image_url, description, display_order, is_active) VALUES
  ('A Story Worth Remembering', 'studioz', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90', 'Grand wedding story captured with candid emotion.', 1, true),
  ('Identity That Stands Out', 'digital', 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=90', 'Brand identity overhaul and performance strategy.', 2, true),
  ('Before The Big Day', 'studioz', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=90', 'Cinematic outdoor pre-wedding couple portraits.', 3, true),
  ('Creative Built For Growth', 'digital', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=90', 'High ROI digital campaign and reel marketing.', 4, true),
  ('Royal Reception Celebrations', 'studioz', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=90', 'Vibrant evening reception moments.', 5, true);

-- ------------------------------------------------------------------------------
-- 5. TEAM MEMBERS
-- ------------------------------------------------------------------------------
INSERT INTO team_members (name, role, photo_url, bio, display_order) VALUES
  (
    'KARTHIK',
    'Founder — KR Digital Marketing',
    '/karthik.png',
    'Karthik leads the digital marketing side of KR, focusing on branding, advertising, digital strategy and creative growth. His role is centred around helping businesses communicate their value.',
    1
  ),
  (
    'RAJITHA',
    'Founder — KR Studioz',
    '/rajitha.png',
    'Rajitha leads KR Studioz with a focus on photography, visual storytelling and capturing meaningful moments. Her work focuses on turning real emotions into visual memories.',
    2
  );

-- ------------------------------------------------------------------------------
-- 6. TESTIMONIALS
-- ------------------------------------------------------------------------------
INSERT INTO testimonials (name, text, rating, display_order, is_active) VALUES
  ('Anand & Divya', 'KR Studioz captured our wedding moments with pure emotion and elegance. Every photograph tells a story that we will cherish for a lifetime.', 5, 1, true),
  ('Apex Retail Brands', 'KR Digital Marketing turned our brand vision into a powerful online campaign. Our social engagement and customer leads grew multifold!', 5, 2, true),
  ('Priya Mohan', 'Cinematic composition and incredible professionalism! The team was super patient and brought out the best natural candid shots.', 5, 3, true);

-- ------------------------------------------------------------------------------
-- 7. SITE STATS
-- ------------------------------------------------------------------------------
INSERT INTO site_stats (label, value, display_order) VALUES
  ('Social Media Followers', '390K+', 1),
  ('Projects Completed', '500+', 2),
  ('Happy Clients', '350+', 3),
  ('Brands & Businesses', '120+', 4);

-- ------------------------------------------------------------------------------
-- 8. CLIENT LOGOS
-- ------------------------------------------------------------------------------
INSERT INTO client_logos (name, logo_url, display_order, is_active) VALUES
  ('Brand One', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80', 1, true),
  ('Brand Two', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80', 2, true),
  ('Brand Three', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80', 3, true);
