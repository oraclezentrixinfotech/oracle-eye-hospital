const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function run() {
  await prisma.$executeRawUnsafe(
    "ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS cta_primary_link VARCHAR(500) DEFAULT 'https://www.oracleeyehospital.com/';"
  );
  await prisma.$executeRawUnsafe(
    "ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS custom_links JSONB DEFAULT '[]'::jsonb;"
  );
  await prisma.$executeRawUnsafe(
    "UPDATE seo_pages SET cta_primary_link = 'https://www.oracleeyehospital.com/' WHERE cta_primary_link IS NULL;"
  );
  await prisma.$executeRawUnsafe(
    "UPDATE seo_pages SET custom_links = '[]'::jsonb WHERE custom_links IS NULL;"
  );
  console.log('Migration add_cta_link_and_custom_links executed successfully!');
}

run()
  .catch((e) => {
    console.error('Migration failed:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
