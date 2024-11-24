-- Create extensions in a safe way
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;

-- Only try to create pg_crypto if it's available
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public;
EXCEPTION
  WHEN undefined_file THEN
    RAISE NOTICE 'pgcrypto extension is not available, skipping...';
END $$;