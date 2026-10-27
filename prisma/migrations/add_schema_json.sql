-- Migration: Add schema_json and schema_updated_at to seo_pages table
-- Safe to execute multiple times on local and live PostgreSQL databases

ALTER TABLE seo_pages
  ADD COLUMN IF NOT EXISTS schema_json JSONB,
  ADD COLUMN IF NOT EXISTS schema_updated_at TIMESTAMP;

-- If existing records had custom_schema filled, optionally migrate valid JSON data into schema_json
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'seo_pages' AND column_name = 'custom_schema'
  ) THEN
    UPDATE seo_pages 
    SET schema_json = custom_schema::jsonb,
        schema_updated_at = NOW()
    WHERE custom_schema IS NOT NULL 
      AND custom_schema != '' 
      AND schema_json IS NULL
      AND custom_schema ~ '^\s*[\{\[]';
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Ignore parse errors for malformed legacy text
  NULL;
END $$;
