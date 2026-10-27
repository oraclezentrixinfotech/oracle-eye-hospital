import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/siteUrl";
import { SEO_PAGES as CODE_SEO_PAGES } from "@/app/(seo_pages)/_lib/pages";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

// Fallback core pages
const DEFAULT_STATIC_PAGES = [
  { path: "", changefreq: "daily", priority: "1.0" },
  { path: "/services", changefreq: "weekly", priority: "0.8" },
  { path: "/contact-us", changefreq: "monthly", priority: "0.5" },
];

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(date) {
  if (!date) return new Date().toISOString().split("T")[0];
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

/**
 * Extracts <url>...</url> entries from public/sitemap-custom.xml (or public/sitemap.xml if any)
 */
function parseCustomSitemapXml() {
  const entries = [];
  try {
    const customPath = path.join(process.cwd(), "public", "sitemap-custom.xml");
    const filePath = fs.existsSync(customPath)
      ? customPath
      : path.join(process.cwd(), "public", "sitemap.xml");

    if (!fs.existsSync(filePath)) return entries;

    const content = fs.readFileSync(filePath, "utf8");
    const urlRegex = /<url>([\s\S]*?)<\/url>/gi;
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
      const block = match[1];
      const locMatch = /<loc>([\s\S]*?)<\/loc>/i.exec(block);
      const lastmodMatch = /<lastmod>([\s\S]*?)<\/lastmod>/i.exec(block);
      const changefreqMatch = /<changefreq>([\s\S]*?)<\/changefreq>/i.exec(block);
      const priorityMatch = /<priority>([\s\S]*?)<\/priority>/i.exec(block);

      if (locMatch && locMatch[1]) {
        let loc = locMatch[1].trim();
        try {
          const parsed = new URL(loc);
          loc = `${SITE_URL}${parsed.pathname}`;
        } catch {
          if (!loc.startsWith("http")) {
            loc = `${SITE_URL}/${loc.replace(/^\/+/, "")}`;
          }
        }

        entries.push({
          loc,
          lastmod: lastmodMatch ? lastmodMatch[1].trim() : formatDate(new Date()),
          changefreq: changefreqMatch ? changefreqMatch[1].trim() : "weekly",
          priority: priorityMatch ? priorityMatch[1].trim() : "0.9",
        });
      }
    }
  } catch (err) {
    console.warn("Could not parse sitemap-custom.xml:", err?.message || err);
  }
  return entries;
}

export async function GET() {
  try {
    const urls = [];
    const seenLocs = new Set();

    // 1. Read entries from public/sitemap-custom.xml (Code-based SEO pages and core static URLs)
    const customEntries = parseCustomSitemapXml();

    if (customEntries.length > 0) {
      for (const item of customEntries) {
        if (!seenLocs.has(item.loc)) {
          seenLocs.add(item.loc);
          urls.push(`  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${escapeXml(item.lastmod)}</lastmod>
    <changefreq>${escapeXml(item.changefreq)}</changefreq>
    <priority>${escapeXml(item.priority)}</priority>
  </url>`);
        }
      }
    } else {
      for (const page of DEFAULT_STATIC_PAGES) {
        const fullUrl = `${SITE_URL}${page.path}`;
        if (!seenLocs.has(fullUrl)) {
          seenLocs.add(fullUrl);
          urls.push(`  <url>
    <loc>${escapeXml(fullUrl)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
        }
      }
    }

    // 2. Read registered code SEO pages from src/app/(seo_pages)/_lib/pages.js
    if (Array.isArray(CODE_SEO_PAGES)) {
      for (const codePage of CODE_SEO_PAGES) {
        if (!codePage?.slug) continue;
        const cleanSlug = codePage.slug.replace(/^\/+/, "");
        const fullUrl = `${SITE_URL}/${cleanSlug}`;

        if (!seenLocs.has(fullUrl)) {
          seenLocs.add(fullUrl);
          const lastmod = formatDate(codePage.lastModified || new Date());
          urls.push(`  <url>
    <loc>${escapeXml(fullUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${codePage.changeFrequency || "weekly"}</changefreq>
    <priority>${codePage.priority ? Number(codePage.priority).toFixed(1) : "0.9"}</priority>
  </url>`);
        }
      }
    }

    // 3. Dynamic SEO pages from Database (Admin created/managed)
    try {
      const dbSeoPages = await prisma.seoPage.findMany({
        where: {
          status: "published",
        },
        select: {
          slug: true,
          updatedAt: true,
          createdAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      for (const page of dbSeoPages) {
        if (!page.slug) continue;
        const cleanSlug = page.slug.replace(/^\/+/, "");
        const fullUrl = `${SITE_URL}/${cleanSlug}`;

        if (!seenLocs.has(fullUrl)) {
          seenLocs.add(fullUrl);
          const lastmod = formatDate(page.updatedAt || page.createdAt);
          urls.push(`  <url>
    <loc>${escapeXml(fullUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
        }
      }
    } catch (dbErr) {
      console.warn("DB SEO pages query note in sitemap:", dbErr?.message || dbErr);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`.trim();

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("GET /sitemap.xml error:", err?.message || err);
    return new NextResponse("Failed to generate sitemap. Please try again later.", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
