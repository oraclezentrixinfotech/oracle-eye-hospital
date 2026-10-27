-- ==============================================================================
-- Migration: Add is_active and ensure updated_at exists on seo_pages table
-- Target: PostgreSQL (Local & Live / Production)
-- Note: Safe to execute multiple times (idempotent)
-- ==============================================================================

-- 1. Add is_active and updated_at columns if not present
ALTER TABLE seo_pages
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- 2. Backfill nulls if any exist on existing records
UPDATE seo_pages
SET is_active = true
WHERE is_active IS NULL;

UPDATE seo_pages
SET updated_at = NOW()
WHERE updated_at IS NULL;

-- 3. If a record has status = 'draft', keep is_active in sync (optional alignment)
UPDATE seo_pages
SET is_active = (status = 'published')
WHERE status IS NOT NULL;
