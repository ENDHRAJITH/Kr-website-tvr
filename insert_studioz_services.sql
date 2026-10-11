-- ==============================================================================
-- KR STUDIOZ SERVICES: MASTER DATABASE INSERT SCRIPT
-- Copy & Run this SQL in your Supabase SQL Editor to populate studioz_services
-- ==============================================================================

-- 1. Ensure Categories Exist for Studioz
INSERT INTO service_categories (id, division, name, slug, display_order) VALUES
  ('11111111-1111-4111-a111-111111111111', 'studioz', 'Weddings & Ceremonies', 'weddings', 1),
  ('22222222-2222-4222-a222-222222222222', 'studioz', 'Pre-Wedding & Couples', 'pre-wedding', 2),
  ('33333333-3333-4333-a333-333333333333', 'studioz', 'Baby & Maternity', 'baby-maternity', 3),
  ('44444444-4444-4444-a444-444444444444', 'studioz', 'Events & Corporate', 'events', 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;

-- 2. Clear Existing Studioz Services (to prevent duplicate entries)
DELETE FROM studioz_services;

-- 3. Insert All Studioz Services
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

-- Verification Query: Check that all 12 services are inserted
SELECT id, service_no, name, label, price, is_active FROM studioz_services ORDER BY display_order;
