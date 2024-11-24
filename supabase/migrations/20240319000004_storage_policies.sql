-- Ensure storage schema exists
CREATE SCHEMA IF NOT EXISTS storage;

-- Create the documents bucket if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'documents'
    ) THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'documents',
            'documents',
            false,
            10485760,  -- 10MB
            ARRAY['application/pdf']::text[]
        );
    END IF;
END $$;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to read their documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their documents" ON storage.objects;

-- Create upload policy
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'documents' AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

-- Create read policy
CREATE POLICY "Allow users to read their documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents' AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

-- Create delete policy
CREATE POLICY "Allow users to delete their documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'documents' AND
    (auth.uid())::text = SPLIT_PART(name, '/', 1)
);