-- ============================================================
-- KR DIGITAL MARKETING & STUDIOZ — SUPABASE SCHEMA
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- URL: https://supabase.com/dashboard/project/vdqajlvcaqudzzjsnntd/sql/new
-- ============================================================

-- 1. SERVICE CATEGORIES (shared by studioz + marketing)
create table if not exists service_categories (
  id uuid primary key default gen_random_uuid(),
  division text not null check (division in ('studioz', 'marketing')),
  name text not null,
  slug text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 2. STUDIOZ SERVICES
create table if not exists studioz_services (
  id uuid primary key default gen_random_uuid(),
  service_no int,
  name text not null,
  category_id uuid references service_categories(id) on delete set null,
  label text,
  price text,
  description text,
  icon text,
  hero_image_url text,
  cover_points text[],
  gallery_urls text[],
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 3. MARKETING SERVICES
create table if not exists marketing_services (
  id uuid primary key default gen_random_uuid(),
  service_no int,
  name text not null,
  subtitle text,
  description text,
  price text,
  price_unit text,
  features text[],
  benefits text[],
  project_tag text,
  category_id uuid references service_categories(id) on delete set null,
  links jsonb,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 4. PORTFOLIO ITEMS
create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('studioz', 'digital')),
  cover_image_url text,
  gallery_urls text[],
  description text,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 5. TEAM MEMBERS
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  photo_url text,
  bio text,
  social_links jsonb,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 6. TESTIMONIALS
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating int check (rating between 1 and 5),
  photo_url text,
  is_active boolean default true,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 7. CLIENT LOGOS
create table if not exists client_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  link text,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 8. SITE STATS
create table if not exists site_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  icon text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 9. ENQUIRIES
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  event_type text,
  message text,
  status text default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz default now()
);

-- 10. ENQUIRY ITEMS
create table if not exists enquiry_items (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid references enquiries(id) on delete cascade,
  service_division text check (service_division in ('studioz', 'marketing')),
  service_id uuid,
  service_name text,
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY
alter table service_categories enable row level security;
alter table studioz_services enable row level security;
alter table marketing_services enable row level security;
alter table portfolio_items enable row level security;
alter table team_members enable row level security;
alter table testimonials enable row level security;
alter table client_logos enable row level security;
alter table site_stats enable row level security;
alter table enquiries enable row level security;
alter table enquiry_items enable row level security;

-- Public read policies
drop policy if exists "public read" on service_categories;
create policy "public read" on service_categories for select using (true);

drop policy if exists "public read" on studioz_services;
create policy "public read" on studioz_services for select using (true);

drop policy if exists "public read" on marketing_services;
create policy "public read" on marketing_services for select using (true);

drop policy if exists "public read" on portfolio_items;
create policy "public read" on portfolio_items for select using (true);

drop policy if exists "public read" on team_members;
create policy "public read" on team_members for select using (true);

drop policy if exists "public read" on testimonials;
create policy "public read" on testimonials for select using (true);

drop policy if exists "public read" on client_logos;
create policy "public read" on client_logos for select using (true);

drop policy if exists "public read" on site_stats;
create policy "public read" on site_stats for select using (true);

-- Admin write policies
drop policy if exists "admin write" on service_categories;
create policy "admin write" on service_categories for all using (auth.role() = 'authenticated');

drop policy if exists "admin write" on studioz_services;
create policy "admin write" on studioz_services for all using (auth.role() = 'authenticated');

drop policy if exists "admin write" on marketing_services;
create policy "admin write" on marketing_services for all using (auth.role() = 'authenticated');

drop policy if exists "admin write" on portfolio_items;
create policy "admin write" on portfolio_items for all using (auth.role() = 'authenticated');

drop policy if exists "admin write" on team_members;
create policy "admin write" on team_members for all using (auth.role() = 'authenticated');

drop policy if exists "admin write" on testimonials;
create policy "admin write" on testimonials for all using (auth.role() = 'authenticated');

drop policy if exists "admin write" on client_logos;
create policy "admin write" on client_logos for all using (auth.role() = 'authenticated');

drop policy if exists "admin write" on site_stats;
create policy "admin write" on site_stats for all using (auth.role() = 'authenticated');

-- Enquiries policies
drop policy if exists "public insert enquiry" on enquiries;
create policy "public insert enquiry" on enquiries for insert with check (true);

drop policy if exists "admin read enquiry" on enquiries;
create policy "admin read enquiry" on enquiries for select using (auth.role() = 'authenticated');

drop policy if exists "admin update enquiry" on enquiries;
create policy "admin update enquiry" on enquiries for update using (auth.role() = 'authenticated');

drop policy if exists "public insert enquiry item" on enquiry_items;
create policy "public insert enquiry item" on enquiry_items for insert with check (true);

drop policy if exists "admin read enquiry item" on enquiry_items;
create policy "admin read enquiry item" on enquiry_items for select using (auth.role() = 'authenticated');
