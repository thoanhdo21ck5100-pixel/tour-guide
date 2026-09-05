-- Supabase Schema for Da Nang Private Tour Guide Platform
-- Run this in your Supabase SQL Editor to set up database tables & storage

-- 1. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    kana TEXT NOT NULL,
    contact_type TEXT NOT NULL CHECK (contact_type IN ('line', 'instagram', 'email', 'whatsapp')),
    contact_value TEXT NOT NULL,
    tour_slug TEXT NOT NULL,
    tour_name TEXT,
    preferred_date DATE NOT NULL,
    alternative_date DATE,
    adults_count INTEGER NOT NULL DEFAULT 1 CHECK (adults_count >= 1),
    children_count INTEGER NOT NULL DEFAULT 0 CHECK (children_count >= 0),
    hotel_name TEXT,
    special_requests TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_preferred_date ON public.bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- 2. Create Guide Availability Table with Audit Tracking
CREATE TABLE IF NOT EXISTS public.availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE UNIQUE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'limited', 'booked')),
    remaining_slots INTEGER DEFAULT 1,
    note TEXT,
    modified_by TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_availability_date ON public.availability(date);

-- 3. Create Tours Table for CMS
CREATE TABLE IF NOT EXISTS public.tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('classic', 'food', 'custom', 'family')),
    category_label TEXT NOT NULL,
    duration TEXT NOT NULL,
    price_jpy INTEGER NOT NULL CHECK (price_jpy >= 0),
    price_vnd INTEGER NOT NULL CHECK (price_vnd >= 0),
    price_note TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    hero_image TEXT NOT NULL,
    badge TEXT,
    is_featured BOOLEAN DEFAULT false,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    highlights JSONB DEFAULT '[]'::jsonb,
    itinerary JSONB DEFAULT '[]'::jsonb,
    included JSONB DEFAULT '[]'::jsonb,
    excluded JSONB DEFAULT '[]'::jsonb,
    meeting_place TEXT NOT NULL,
    cancellation_policy TEXT NOT NULL,
    recommend_for JSONB DEFAULT '[]'::jsonb,
    modified_by TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tours_slug ON public.tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_category ON public.tours(category);

-- 4. Create Blog Posts Table for CMS
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    cover_image TEXT NOT NULL,
    published_at DATE NOT NULL DEFAULT CURRENT_DATE,
    reading_time TEXT NOT NULL DEFAULT '5分で読める',
    featured BOOLEAN DEFAULT false,
    author JSONB DEFAULT '{"name": "アン トー (Anh Tho)", "role": "ダナン出身 / 日本語能力試験N1", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}'::jsonb,
    content JSONB NOT NULL,
    related_tour_slug TEXT,
    modified_by TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public Read
CREATE POLICY "Public can view availability" ON public.availability FOR SELECT USING (true);
CREATE POLICY "Public can view tours" ON public.tours FOR SELECT USING (true);
CREATE POLICY "Public can view blog posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Public can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Authenticated Admin Access
CREATE POLICY "Admins have full access to bookings" ON public.bookings FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to availability" ON public.availability FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to tours" ON public.tours FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to blog posts" ON public.blog_posts FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 5. Supabase Storage Bucket Setup for 'guide-assets'
INSERT INTO storage.buckets (id, name, public)
VALUES ('guide-assets', 'guide-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images from guide-assets
CREATE POLICY "Public can view guide assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'guide-assets');

-- Authenticated admin can upload images to guide-assets
CREATE POLICY "Admins can upload to guide assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'guide-assets' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));

-- Authenticated admin can delete images from guide-assets
CREATE POLICY "Admins can delete guide assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'guide-assets' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));
