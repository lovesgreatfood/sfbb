-- Run this SQL in the Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
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