-- Create document_analysis table if it doesn't exist
CREATE TABLE IF NOT EXISTS document_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    analysis JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE document_analysis ENABLE ROW LEVEL SECURITY;

-- Create policy for document analysis
CREATE POLICY "Users can access their own document analysis"
ON document_analysis
FOR ALL
TO authenticated
USING (business_id = auth.uid());