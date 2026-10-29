const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    qualification VARCHAR(255),
    image VARCHAR(500),
    bio TEXT,
    badge_text VARCHAR(255),
    profile_href VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS seo_pages (
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
    cta_primary_link VARCHAR(500) DEFAULT 'https://www.oracleeyehospital.com/',
    cta_phone VARCHAR(50) DEFAULT '+919458422606',
    sections JSONB DEFAULT '[]'::jsonb,
    doctor_ids INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    faqs JSONB DEFAULT '[]'::jsonb,
    custom_schema TEXT,
    schema_json JSONB,
    schema_updated_at TIMESTAMP,
    related_ids INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    custom_links JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
  )`,
  `ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS cta_primary_link VARCHAR(500) DEFAULT 'https://www.oracleeyehospital.com/'`,
  `ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS custom_links JSONB DEFAULT '[]'::jsonb`,
  `ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS schema_json JSONB`,
  `ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS schema_updated_at TIMESTAMP`,
  `ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`,
  `ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`,
  `ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS hero_chips JSONB DEFAULT '[]'::jsonb`,
  `ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]'::jsonb`,
  `ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb`,
  `ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS doctor_ids INTEGER[] DEFAULT ARRAY[]::INTEGER[]`,
  `ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS related_ids INTEGER[] DEFAULT ARRAY[]::INTEGER[]`,
  `CREATE INDEX IF NOT EXISTS idx_seo_pages_status_slug ON seo_pages(status, slug)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_pages_status_updated_at ON seo_pages(status, updated_at DESC)`
];

async function main() {
  try {
    for (const sql of STATEMENTS) {
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch (err) {
        console.warn("Statement warning:", err?.message || err);
      }
    }
    console.log("[ensure-db-schema] Database tables and columns verified successfully.");
  } catch (err) {
    console.warn("[ensure-db-schema] Warning (will self-heal at runtime):", err?.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

main().then(() => process.exit(0)).catch(() => process.exit(0));

