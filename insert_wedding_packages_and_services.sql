-- =========================================================================
-- KR STUDIOZ: WEDDING PACKAGES & STUDIO SERVICES DATABASE SEED SCRIPT
-- Copy & Run this SQL in your Supabase SQL Editor to populate live database
-- =========================================================================

-- 1. Create or Ensure Categories Exist
INSERT INTO public.service_categories (id, division, name, slug, display_order)
VALUES 
  ('cat-hindu-wedding', 'studioz', 'Hindu Wedding', 'hindu-wedding', 1),
  ('cat-christian-wedding', 'studioz', 'Christian Wedding', 'christian-wedding', 2),
  ('cat-muslim-wedding', 'studioz', 'Muslim Wedding', 'muslim-wedding', 3),
  ('cat-special-functions', 'studioz', 'Special Packages', 'special-functions', 4),
  ('cat-addons', 'studioz', 'Add-on Services', 'addons', 5)
ON CONFLICT (id) DO NOTHING;

-- 2. HINDU WEDDING PACKAGES (3 Plans: Plan A ₹35k, Plan B ₹65k, Plan C ₹90k)
INSERT INTO public.studioz_services (
  id, service_no, name, category_id, label, price, description, icon, hero_image_url, cover_points, gallery_urls, display_order, is_active
) VALUES 
  (
    'hindu-plan-a', 101, 'Shubham Package (Plan A)', 'cat-hindu-wedding', 'Hindu Wedding', '₹35,000/-',
    'Essential Hindu Wedding Photography & Videography Package with Album & Deliverables.', 'rings',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output (1 No.)', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85'],
    1, true
  ),
  (
    'hindu-plan-b', 102, 'Mangalyam Package (Plan B)', 'cat-hindu-wedding', 'Hindu Wedding', '₹65,000/-',
    'Complete Hindu Wedding Coverage with Candid Photography & Videography, Retouching & Teaser Film.', 'rings',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Candid Photography', 'Candid Videography', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output', 'Candid Teaser Film Output', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85'],
    2, true
  ),
  (
    'hindu-plan-c', 103, 'Thirumana Grand Package (Plan C)', 'cat-hindu-wedding', 'Hindu Wedding', '₹90,000/-',
    'VIP Hindu Wedding Experience with Drone Aerial Shots, Stage LED Wall (08x06), Candid Film & Luxury Album.', 'rings',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Candid Photography', 'Candid Videography', 'Drone Photography & Videography', 'LED Wall (08 x 06 Size)', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85'],
    3, true
  ),

-- 3. CHRISTIAN WEDDING PACKAGES (3 Plans: Plan A ₹35k, Plan B ₹65k, Plan C ₹90k)
  (
    'christian-plan-a', 104, 'Grace Package (Plan A)', 'cat-christian-wedding', 'Christian Wedding', '₹35,000/-',
    'Holy Matrimony & Reception Traditional Coverage with Album & Deliverables.', 'cross',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output (1 No.)', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85'],
    4, true
  ),
  (
    'christian-plan-b', 105, 'Blessing Package (Plan B)', 'cat-christian-wedding', 'Christian Wedding', '₹65,000/-',
    'Complete Church Ceremony & Reception with Candid Moments, Retouching & Highlight Film.', 'cross',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Candid Photography', 'Candid Videography', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output', 'Candid Video Output', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=85'],
    5, true
  ),
  (
    'christian-plan-c', 106, 'Eternal Grand Package (Plan C)', 'cat-christian-wedding', 'Christian Wedding', '₹90,000/-',
    'Grand Christian Wedding Setup with Drone Coverage, Stage LED Wall (08x06), Candid Highlights & Luxury Print.', 'cross',
    'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Candid Photography', 'Candid Videography', 'Drone Photography & Videography', 'LED Wall (08 x 06 Size)', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=1000&q=85'],
    6, true
  ),

-- 4. MUSLIM WEDDING PACKAGES (3 Plans: Plan A ₹35k, Plan B ₹65k, Plan C ₹90k)
  (
    'muslim-plan-a', 107, 'Nikah Package (Plan A)', 'cat-muslim-wedding', 'Muslim Wedding', '₹35,000/-',
    'Traditional Nikah Ceremony & Walima Family Reception Coverage with Album.', 'moon',
    'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output (1 No.)', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1000&q=85'],
    7, true
  ),
  (
    'muslim-plan-b', 108, 'Barakah Package (Plan B)', 'cat-muslim-wedding', 'Muslim Wedding', '₹65,000/-',
    'Candid Nikkah & Walima Celebrations with Creative Portraits, Retouching & Teaser Film.', 'moon',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Candid Photography', 'Candid Videography', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output', 'Candid Video Output', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85'],
    8, true
  ),
  (
    'muslim-plan-c', 109, 'Walima Grand Package (Plan C)', 'cat-muslim-wedding', 'Muslim Wedding', '₹90,000/-',
    'Royal Walima Grand Package featuring Drone Cinematic Shots, Stage LED Wall (08x06) & Complete Albums.', 'moon',
    'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'Candid Photography', 'Candid Videography', 'Drone Photography & Videography', 'LED Wall (08 x 06 Size)', 'Couple Photoshoot at Event', 'Individual Photos Retouching', 'High-Quality Album (300 Photos)', 'Album Bag', 'Pen Drive & Custom Box', '3 Photo Frames', '1 Custom Calendar', 'Traditional Video Output', 'Save the Date Poster', 'Save the Date Video'],
    ARRAY['https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85'],
    9, true
  ),

-- 5. SPECIAL OCCASIONS (Engagement, Reception, Birthday, Grand Opening)
  (
    'engagement-package', 110, 'Engagement Package', 'cat-special-functions', 'Events', '₹25,000/-',
    'Traditional & Couple Shoot Coverage for Nichayathartham & Ring Ceremonies.', 'ring',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'High Quality Album', 'Photos Retouching', 'Couple Photoshoot & Individual Portraits', 'Traditional Video Output', '1 Frame & 1 Calendar', 'Album Bag', 'Pen Drive with Box'],
    ARRAY['https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=85'],
    10, true
  ),
  (
    'reception-package', 111, 'Reception Package', 'cat-special-functions', 'Events', '₹25,000/-',
    'Grand Reception Evening Stage Coverage, Family Portraits & High Quality Album.', 'sparkles',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Traditional Videography', 'High Quality Album', '1 Frame & 1 Calendar', 'Album Bag', 'Pen Drive with Box'],
    ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85'],
    11, true
  ),
  (
    'birthday-package', 112, 'Birthday Function Package', 'cat-special-functions', 'Events', '₹15,000/-',
    'Fun & Energetic Birthday Party Coverage with Candid Video & High Quality Album.', 'cake',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Candid Videography', 'High Quality Album', 'Photos Retouching', 'Album Bag', 'Pen Drive with Box'],
    ARRAY['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85'],
    12, true
  ),
  (
    'grand-opening-package', 113, 'Grand Opening Package', 'cat-special-functions', 'Commercial', '₹25,000/-',
    'Business & Showroom Launch Coverage with Drone Shots & 2 Instagram Reels.', 'building',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85',
    ARRAY['Traditional Photography', 'Candid Videography', 'Photos Retouching & Color Grading', 'Drone Shots (Drone Photography & Videography)', '2 Instagram Reels'],
    ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85'],
    13, true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  label = EXCLUDED.label,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  cover_points = EXCLUDED.cover_points,
  hero_image_url = EXCLUDED.hero_image_url,
  is_active = true;
