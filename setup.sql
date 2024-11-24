-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to read their documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their documents" ON storage.objects;

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    contact_person TEXT,
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    start_date DATE NOT NULL,
    phone TEXT,
    emergency_contact TEXT,
    food_hygiene_level INTEGER,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create training_records table
CREATE TABLE IF NOT EXISTS training_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    training_type TEXT NOT NULL,
    completion_date DATE NOT NULL,
    expiry_date DATE,
    certificate_url TEXT,
    notes TEXT,
    verified_by UUID REFERENCES staff(id),
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create temperatures table
CREATE TABLE IF NOT EXISTS temperatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL,
    item_name TEXT NOT NULL,
    temperature DECIMAL NOT NULL,
    checked_by TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cleaning table
CREATE TABLE IF NOT EXISTS cleaning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL,
    area TEXT NOT NULL,
    completed_by TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    verified_by TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    products TEXT[] NOT NULL DEFAULT '{}',
    certifications TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create delivery_records table
CREATE TABLE IF NOT EXISTS delivery_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL,
    temperature DECIMAL,
    accepted_by TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    uploaded_by TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create document_analysis table
CREATE TABLE IF NOT EXISTS document_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    analysis JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE temperatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own business data"
ON businesses FOR ALL
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view their business staff"
ON staff FOR ALL
USING (business_id::text = auth.uid()::text);

CREATE POLICY "Users can view their business training records"
ON training_records FOR ALL
USING (business_id::text = auth.uid()::text);

CREATE POLICY "Users can view their business temperatures"
ON temperatures FOR ALL
USING (business_id::text = auth.uid()::text);

CREATE POLICY "Users can view their business cleaning records"
ON cleaning FOR ALL
USING (business_id::text = auth.uid()::text);

CREATE POLICY "Users can view their business suppliers"
ON suppliers FOR ALL
USING (business_id::text = auth.uid()::text);

CREATE POLICY "Users can view their business delivery records"
ON delivery_records FOR ALL
USING (business_id::text = auth.uid()::text);

CREATE POLICY "Users can view their business documents"
ON documents FOR ALL
USING (business_id::text = auth.uid()::text);

CREATE POLICY "Users can view their document analysis"
ON document_analysis FOR ALL
USING (business_id::text = auth.uid()::text);

-- Ensure storage schema exists
CREATE SCHEMA IF NOT EXISTS storage;

-- Create the documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    false,
    10485760,  -- 10MB
    ARRAY['application/pdf']::text[]
) ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create new storage policies
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = SPLIT_PART(name, '/', 1)
);

CREATE POLICY "Allow users to read their documents"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'documents' AND
    auth.uid()::text = SPLIT_PART(name, '/', 1)
);

CREATE POLICY "Allow users to delete their documents"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'documents' AND
    auth.uid()::text = SPLIT_PART(name, '/', 1)
);