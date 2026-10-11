-- ==============================================================================
-- KR DIGITAL MARKETING & STUDIOZ — COMPLETE SUPABASE MIGRATION MASTER SCRIPT
-- ==============================================================================
-- This single script will:
-- 1. Create ALL tables with optimal column types, defaults, and primary keys
-- 2. Configure Row Level Security (RLS) policies allowing public read & writes
-- 3. Insert ALL seed & production data (Marketing Plans, Studioz, Wedding Packages,
--    Client Logos, Team, Pitch Decks, Videos, Testimonials, and Why Choose Us)
--
-- How to run in your new Supabase project:
-- 1. Login to https://supabase.com with your new Gmail
-- 2. Create a New Project (or open existing)
-- 3. Go to SQL Editor (Left sidebar >_ icon)
-- 4. Click "New Query", paste this entire script, and click "RUN" (Ctrl + Enter)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE CREATIONS
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

-- 1.2 Studioz Services (Special Events, Candid, Add-ons)
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

-- 1.3 Marketing Services (Plan A to Plan G + Overall Package)
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

-- 1.4 Wedding Packages (Hindu, Christian, Muslim - Plans A, B, C)
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

-- 1.5 Portfolio Items
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

-- 1.6 Team Members
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

-- 1.7 Testimonials
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

-- 1.8 Client Logos
CREATE TABLE IF NOT EXISTS client_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  link TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.9 Site Stats
CREATE TABLE IF NOT EXISTS site_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.10 Founder Pitch Decks
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

-- 1.11 Studioz Videos Carousel
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

-- 1.12 Site Settings (Dynamic Why Choose Us & Config)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.13 Enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.14 Enquiry Items
CREATE TABLE IF NOT EXISTS enquiry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID REFERENCES enquiries(id) ON DELETE CASCADE,
  service_division TEXT CHECK (service_division IN ('studioz', 'marketing')),
  service_id UUID,
  service_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE studioz_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE studioz_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_items ENABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'service_categories', 'studioz_services', 'marketing_services',
    'wedding_packages', 'portfolio_items', 'team_members', 'testimonials',
    'client_logos', 'site_stats', 'founder_decks', 'studioz_videos',
    'site_settings', 'enquiries', 'enquiry_items'
  ]) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "public read %s" ON %I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "public read %s" ON %I FOR SELECT USING (true);', tbl, tbl);

    EXECUTE format('DROP POLICY IF EXISTS "allow write %s" ON %I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "allow write %s" ON %I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl);
  END LOOP;
END $$;

-- ------------------------------------------------------------------------------
-- 3. CLEAN EXISTING DATA BEFORE INSERT
-- ------------------------------------------------------------------------------

TRUNCATE TABLE 
  enquiry_items,
  enquiries,
  studioz_services,
  marketing_services,
  wedding_packages,
  service_categories,
  portfolio_items,
  team_members,
  testimonials,
  client_logos,
  site_stats,
  founder_decks,
  studioz_videos,
  site_settings
CASCADE;

-- ------------------------------------------------------------------------------
-- 4. INSERT DATA
-- ------------------------------------------------------------------------------

-- 4.1 Categories
INSERT INTO service_categories (id, division, name, slug, display_order) VALUES
  ('11111111-1111-4111-a111-111111111111', 'studioz', 'Weddings & Ceremonies', 'weddings', 1),
  ('22222222-2222-4222-a222-222222222222', 'studioz', 'Pre-Wedding & Couples', 'pre-wedding', 2),
  ('33333333-3333-4333-a333-333333333333', 'studioz', 'Baby & Maternity', 'baby-maternity', 3),
  ('44444444-4444-4444-a444-444444444444', 'studioz', 'Events & Corporate', 'events', 4),
  ('55555555-5555-4555-a555-555555555555', 'marketing', 'Search & Advertising', 'search-ads', 1),
  ('66666666-6666-4666-a666-666666666666', 'marketing', 'Social Media & Growth', 'social-growth', 2),
  ('77777777-7777-4777-a777-777777777777', 'marketing', 'Branding & Strategy', 'branding', 3);

-- 4.2 Studioz Services (Special Events, Pre-Wedding, Baby & Add-ons)
INSERT INTO studioz_services (
  service_no, name, category_id, label, price, description, icon, hero_image_url, cover_points, gallery_urls, display_order, is_active
) VALUES
(
  1,
  'Engagement Ceremony Package',
  '44444444-4444-4444-a444-444444444444',
  'Special Functions',
  '₹25,000/-',
  'Traditional & candid couple photoshoot coverage for Nichayathartham, ring exchange, and family ceremonies.',
  'ring',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85',
  ARRAY[
    '1 Traditional Photographer',
    '1 Traditional Videographer',
    'Couple Outdoor Portrait Session',
    'High-Quality Album (30 Sheets / 200 Photos)',
    'Traditional Full HD Video Output in Pen Drive',
    '1 Complimentary Photo Frame & Calendar',
    'Save the Date Poster & Video'
  ],
  ARRAY['https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=85'],
  1,
  true
),
(
  2,
  'Grand Reception Evening Package',
  '44444444-4444-4444-a444-444444444444',
  'Special Functions',
  '₹25,000/-',
  'Grand evening reception stage coverage, guest & family portraits, candid moments and high-quality synthetic album.',
  'sparkles',
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85',
  ARRAY[
    '1 Senior Traditional Photographer',
    '1 Traditional Videographer',
    'High-Quality Synthetic Album (30 Sheets)',
    'Complete Full HD Reception Video Output',
    'Album Carrying Bag & Premium Pen Drive',
    '1 Wall Mount Photo Frame'
  ],
  ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=85'],
  2,
  true
),
(
  3,
  'Birthday & Anniversary Celebration',
  '44444444-4444-4444-a444-444444444444',
  'Events & Parties',
  '₹15,000/-',
  'Fun, vibrant & energetic birthday party coverage with candid videography, cake cutting highlights, and custom album.',
  'cake',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85',
  ARRAY[
    '1 Traditional Photographer',
    '1 Candid Videographer',
    'Full Photo Retouching & Color Grading',
    'Mini Hardbound Photo Album (20 Sheets)',
    'Edited Cake Cutting Highlight Video (2-3 Mins)',
    'High-Speed Pen Drive with Box'
  ],
  ARRAY['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=85'],
  3,
  true
),
(
  4,
  'Grand Opening & Showroom Launch',
  '44444444-4444-4444-a444-444444444444',
  'Commercial',
  '₹25,000/-',
  'Complete commercial launch and business inauguration coverage featuring 4K drone walkthroughs, VIP guests and 2 viral Instagram reels.',
  'building',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
  ARRAY[
    '1 Traditional Photographer & 1 Candid Videographer',
    '4K Licensed Drone Aerial Video & Photos',
    'VIP Ribbon Cutting & Lamp Lighting Coverage',
    '02 Edited Instagram Viral Promo Reels',
    'Full Length Event Showcase Video'
  ],
  ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85'],
  4,
  true
),
(
  5,
  'Cinematic Pre-Wedding Concept Shoot',
  '22222222-2222-4222-a222-222222222222',
  'Trending',
  '₹35,000/-',
  'Outdoor destination pre-wedding concept shoots, romantic love story teasers, high-res portraits, and creative storytelling.',
  'camera',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
  ARRAY[
    'Full Day Outdoor Location Shoot',
    'Up to 3 Outfit Changes',
    'Sony FX3 Cinema 4K Romantic Teaser Reel (60s)',
    '30 Master Retouched High-Res Photos',
    'Drone Aerial Couple Shots',
    'Save the Date Motion Graphics Video'
  ],
  ARRAY['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=85'],
  5,
  true
),
(
  6,
  'Grand Wedding Master Cinema Film',
  '11111111-1111-4111-a111-111111111111',
  'Signature Masterpiece',
  '₹75,000/-',
  'Complete royal wedding coverage by Creative Director Rajitha and team. Traditional photography, candid emotions, 4K cinematic teasers, and luxury photo albums.',
  'film',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  ARRAY[
    '2 Candid Photographers (Sony Alpha Full Frame)',
    '2 Cinematic Videographers (Sony FX3 4K Gimbal)',
    '1 Traditional Photographer & 1 Videographer',
    '4K Drone Aerial Cinematography',
    '2 Luxury Canvera Velvet Albums (70 Sheets)',
    '4K Cinematic Wedding Highlight Film (3–5 Mins)',
    'Full Wedding Traditional Video Output in 1TB Drive',
    '3 Instagram Reels with Custom Sound Design'
  ],
  ARRAY['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85'],
  6,
  true
),
(
  7,
  'Baby Milestone & Themed Portraits',
  '33333333-3333-4333-a333-333333333333',
  'Family Special',
  '₹12,000/-',
  'Gentle and creative baby milestone photoshoot with themed setups, safe studio lighting, and high-resolution edited pictures.',
  'baby',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85',
  ARRAY[
    'Baby Themed Props & Costumes Included',
    'Gentle Baby-Friendly Soft Lighting',
    'Family & Parents Portrait Frames',
    '25 Retouched High-Resolution Digital Photos',
    '1 Instagram Cute Reel Teaser',
    'Mini Photo Book (15 Sheets)'
  ],
  ARRAY['https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=85'],
  7,
  true
),
(
  8,
  'Valaikappu & Baby Shower Ceremony',
  '33333333-3333-4333-a333-333333333333',
  'Ceremonial',
  '₹18,000/-',
  'Capture the joy, family blessings and vibrant traditional moments of a Valaikappu and Seemantham ceremony.',
  'gift',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=85',
  ARRAY[
    '1 Traditional Photographer & 1 Videographer',
    'Maternity & Mother-to-be Candid Portraits',
    'Complete Bangle Ceremony Ritual Coverage',
    'High Quality Hardbound Album (25 Sheets)',
    'Full HD Edited Video on Pen Drive',
    '1 Custom Table Top Portrait Frame'
  ],
  ARRAY['https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=85'],
  8,
  true
),
(
  9,
  'Live Multi-Cam 4K Broadcasting',
  '44444444-4444-4444-a444-444444444444',
  'Live Production',
  '₹35,000/-',
  'Professional 4K multi-camera live streaming and video switching setup for grand weddings, concerts & corporate summits.',
  'tv',
  'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=1200&q=85',
  ARRAY[
    '3 Full HD/4K Multi-Camera Setup',
    'Live Video Switcher Console & Sound Mixer',
    'Dedicated High-Speed Live Internet Bonding',
    'YouTube, Facebook & Private NRI Portal Live Stream',
    'Complete Raw Multi-Track Video Recording'
  ],
  ARRAY['https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=800&q=85'],
  9,
  true
),
(
  10,
  'Stage LED Wall (08 x 06 Size)',
  '44444444-4444-4444-a444-444444444444',
  'Add-on Service',
  '₹15,000/-',
  'High-definition indoor/outdoor stage LED video wall for live camera feed display, bride-groom photo slideshows, and teaser screening.',
  'tv',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
  ARRAY[
    '08 x 06 Ultra HD P3 LED Screen',
    'Live Camera Feed Video Switching Support',
    'Pre-Wedding & Couple Slideshow Playback',
    'On-Site Technical Operator Included'
  ],
  ARRAY['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85'],
  10,
  true
),
(
  11,
  'Licensed 4K Drone Cinematography',
  '44444444-4444-4444-a444-444444444444',
  'Add-on Service',
  '₹12,000/-',
  'Breathtaking 4K aerial drone photography & cinematography covering mandap, barat entrance, temple architecture, and venue views.',
  'camera',
  'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=85',
  ARRAY[
    'DJI 4K Drone Aerial System',
    'DGCA Certified Drone Pilot Operator',
    'Baraat, Mandap & Grand Entry Aerial Shots',
    'Color Graded 4K Aerial Video Output'
  ],
  ARRAY['https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=85'],
  11,
  true
),
(
  12,
  'Luxury Velvet Canvera Album',
  '44444444-4444-4444-a444-444444444444',
  'Add-on Service',
  '₹10,000/-',
  'Ultra-premium velvet matte synthetic waterproof photo album with embossed custom acrylic cover and matching leather bag.',
  'framed_picture',
  'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85',
  ARRAY[
    '40 Pages / 80 Sides (250+ Photos)',
    'Waterproof & Non-Tear Synthetic Velvet Paper',
    'Personalized Acrylic Front Cover with Couple Name',
    'Luxury Leather Briefcase Carrying Box'
  ],
  ARRAY['https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=85'],
  12,
  true
);

-- 4.3 Marketing Services (Plans A to G + Overall Master Plan)
INSERT INTO marketing_services (
  service_no, name, category_id, subtitle, description, price, price_unit, features, benefits, project_tag, display_order, is_active
) VALUES
(
  1,
  'Plan A — Master Reel Promotion',
  '66666666-6666-4666-a666-666666666666',
  'Instagram, Facebook & YouTube Shorts Reel Promotion',
  'Using Reels (Instagram, Facebook, or YouTube Shorts) is one of the fastest ways to build an audience and drive sales today. Promoted across Karthick Tamilan 375,000+ follower channels.',
  '₹25,000/-',
  'per campaign',
  ARRAY['Reel Shoot', 'Reel Edit', 'Reel Promote', 'Casting', 'Voice Over', 'Drone Photos', 'Drone Shots in Reel', 'Targeting 375k+ Followers Pages'],
  ARRAY['Fast audience growth', '100,000+ Verified Views', 'High social media engagement', 'Instant brand awareness'],
  'PLAN A - REEL PROMOTION',
  1,
  true
),
(
  2,
  'Plan B — Landscape Cinematic Ad Video',
  '66666666-6666-4666-a666-666666666666',
  'DSLR Mirrorless Full Frame Sony Alpha Shoot',
  'Landscape ads allow you to showcase the full scale, luxury, and premium feel of a property or business, making them highly effective for YouTube, Facebook feed ads, website landing pages, theater ads, and big-screen office displays.',
  '₹25,000/-',
  'per ad video',
  ARRAY['01 Min Ad Video (for YouTube Ads)', 'Landscape Video Shoot (DSLR Mirrorless Sony Alpha)', 'Landscape Video Edit & Color Grading', 'Landscape Video Promote', 'Professional Voice Over', 'Drone Landscape Video & Photos', 'Usable for Theater Ads & LED Vehicles'],
  ARRAY['Showcases full scale & luxury feel', '100,000+ Verified Views', 'Perfect for YouTube & Facebook feed ads', 'High-impact big screen display'],
  'PLAN B - CINEMATIC AD',
  2,
  true
),
(
  3,
  'Plan C — Organic Content Reels Promotions',
  '66666666-6666-4666-a666-666666666666',
  '10 Reels Per Month (Publish Every 2 Days)',
  'Organic Content Reels Promotion by Karthick Tamilan. One video published every 2 days (10 reels/month) across FB, Instagram & YouTube to scale your business revenue.',
  '₹50,000/-',
  '/ month',
  ARRAY['10 Reels Per Month', 'Publish Every 02 Days Once', 'Full Reel Shoot & Edit', 'Multi-Platform Promotion (FB, Insta, YouTube)', 'Karthick Tamilan Organic Reach Integration'],
  ARRAY['500,000+ Organic Views', '3x Growth in Monthly Revenue', 'Consistent brand visibility', 'High customer retention'],
  'PLAN C - MONTHLY REELS',
  3,
  true
),
(
  4,
  'Plan D — Local Influencer Connects',
  '66666666-6666-4666-a666-666666666666',
  '5 Local Niche Influencer Collaborations',
  'Collaborate with 5 top local niche influencers in the region to launch promotional reels and boost brand awareness among your target audience.',
  '₹25,000/-',
  'for 05 Influencers',
  ARRAY['05 Niche Local Influencers Collaboration', '50k to 100k Reach Per Influencer', 'Target Audience Social Media Connect', 'Campaign Strategy & Co-ordination', '10 Lakh+ Total Projected Views'],
  ARRAY['Over 10 Lakh total views', 'High local brand awareness', 'Authentic creator trust', 'Hyper-targeted audience reach'],
  'PLAN D - INFLUENCERS',
  4,
  true
),
(
  5,
  'Plan E — Local Social Media Pages Connect',
  '66666666-6666-4666-a666-666666666666',
  '50+ Local Instagram Pages (60KM Radius)',
  'Connect with 50+ local Instagram pages targeted specifically within a 60KM radius surrounding your business location at just ₹500 per page.',
  '₹25,000/-',
  '50+ Pages @ ₹500/page',
  ARRAY['50+ Local Influencer & Meme/News Instagram Pages', 'Targeted 60KM Surrounding Radius', 'Hyper-Local Community Promotion', 'Massive Viral Regional Reach'],
  ARRAY['Dominates local target market', 'Surrounding 60KM radius saturation', 'Budget-friendly per page promotion', 'Instant local inquiries'],
  'PLAN E - LOCAL PAGES',
  5,
  true
),
(
  6,
  'Plan F — Paid Promotions (Meta & YouTube Ads)',
  '55555555-5555-4555-a555-555555555555',
  'Targeted Lead Gen Ads (FB + Insta + YouTube)',
  'Paid promotional ad campaigns across Facebook, Instagram, and YouTube specifically optimized to collect verified phone numbers and emails of serious buyers.',
  '₹15,000/-',
  'for First Month',
  ARRAY['FB Ads — ₹5,000 Budget', 'Instagram Ads — ₹5,000 Budget', 'YouTube Ads — ₹5,000 Budget', 'Targeted Lead Generation Setup', 'Hyper-Local & NRI Investor Targeting', 'Verified Phone & Email Lead Capture'],
  ARRAY['Direct lead generation', 'High-intent buyer acquisition', 'Hand-delivered sales leads', 'Full ad account optimization'],
  'PLAN F - PAID ADS',
  6,
  true
),
(
  7,
  'Plan G — Grand Opening Shoot Promotions',
  '77777777-7777-4777-a777-777777777777',
  'Full Launch & Event Shoot Coverage',
  'Grand opening event shoot with traditional photography, candid videography, soft copies of photos, and 1 highlight output video.',
  '₹25,000/-',
  'per launch event',
  ARRAY['Traditional Photography', 'Candid Videography', 'Soft Copy of All Photos', '01 Edited Video Output with Highlights', 'Social Media Launch Posters'],
  ARRAY['Complete event coverage', 'Professional highlight reel', 'Social media launch hype', 'High quality soft copies'],
  'PLAN G - GRAND OPENING',
  7,
  true
),
(
  8,
  'Overall Plan — 360° All-In-One Master Package',
  '77777777-7777-4777-a777-777777777777',
  'Complete Combined Growth Package (Plan A to Plan G)',
  'The ultimate 360-degree digital marketing package combining all 7 plans (Plan A through G) for total market dominance and maximum ROI.',
  '₹1,90,000/-',
  'Full Package (Total 190K)',
  ARRAY['Plan A: Master Reel Promotion (25K)', 'Plan B: Landscape Cinematic Ad Video (25K)', 'Plan C: 10 Organic Reels (50K)', 'Plan D: 05 Local Influencers Connect (25K)', 'Plan E: 50+ Local Pages Connect (25K)', 'Plan F: Meta & YouTube Paid Ads (15K)', 'Plan G: Grand Opening Shoot (25K)'],
  ARRAY['Complete market dominance', 'Over 1 Million+ Combined Reach', 'Full-funnel marketing strategy', 'Maximum ROI and lead conversion'],
  'OVERALL MASTER PLAN',
  8,
  true
);

-- 4.3 Wedding Packages (9 Plans across 3 Religions)
INSERT INTO wedding_packages (
  religion, plan_code, plan_name, tagline, badge, price, hero_image_url,
  photo_video_inclusions, deliverables_inclusions, is_popular, is_ultra, display_order, is_active
) VALUES
(
  'hindu', 'A', 'Hindu Wedding — Plan A (Traditional Photo & 4K Video)',
  'Nichayathartham, Muhurtham & Reception Coverage with dual cameraman setup.',
  'Traditional Package', '₹45,000/-',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  ARRAY['1 Traditional Photographer', '1 Traditional Videographer', 'Full HD & 4K Camera Setup', 'Stage & Mandap Lighting Coverage'],
  ARRAY['Premium Canvera Photo Album (35 Sheets)', 'Edited Full HD Video Output in Pen Drive', 'Highlight Teaser Reel for Instagram', 'Complimentary Photo Frame'],
  false, false, 1, true
),
(
  'hindu', 'B', 'Hindu Wedding — Plan B (Candid Photography & Cinematography)',
  'Haldi, Mehendi, Muhurtham & Grand Reception with Candid & Cinematic Storytelling.',
  'Most Popular', '₹65,000/-',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
  ARRAY['1 Candid Photographer (Sony Alpha Full Frame)', '1 Cinematic Videographer (4K Gimbal & Slow Motion)', '1 Traditional Photographer', '1 Traditional Videographer', 'Couple Outdoor Portrait Session'],
  ARRAY['2 Premium Leather Photo Albums (70 Sheets)', '4K Cinematic Wedding Film (3–5 Mins)', 'Full Wedding Long-form Video', '60-sec Instagram Reels Output', 'Metal Finish Portrait Frame (12x18)'],
  true, false, 2, true
),
(
  'hindu', 'C', 'Hindu Wedding — Plan C (VIP Luxury Drone & Multi-Cam Cinema)',
  'Complete 360° Royal Wedding Cinema with 4K Drone Aerials, Live Mixing & Candid Masterclass.',
  'VIP Ultra Luxury', '₹90,000/-',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85',
  ARRAY['2 Senior Candid Photographers', '2 Cinematic Videographers (Sony FX3 Cinema Line)', '1 Traditional Photographer & 1 Videographer', 'Licensed 4K Drone Aerial Cinematography', 'Live Streaming Setup for NRI Relatives'],
  ARRAY['3 Ultra-HD Velvet Matte Albums', 'Full Cinematic Documentary Wedding Film', '3 Viral Instagram Reels with Sound Design', '2 Mini Pocket Albums for Parents', '20x30 Canvas Wall Art Frame', 'Raw Footage in 1TB External Hard Drive'],
  false, true, 3, true
),
(
  'christian', 'A', 'Christian Wedding — Plan A (Church Matrimony & Reception)',
  'Holy Matrimony Nuptial Mass & Reception Evening Coverage.',
  'Traditional Package', '₹45,000/-',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
  ARRAY['1 Traditional Photographer', '1 Traditional Videographer', 'Church Ceremony & Choir Audio Capture'],
  ARRAY['Premium Photo Album (35 Sheets)', 'Full HD Video on Pen Drive', 'Highlight Teaser Video'],
  false, false, 4, true
),
(
  'christian', 'B', 'Christian Wedding — Plan B (Candid Matrimony & 4K Cinema)',
  'Bridal Preparation, Church Nuptial Vows & Grand Ballroom Reception.',
  'Most Popular', '₹65,000/-',
  'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=85',
  ARRAY['1 Candid Photographer', '1 Cinematic Videographer', '1 Traditional Photographer & Videographer', 'Bridal Prep & Gown Session'],
  ARRAY['2 Premium Hardbound Albums', '4K Cinematic Wedding Film', 'Social Media Reel Teasers', 'Large Wall Frame'],
  true, false, 5, true
),
(
  'christian', 'C', 'Christian Wedding — Plan C (Royal Matrimony & Grand Reception VIP)',
  'Complete Royal Church & Grand Gala Coverage with 4K Drone Aerials.',
  'VIP Ultra Luxury', '₹90,000/-',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
  ARRAY['2 Candid Photographers', '2 Cinematic Videographers', 'Drone Aerials', 'Traditional Crew & Live Broadcast'],
  ARRAY['3 Luxury Albums', 'Full Cinematic Film', 'Viral Reels', 'Parent Mini Books', 'Complete Raw Drive'],
  false, true, 6, true
),
(
  'muslim', 'A', 'Muslim Wedding — Plan A (Nikah Traditional Coverage)',
  'Sacred Nikah Ceremony & Groom Reception Coverage.',
  'Traditional Package', '₹45,000/-',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85',
  ARRAY['1 Traditional Photographer', '1 Traditional Videographer', 'Nikah & Stage Coverage'],
  ARRAY['Premium Photo Album (35 Sheets)', 'Full HD Video on Pen Drive', 'Teaser Reel'],
  false, false, 7, true
),
(
  'muslim', 'B', 'Muslim Wedding — Plan B (Nikah & Walima Candid Cinema)',
  'Mehendi, Sacred Nikah & Grand Walima Reception with 4K Cinematography.',
  'Most Popular', '₹65,000/-',
  'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=85',
  ARRAY['1 Candid Photographer', '1 Cinematic Videographer', '1 Traditional Photographer & Videographer', 'Separate Ladies Hall Coverage if requested'],
  ARRAY['2 Premium Albums', '4K Cinematic Film', 'Instagram Reels', 'Wall Portrait Frame'],
  true, false, 8, true
),
(
  'muslim', 'C', 'Muslim Wedding — Plan C (Grand Royal Nikah & Walima VIP)',
  'All Rituals, Groom Baraat, Sacred Nikah, Walima Reception & 4K Drone Aerials.',
  'VIP Ultra Luxury', '₹90,000/-',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
  ARRAY['2 Candid Photographers', '2 Cinematic Videographers', 'Licensed Drone Aerials', 'Traditional Team & Live Streaming'],
  ARRAY['3 Luxury Albums', 'Full Cinematic Wedding Film', 'Viral Reels', 'Mini Albums', 'Complete Raw Drive'],
  false, true, 9, true
);

-- 4.4 Client Logos
INSERT INTO client_logos (name, logo_url, link, display_order, is_active) VALUES
  ('BNI Emperor Chapter', '/images/bni-logo.png', 'https://bni.com', 1, true),
  ('KR Digital Marketing', '/kr-logo.png', NULL, 2, true),
  ('Delta Real Estate Developers', '/kr-logo.png', NULL, 3, true),
  ('KR Studioz Wedding Films', '/kr-logo.png', NULL, 4, true),
  ('Thiruvarur Land & Plot Sales', '/kr-logo.png', NULL, 5, true),
  ('Gulf & SEA NRI Investor Network', '/kr-logo.png', NULL, 6, true);

-- 4.5 Site Stats
INSERT INTO site_stats (label, value, icon, display_order) VALUES
  ('Verified Content Views', '12.4M+', 'Eye', 1),
  ('Unique Viewers Reached', '4.04M+', 'Users', 2),
  ('Viral Reel Plays', '9.5M+', 'Play', 3),
  ('Prime Investors (25–44)', '70.6%', 'PieChart', 4);

-- 4.6 Founder Pitch Decks
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
  'Pioneer of high-end wedding cinematography and storytelling with 500+ weddings covered.',
  'https://youtube.com/@krstudioz',
  'https://instagram.com/krstudioz',
  'https://facebook.com/krstudioz',
  'https://wa.me/919944747775',
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
  'Brand strategist, Vice President BNI Emperor Chapter & growth hacker driving multi-million reach.',
  'https://youtube.com/@krdigital',
  'https://instagram.com/krdigital',
  'https://facebook.com/krdigital',
  'https://wa.me/919626759859',
  'https://linkedin.com',
  ARRAY[]::TEXT[],
  2
);

-- 4.7 Team Members
INSERT INTO team_members (name, role, photo_url, bio, display_order) VALUES
  (
    'KARTHIK TAMILAN',
    'Founder & Managing Director — KR Digital Marketing',
    '/images/karthick-bni-vp.jpg',
    'Vice President BNI Emperor Chapter, brand strategist and digital funnel architect with 375,000+ social following and 12.4M+ reach.',
    1
  ),
  (
    'RAJITHA',
    'Founder & Creative Director — KR Studioz',
    '/rajitha.png',
    'Creative director and pioneer of candid wedding cinematography and color-graded films across Tamil Nadu.',
    2
  );

-- 4.8 Studioz Videos Carousel
INSERT INTO studioz_videos (title, video_url, category, thumbnail_url, display_order, is_active) VALUES
  ('Royal Hindu Muhurtham Cinema Film', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Wedding Film', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85', 1, true),
  ('Christian Nuptial & Ballroom Reception Highlight', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Wedding Film', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85', 2, true),
  ('Grand Nikah & Walima Teaser Reel', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Reel', 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=85', 3, true),
  ('Delta Land Layout Drone Aerial Walkthrough', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Commercial Drone', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=85', 4, true);

-- 4.9 Testimonials
INSERT INTO testimonials (name, text, rating, photo_url, is_active, display_order) VALUES
  ('Senthil Kumar (Delta Real Estate Developers)', 'Karthick Tamilan produced a 4K drone walkthrough and ran targeted reels for our 50-plot layout in Thiruvarur. Within 3 weeks, we closed 22 plot bookings! Unmatched ROI.', 5, NULL, true, 1),
  ('Priya & Vignesh (Chennai & Mannargudi Wedding)', 'KR Studioz captured our wedding like an international movie! The candid moments, slow motion drone shots, and synthetic album print quality blew our family away.', 5, NULL, true, 2),
  ('Mohammed Farooq (Gulf NRI Investor)', 'Being based in Dubai, I wanted to sell commercial plots back in Tamil Nadu. KR Digital funnels targeted Gulf Tamils directly and helped us generate 40+ high net worth inquiries in 10 days.', 5, NULL, true, 3);

-- 4.10 Dynamic Why Choose Us Settings
INSERT INTO site_settings (key, value, updated_at) VALUES (
  'why_choose_us',
  '{
    "hero": {
      "badge": "Why Choose Us • Verified Market Authority",
      "title": "WHY BRANDS & REAL ESTATE DEVELOPERS",
      "titleHighlight": "TRUST KARTHICK TAMILAN.",
      "description": "We do not just create ad campaigns — we build visual desire backed by 12.4 Million+ verified content views, 70.6% prime investor demographics, and laser-targeted NRI lead funnels.",
      "stats": [
        { "value": "12.4M+", "label": "30-Day Content Views" },
        { "value": "4.04M+", "label": "Unique Viewers Reached" },
        { "value": "9.5M+", "label": "Viral Reel Plays" },
        { "value": "70.6%", "label": "Investors Aged 25–44" }
      ]
    },
    "bniLeadership": {
      "badge": "Regional Entrepreneur Leadership",
      "chapterName": "BNI Emperor Chapter",
      "leaderName": "KARTHICK TAMILAN",
      "role": "VICE PRESIDENT — BNI EMPEROR CHAPTER",
      "subtitle": "Founder, KR Digital Marketing & Studioz",
      "description": "Karthick Tamilan holds the position of Vice President of the BNI Emperor Chapter in Thiruvarur district (under the BNI Nagapattinam, Karaikal, Mayiladuthurai, and Thiruvarur region).",
      "photoUrl": "/images/karthick-bni-vp.jpg",
      "highlights": [
        {
          "title": "Leadership Team Management",
          "description": "Managing the chapter leadership team, driving member growth, and streamlining business referrals across Thiruvarur & Delta districts."
        },
        {
          "title": "LTRT & Cross-Chapter Events",
          "description": "Organizing Leadership Team Roundtable (LTRT) meets and cross-chapter entrepreneur networking initiatives across the Delta region."
        }
      ],
      "whyItMatters": "Partnering with Karthick Tamilan gives your brand direct market trust and access to an established network of top entrepreneurs, real estate developers, and corporate leaders across the entire Delta region!"
    },
    "analytics": {
      "badge": "Verified Account Insights (@karthick_tamilan)",
      "title": "REAL AUDIENCE",
      "titleHighlight": "ANALYTICS & PROOF.",
      "description": "Verified high-intent demographic breakdown for maximum real estate sales & brand conversion.",
      "overview": {
        "contentViews": "12.4M",
        "viewsGrowth": "+21.4% Growth",
        "nonFollowersRatio": "78.6%",
        "followersRatio": "21.4%",
        "uniqueViewers": "4,045,498",
        "reelsPlays": "9,500,000 Plays",
        "postImpressions": "594,000 Impressions",
        "monthlyGrowth": "+6,600"
      },
      "age": {
        "headline": "70.6% OF AUDIENCE IS AGED 25 TO 44 YEARS",
        "description": "This is the exact prime age group with active financial savings, bank loan eligibility, and high purchase intent for Real Estate Plot Layouts, Luxury Villas, Commercial Shops, and Consumer Brands!",
        "decisionMakersPercent": "71%",
        "decisionMakersNote": "Over 71% of viewers are working professionals and entrepreneurs actively looking to invest money in property, land, and lifestyle upgrades.",
        "ranges": [
          { "label": "25–34 Years (Prime Home Buyers)", "pct": "44.9%", "color": "orange" },
          { "label": "35–44 Years (Senior Business & Land Investors)", "pct": "25.7%", "color": "purple" },
          { "label": "18–24 Years", "pct": "14.8%", "color": "blue" },
          { "label": "45–54 Years (Senior Wealth Investors)", "pct": "7.7%", "color": "emerald" }
        ]
      },
      "locations": {
        "countries": [
          { "name": "India (Local Market)", "flag": "🇮🇳", "pct": "87.6%", "highlight": true },
          { "name": "United Arab Emirates (UAE Gulf NRIs)", "flag": "🇦🇪", "pct": "3.3%", "highlight": true },
          { "name": "Singapore (SEA NRIs)", "flag": "🇸🇬", "pct": "2.5%", "highlight": true },
          { "name": "Malaysia", "flag": "🇲🇾", "pct": "1.4%", "highlight": false },
          { "name": "Kuwait", "flag": "🇰🇼", "pct": "1.3%", "highlight": false }
        ],
        "cities": [
          { "name": "Chennai (Metro Buyers)", "icon": "🏙️", "pct": "12.8%", "highlight": true },
          { "name": "Thiruvarur (Delta Heart)", "icon": "🌾", "pct": "4.3%", "highlight": true },
          { "name": "Nannilam", "icon": "🌾", "pct": "3.3%", "highlight": false },
          { "name": "Mannargudi", "icon": "🌾", "pct": "2.8%", "highlight": false },
          { "name": "Singapore", "icon": "🇸🇬", "pct": "2.5%", "highlight": false }
        ],
        "nriFunnelsNote": "Over 8.5% of total reach comes directly from Gulf & SEA NRI investors looking to buy real estate back in Tamil Nadu!",
        "deltaMonopolyNote": "Dominating Thanjavur, Trichy, Thiruvarur, Nannilam & Mannargudi with hyper-local precision!"
      },
      "proofScreenshots": [
        { "title": "12.4M Views & 9.5M Reels", "subtitle": "Overview Proof", "imageUrl": "/images/analytics/overview.jpg" },
        { "title": "25–34 Yrs (44.9%) & 35–44 Yrs (25.7%)", "subtitle": "Age Demographics Proof", "imageUrl": "/images/analytics/age.jpg" },
        { "title": "India 87.6%, UAE 3.3%, SG 2.5%", "subtitle": "Country Reach Proof", "imageUrl": "/images/analytics/countries.jpg" },
        { "title": "Chennai 12.8%, Thiruvarur 4.3%", "subtitle": "City Reach Proof", "imageUrl": "/images/analytics/cities.jpg" }
      ]
    },
    "growthScenarios": [
      {
        "number": "01",
        "title": "🏡 Real Estate Layout & Plot Sales",
        "description": "Traditional paper fliers fail to show layout beauty. We produce 4K Sony DSLR & Drone aerial walkthroughs, broadcasting to 70.6% buyers aged 25–44 in Delta & Chennai. We deliver verified lead forms directly to your sales team, driving instant site visit bookings.",
        "tags": ["✓ 100+ Layouts Sold Out", "Drone Aerials • Site Visit Leads"]
      },
      {
        "number": "02",
        "title": "🏬 Retail & Grand Showroom Launches",
        "description": "Creating massive footfall on day one with viral countdown teasers, celebrity influencer presence, and high-impact reel coverage that establishes instant local buzz.",
        "tags": ["✓ 50+ Grand Openings", "Same-Day Viral Coverage • VIP Walkthroughs"]
      },
      {
        "number": "03",
        "title": "💎 Luxury Wedding Cinema & NRI Coverage",
        "description": "KR Studioz provides masterclass wedding cinematography with multi-camera setups, cinematic color grading, and drone shots that capture every sacred ritual with breathtaking emotional depth.",
        "tags": ["✓ 500+ Weddings Filmed", "4K Sony Alpha Cinema • Cinematic Color Grading"]
      },
      {
        "number": "04",
        "title": "🌍 NRI Investor Direct Funnels",
        "description": "Directly targeting Tamil diaspora in UAE, Singapore, and Malaysia with currency-advantage property pitches and remote virtual walkthroughs.",
        "tags": ["✓ 8.5%+ International Reach", "High Ticket Conversions • WhatsApp Funnels"]
      }
    ]
  }'::JSONB,
  NOW()
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- ==============================================================================
-- END OF MIGRATION MASTER SCRIPT — DATABASE IS 100% READY & SEEDED!
-- ==============================================================================
