-- ==============================================================================
-- ORACLE EYE HOSPITAL - SEO PAGES COMPLETE SQL SCRIPT
-- Database: PostgreSQL (Neon / Supabase / AWS RDS / Localhost)
-- ==============================================================================

-- ==============================================================================
-- 1. CREATE seo_pages TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS seo_pages (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'draft' NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    keywords TEXT,
    canonical_url VARCHAR(500),
    og_image VARCHAR(500),
    hero_badge VARCHAR(255),
    h1_title VARCHAR(255) NOT NULL,
    hero_subtitle TEXT,
    hero_image VARCHAR(500),
    hero_chips JSONB DEFAULT '[]'::jsonb,
    cta_primary_text VARCHAR(100) DEFAULT 'Book Consultation',
    cta_phone VARCHAR(50) DEFAULT '+919458422606',
    sections JSONB DEFAULT '[]'::jsonb,
    doctor_ids INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    faqs JSONB DEFAULT '[]'::jsonb,
    custom_schema TEXT,
    schema_json JSONB,
    schema_updated_at TIMESTAMP,
    related_ids INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 2. CREATE INDEXES (Performance for sitemap & slug lookups)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_seo_pages_status_slug ON seo_pages(status, slug);
CREATE INDEX IF NOT EXISTS idx_seo_pages_status_updated_at ON seo_pages(status, updated_at DESC);

-- ==============================================================================
-- 3. MIGRATION COMMANDS (Agar table pehle se bani ho aur columns add karne ho)
-- ==============================================================================
ALTER TABLE seo_pages
    ADD COLUMN IF NOT EXISTS schema_json JSONB,
    ADD COLUMN IF NOT EXISTS schema_updated_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- ==============================================================================
-- 4. COMMONLY USED SQL COMMANDS FOR SEO PAGES
-- ==============================================================================

-- A. All Published SEO Pages check karna (Jo sitemap.xml me show hoti hain):
-- SELECT id, slug, status, h1_title, updated_at FROM seo_pages WHERE status = 'published' ORDER BY updated_at DESC;

-- B. Kisi page ko Publish karna (Sitemap me show karne ke liye):
-- UPDATE seo_pages SET status = 'published', updated_at = NOW() WHERE slug = 'lasik-surgery-in-moradabad';

-- C. Kisi page ko Unpublish / Draft karna (Sitemap se turant hatane ke liye):
-- UPDATE seo_pages SET status = 'draft', updated_at = NOW() WHERE slug = 'lasik-surgery-in-moradabad';

-- D. Kisi page ko delete karna:
-- DELETE FROM seo_pages WHERE slug = 'lasik-surgery-in-moradabad';

-- E. All Draft pages dekhna:
-- SELECT id, slug, h1_title, created_at FROM seo_pages WHERE status = 'draft';

-- F. JSON Schema check karna kisi page ka:
-- SELECT slug, schema_json FROM seo_pages WHERE slug = 'cataract-surgery-in-moradabad';

-- G. Total count check karna (Published vs Draft):
-- SELECT status, COUNT(*) FROM seo_pages GROUP BY status;
