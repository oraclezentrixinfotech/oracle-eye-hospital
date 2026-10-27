-- Migration: Add cta_primary_link and custom_links to seo_pages table
-- Safe to execute multiple times on local and live PostgreSQL databases

ALTER TABLE seo_pages
  ADD COLUMN IF NOT EXISTS cta_primary_link VARCHAR(500) DEFAULT 'https://www.oracleeyehospital.com/',
  ADD COLUMN IF NOT EXISTS custom_links JSONB DEFAULT '[]'::jsonb;

-- Backfill existing NULLs with default value
UPDATE seo_pages
SET cta_primary_link = 'https://www.oracleeyehospital.com/'
WHERE cta_primary_link IS NULL;

UPDATE seo_pages
SET custom_links = '[]'::jsonb
WHERE custom_links IS NULL;
