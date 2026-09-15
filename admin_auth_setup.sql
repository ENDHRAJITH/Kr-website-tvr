-- ===================================================
-- KR WEBSITE ADMIN AUTHENTICATION SCHEMA & SEED DATA
-- Run this script in Supabase SQL Editor
-- ===================================================

-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL, -- 'super_admin' or 'admin'
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
DROP POLICY IF EXISTS "Allow service role full access on admin_users" ON public.admin_users;
CREATE POLICY "Allow service role full access on admin_users"
    ON public.admin_users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 4. Insert / Reset Default Super Admin User
-- Credentials:
-- Username: admin
-- Email: admin@krdigitalstudioz.com
-- Password: admin123
INSERT INTO public.admin_users (username, email, password_hash, name, role, is_active)
VALUES (
    'admin',
    'admin@krdigitalstudioz.com',
    '$2b$10$5aGuT7Nu2FvFI8aEuFV/feTa4vI35DrqmemPAYfv9Q5DHX91SOwHe', -- Valid Bcrypt hash of 'admin123'
    'KR Super Admin',
    'super_admin',
    true
)
ON CONFLICT (username) DO UPDATE
SET password_hash = '$2b$10$5aGuT7Nu2FvFI8aEuFV/feTa4vI35DrqmemPAYfv9Q5DHX91SOwHe',
    email = 'admin@krdigitalstudioz.com',
    is_active = true;
