-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure storage schema exists
CREATE SCHEMA IF NOT EXISTS storage;

-- Create the documents bucket if it doesn't exist
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Documents bucket upload policy" ON storage.objects;
DROP POLICY IF EXISTS "Documents bucket select policy" ON storage.objects;
DROP POLICY IF EXISTS "Documents bucket delete policy" ON storage.objects;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create upload policy
CREATE POLICY "Documents bucket upload policy"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = SPLIT_PART(name, '/', 1)
);

-- Create select policy
CREATE POLICY "Documents bucket select policy"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = SPLIT_PART(name, '/', 1)
);

-- Create delete policy
CREATE POLICY "Documents bucket delete policy"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = SPLIT_PART(name, '/', 1)
);