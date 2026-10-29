import { prisma } from "@/lib/prisma";

let setupPromise = null;

const SCHEMA_STATEMENTS = [
  // 1. Ensure doctors table exists
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

  // 2. Ensure seo_pages table exists
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

  // 3. Ensure all columns exist (idempotent for upgraded databases)
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

  // 4. Performance Indexes
  `CREATE INDEX IF NOT EXISTS idx_seo_pages_status_slug ON seo_pages(status, slug)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_pages_status_updated_at ON seo_pages(status, updated_at DESC)`
];

const DEFAULT_DOCTORS = [
  {
    name: "Dr. Girjesh Kain",
    role: "Founder & Managing Director",
    qualification: "MS (Ophthalmology), FICO",
    image: "/Assets/img/team/3.png",
    bio: "Dr. Kain is an internationally trained cataract and refractive surgeon with fellowship honors. He has spearheaded modern micro-incision surgery techniques in Moradabad for more than 15 years.",
    badgeText: "25,000+ Surgeries Done",
    profileHref: "/girjesh-kain",
    sortOrder: 1,
    active: true,
  },
  {
    name: "Dr. Rachana",
    role: "Senior Ophthalmologist",
    qualification: "MBBS, MS (Ophthalmology)",
    image: "/Assets/img/team/8.png",
    bio: "Dr. Rachana specializes in comprehensive eye diagnostics, complex cataract procedures, and customized intraocular lens selections to achieve optimal postoperative visual sharpness.",
    badgeText: "Cataract & Comprehensive Care",
    profileHref: "/doctor-team",
    sortOrder: 2,
    active: true,
  },
  {
    name: "Dr. Ramesh Kumar Shukla",
    role: "Senior Glaucoma Specialist",
    qualification: "MBBS, MS (Ophthalmology)",
    image: "/Assets/img/team/4.png",
    bio: "Specialist in early glaucoma detection, medical management, laser trabeculoplasty, and advanced filtration microsurgeries.",
    badgeText: "Glaucoma Specialist",
    profileHref: "/doctor-team",
    sortOrder: 3,
    active: true,
  },
  {
    name: "Dr. Sujata Tomar",
    role: "Consultant Ophthalmologist",
    qualification: "MBBS, MS (Ophthalmology)",
    image: "/Assets/img/team/5.png",
    bio: "Focuses on pediatric ophthalmology, strabismus evaluation, anterior segment conditions, and comprehensive family eye health.",
    badgeText: "Pediatric & General Eye Care",
    profileHref: "/doctor-team",
    sortOrder: 4,
    active: true,
  },
];

export async function ensureDbSchema() {
  if (setupPromise) return setupPromise;

  setupPromise = (async () => {
    try {
      for (const statement of SCHEMA_STATEMENTS) {
        try {
          await prisma.$executeRawUnsafe(statement);
        } catch (stmtErr) {
          console.warn("[ensureDbSchema] Warning running statement:", stmtErr?.message || stmtErr);
        }
      }

      // Check if doctors exist, seed default if empty
      const doctorCount = await prisma.doctor.count().catch(() => 0);
      if (doctorCount === 0) {
        for (const doc of DEFAULT_DOCTORS) {
          try {
            await prisma.doctor.create({ data: doc });
          } catch (docErr) {
            // Ignore single conflict
          }
        }
      }

      return true;
    } catch (err) {
      console.error("[ensureDbSchema] Error ensuring database schema:", err?.message || err);
      setupPromise = null; // Allow retry on next request if it completely failed
      return false;
    }
  })();

  return setupPromise;
}

