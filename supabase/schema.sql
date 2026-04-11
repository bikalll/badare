-- Enable UUID extension if not already active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    price numeric NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    images jsonb DEFAULT '[]'::jsonb,
    variants jsonb DEFAULT '{"sizes": [], "colors": []}'::jsonb,
    "isNew" boolean DEFAULT false,
    "isTrending" boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "orderNumber" text NOT NULL,
    "customerEmail" text NOT NULL,
    items jsonb DEFAULT '[]'::jsonb NOT NULL,
    total numeric NOT NULL,
    status text DEFAULT 'Pending'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configure RLS for Products (Open Read, Auth Write)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Products" 
ON products FOR SELECT 
USING (true);

CREATE POLICY "Admin Write Products" 
ON products FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Configure RLS for Orders (Admin Full Access, Open Insert for Checkouts)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Checkout Insert Orders" 
ON orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin View Orders" 
ON orders FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin Update Orders" 
ON orders FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');


-- Configure Storage Bucket for Product Images
-- This uses Supabase's automatic CDN distribution via the Public URL format
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Public Display Image" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'product-images' );

CREATE POLICY "Admin Image Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

-- Update Schema later added
ALTER TABLE products ADD COLUMN IF NOT EXISTS "editorNotes" text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "stock" numeric DEFAULT 0;

-- FAQ System
CREATE TABLE IF NOT EXISTS faqs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL,
    "order_idx" integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read FAQs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Admin Write FAQs" ON faqs FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Subscribers System
CREATE TABLE IF NOT EXISTS subscribers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Insert Subscribers" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Read Subscribers" ON subscribers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Subscribers" ON subscribers FOR DELETE USING (auth.role() = 'authenticated');
