-- ==============================================================================
-- KR DIGITAL MARKETING & STUDIOZ — STUDIOZ VIDEOS & PORTFOLIO ITEMS DATA SCRIPT
-- Copy and run this script in:
-- Supabase Dashboard -> SQL Editor -> New Query -> Run
-- URL: https://supabase.com/dashboard
-- ==============================================================================

-- 1. INSERT STUDIOZ VIDEOS (Video Showcase Carousel / Marquee cards on Studioz Page)
INSERT INTO studioz_videos (title, category, thumbnail_url, video_url, display_order, is_active) VALUES
(
  'Grand Royal Wedding Teaser 4K',
  'Wedding Film',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  1,
  true
),
(
  'Destination Pre-Wedding Love Story',
  'Pre-Wedding',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/watch?v=5qap5aO4i9A',
  2,
  true
),
(
  'Traditional Sangeet & Haldi Celebrations',
  'Ceremony Film',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
  'https://www.instagram.com/reel/C3X9Zl2v1Aa/',
  3,
  true
),
(
  'Baby Milestone & First Birthday Highlights',
  'Baby & Kids',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
  4,
  true
),
(
  'Corporate Brand Film & Commercial Ad',
  'Commercial',
  'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=1200&q=80',
  'https://www.youtube.com/watch?v=L_LUpnjgPso',
  5,
  true
);

-- 2. INSERT PORTFOLIO ITEMS (Studioz & Digital Portfolio Galleries)
INSERT INTO portfolio_items (title, category, cover_image_url, gallery_urls, description, display_order, is_active) VALUES
(
  'The Royal Palace Wedding — Anand & Divya',
  'studioz',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ],
  'Complete 3-day royal wedding coverage in Chennai with candid portraits, ritual highlights, 4K film teasers, and luxury photo albums.',
  1,
  true
),
(
  'Beachside Destination Pre-Wedding Shoot',
  'studioz',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=1200&q=80'
  ],
  'Romantic sunset pre-wedding session at ECR Beach with drone cinematography and high-end edited couple portraits.',
  2,
  true
),
(
  'Baby Shower & Traditional Valaikappu',
  'studioz',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80'
  ],
  'Warm traditional celebration coverage focusing on family rituals, candid smiles, decor details, and reel highlights.',
  3,
  true
),
(
  'Hyper-Growth SEO Campaign — Apex Retail Brands',
  'digital',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
  ],
  'Scaled local keyword rankings to Rank #1 on Google, driving 350% increase in organic leads and zero per-click ad cost.',
  4,
  true
),
(
  'Performance Meta Ads & Instagram Reel Campaign',
  'digital',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1200&q=80'
  ],
  'High-ROI video reel ad campaign generating over 1,200 qualified lead inquiries per month for an e-commerce fashion brand.',
  5,
  true
),
(
  'Complete Brand Identity & Web App Overhaul',
  'digital',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80'
  ],
  'End-to-end brand strategy, luxury vector logo suite, brand color guidelines, and custom Next.js web application build.',
  6,
  true
);
