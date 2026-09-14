# KR Digital Marketing & Studioz — Website + Admin Panel

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres DB + Auth)
- Cloudinary (image hosting/optimization)

## Setup
1. `npm install`
2. Copy `.env.local.example` to `.env.local` and fill in your keys
3. Run `kr_schema.sql` in Supabase SQL Editor (creates all 10 tables + RLS)
4. Add admin users manually in Supabase Auth dashboard (no public signup)
5. `npm run dev`

## Folder map
- `src/app/` — public pages (/, /about, /studioz, /digital-marketing, /portfolio) + /admin/* + /api/*
- `src/components/public/` — reusable public-site UI (migrate JS/markup from old static HTML here)
- `src/components/admin/` — reusable admin UI (DataTable, ImageUploader, Sidebar)
- `src/lib/supabase/` — DB clients (browser + server)
- `src/lib/queries/` — one file per table, used by both public pages and admin
- `src/lib/cloudinary.ts` — image upload helper
- `src/types/database.ts` — TypeScript types matching the 10 tables
- `src/middleware.ts` — protects all /admin/* routes, redirects to /admin/login if not signed in

## Migration source
Original static pages: index.html, about.html, studioz.html, digitalmarketing.html, portfolio.html
Each has a matching stub in src/app/ with a comment pointing to what to migrate.
