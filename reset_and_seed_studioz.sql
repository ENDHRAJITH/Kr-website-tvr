-- =========================================================================
-- KR STUDIOZ: COMPLETE FRESH RESET & SEED FOR WEDDING & SPECIAL SERVICES
-- Copy & Run this SQL in your Supabase SQL Editor to clear old data & populate clean structure
-- =========================================================================

-- 1. DELETE OLD STUDIOZ SERVICES DATA
DELETE FROM public.studioz_services;
DELETE FROM public.service_categories WHERE division = 'studioz';

-- 2. INSERT FRESH SERVICE CATEGORIES
INSERT INTO public.service_categories (id, division, name, slug, display_order)
VALUES 
  ('11111111-1111-4111-a111-111111111111', 'studioz', 'Hindu Wedding', 'hindu-wedding', 1),
  ('22222222-2222-4222-a222-222222222222', 'studioz', 'Christian Wedding', 'christian-wedding', 2),
  ('33333333-3333-4333-a333-333333333333', 'studioz', 'Muslim Wedding', 'muslim-wedding', 3),
  ('44444444-4444-4444-a444-444444444444', 'studioz', 'Special Packages', 'special-functions', 4),
  ('55555555-5555-4555-a555-555555555555', 'studioz', 'Baby & Ceremonies', 'ceremonies', 5),
  ('66666666-6666-4666-a666-666666666666', 'studioz', 'Commercial & Live', 'commercial', 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;

-- 3. INSERT 9 WEDDING PACKAGES (3 RELIGIONS × 3 PLANS)
INSERT INTO public.studioz_services (
  id, service_no, name, category_id, label, price, description, icon, hero_image_url, cover_points, gallery_urls, display_order, is_active
) VALUES 
  -- 🕉️ HINDU WEDDING PACKAGES
  (
    '11111111-1111-4111-a111-000000000101', 101, 'Shubham Package (Plan A)', '11111111-1111-4111-a111-111111111111', 'Hindu Wedding', '₹35,000/-',
    'Essential Hindu Wedding Photography & Videography Package with Album & Deliverables.', 'rings',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output (1 No.)', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    1, true
  ),
  (
    '11111111-1111-4111-a111-000000000102', 102, 'Mangalyam Package (Plan B)', '11111111-1111-4111-a111-111111111111', 'Hindu Wedding', '₹65,000/-',
    'Complete Hindu Wedding Coverage with Candid Photography & Videography, Retouching & Teaser Film.', 'rings',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Candid Photography', 'Candid Videography', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output', 'Candid Teaser Film Output', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    2, true
  ),
  (
    '11111111-1111-4111-a111-000000000103', 103, 'Thirumana Grand Package (Plan C)', '11111111-1111-4111-a111-111111111111', 'Hindu Wedding', '₹90,000/-',
    'VIP Hindu Wedding Experience with Drone Aerial Shots, Stage LED Wall (08x06), Candid Film & Luxury Album.', 'rings',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Candid Photography', 'Candid Videography', 'Drone Photography & Videography', 'LED Wall (08 x 06 Size)', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    3, true
  ),

  -- ✝️ CHRISTIAN WEDDING PACKAGES
  (
    '22222222-2222-4222-a222-000000000104', 104, 'Grace Package (Plan A)', '22222222-2222-4222-a222-222222222222', 'Christian Wedding', '₹35,000/-',
    'Holy Matrimony & Reception Traditional Coverage with Album & Deliverables.', 'cross',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output (1 No.)', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85'],
    4, true
  ),
  (
    '22222222-2222-4222-a222-000000000105', 105, 'Blessing Package (Plan B)', '22222222-2222-4222-a222-222222222222', 'Christian Wedding', '₹65,000/-',
    'Complete Church Ceremony & Reception with Candid Moments, Retouching & Highlight Film.', 'cross',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Candid Photography', 'Candid Videography', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output', 'Candid Video Output', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=85'],
    5, true
  ),
  (
    '22222222-2222-4222-a222-000000000106', 106, 'Eternal Grand Package (Plan C)', '22222222-2222-4222-a222-222222222222', 'Christian Wedding', '₹90,000/-',
    'Grand Christian Wedding Setup with Drone Coverage, Stage LED Wall (08x06), Candid Highlights & Luxury Print.', 'cross',
    'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Candid Photography', 'Candid Videography', 'Drone Photography & Videography', 'LED Wall (08 x 06 Size)', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=1000&q=85'],
    6, true
  ),

  -- ☪️ MUSLIM WEDDING PACKAGES
  (
    '33333333-3333-4333-a333-000000000107', 107, 'Nikah Package (Plan A)', '33333333-3333-4333-a333-333333333333', 'Muslim Wedding', '₹35,000/-',
    'Traditional Nikah Ceremony & Walima Family Reception Coverage with Album.', 'moon',
    'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output (1 No.)', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1000&q=85'],
    7, true
  ),
  (
    '33333333-3333-4333-a333-000000000108', 108, 'Barakah Package (Plan B)', '33333333-3333-4333-a333-333333333333', 'Muslim Wedding', '₹65,000/-',
    'Candid Nikkah & Walima Celebrations with Creative Portraits, Retouching & Teaser Film.', 'moon',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Candid Photography', 'Candid Videography', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output', 'Candid Video Output', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85'],
    8, true
  ),
  (
    '33333333-3333-4333-a333-000000000109', 109, 'Walima Grand Package (Plan C)', '33333333-3333-4333-a333-333333333333', 'Muslim Wedding', '₹90,000/-',
    'Royal Walima Grand Package featuring Drone Cinematic Shots, Stage LED Wall (08x06) & Complete Albums.', 'moon',
    'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Candid Photography', 'Candid Videography', 'Drone Photography & Videography', 'LED Wall (08 x 06 Size)', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85'],
    9, true
  ),

  -- 4. SPECIAL OCCASIONS & FUNCTION PACKAGES
  (
    '44444444-4444-4444-a444-000000000110', 110, 'Engagement Package', '44444444-4444-4444-a444-444444444444', 'Events', '₹25,000/-',
    'Traditional & Couple Shoot Coverage for Nichayathartham & Ring Ceremonies.', 'ring',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'High Quality Album', 'Photos Retouching', 'Couple Photoshoot & Individual Portraits', 'Traditional Video Output', '1 Frame & 1 Calendar', 'Album Bag', 'Pen Drive with Box'],
    ARRAY['https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=85'],
    10, true
  ),
  (
    '44444444-4444-4444-a444-000000000111', 111, 'Reception Package', '44444444-4444-4444-a444-444444444444', 'Events', '₹25,000/-',
    'Grand Reception Evening Stage Coverage, Family Portraits & High Quality Album.', 'sparkles',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'High Quality Album', '1 Frame & 1 Calendar', 'Album Bag', 'Pen Drive with Box'],
    ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85'],
    11, true
  ),
  (
    '44444444-4444-4444-a444-000000000112', 112, 'Birthday Function Package', '44444444-4444-4444-a444-444444444444', 'Events', '₹15,000/-',
    'Fun & Energetic Birthday Party Coverage with Candid Video & High Quality Album.', 'cake',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Candid Videography', 'High Quality Album', 'Photos Retouching', 'Album Bag', 'Pen Drive with Box'],
    ARRAY['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    12, true
  ),
  (
    '44444444-4444-4444-a444-000000000113', 113, 'Grand Opening Package', '44444444-4444-4444-a444-444444444444', 'Commercial', '₹25,000/-',
    'Business & Showroom Launch Coverage with Drone Shots & 2 Instagram Reels.', 'building',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Candid Videography', 'Photos Retouching & Color Grading', 'Drone Shots (Drone Photography & Videography)', '2 Instagram Reels'],
    ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85'],
    13, true
  ),

  -- 5. BABY & CEREMONIES
  (
    '55555555-5555-4555-a555-000000000114', 114, 'Baby Milestone & Portraits', '55555555-5555-4555-a555-555555555555', 'Baby', '₹12,000/-',
    'Gentle & Creative Baby Shoot with Themed Props & High-Res Edited Pictures.', 'baby',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Baby Portraits', 'Creative Setups', 'Family Frames', 'Detail Shots', 'Edited Photos', 'Short Reels'],
    ARRAY['https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85'],
    14, true
  ),
  (
    '55555555-5555-4555-a555-000000000115', 115, 'Baby Shower & Valaikappu', '55555555-5555-4555-a555-555555555555', 'Ceremonies', '₹18,000/-',
    'Capture the Joy, Family and Beautiful Traditional Details of a Valaikappu.', 'gift',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Decor', 'Parents-to-be', 'Family', 'Candid Moments', 'Traditional Ceremonies', 'Highlights'],
    ARRAY['https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=85'],
    15, true
  ),

  -- 6. COMMERCIAL & LIVE
  (
    '66666666-6666-4666-a666-000000000116', 116, 'Live Multi-Cam Broadcasting', '66666666-6666-4666-a666-666666666666', 'Live', '₹35,000/-',
    'Professional 4K Multi-Camera Live Streaming for Grand Weddings & Corporate Events.', 'tv',
    'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Multi-camera Setup', 'Live Switching', 'High Quality Audio', 'Streaming Setup', 'Event Monitoring', 'Live Support'],
    ARRAY['https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=1000&q=85'],
    16, true
  );
