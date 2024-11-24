-- Create storage schema if it doesn't exist
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