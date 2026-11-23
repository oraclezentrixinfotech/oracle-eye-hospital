import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAdmin, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SITE_URL, normalizeCanonicalUrl } from "@/lib/siteUrl";
import { revalidatePath } from "next/cache";
import {
  getExcludedSitemapUrls,
  addExcludedSitemapUrl,
  removeExcludedSitemapUrl,
  getCustomSitemapEntries,
  saveCustomSitemapEntries,
} from "@/lib/sitemapDb";

export const dynamic = "force-dynamic";

const SITEMAP_PATH = path.join(process.cwd(), "public", "sitemap.xml");
const LEGACY_SITEMAP_PATH = path.join(process.cwd(), "public", "sitemap-custom.xml");

function getSitemapReadPath() {
  if (fs.existsSync(SITEMAP_PATH)) return SITEMAP_PATH;
  if (fs.existsSync(LEGACY_SITEMAP_PATH)) return LEGACY_SITEMAP_PATH;
  return SITEMAP_PATH;
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

function parseSitemapEntries() {
  const entries = [];
  const targetPath = getSitemapReadPath();
  if (!fs.existsSync(targetPath)) {
    return entries;
  }

  try {
    const content = fs.readFileSync(targetPath, "utf8");
    const urlRegex = /<url>([\s\S]*?)<\/url>/gi;
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
      const block = match[1];
      const locMatch = /<loc>([\s\S]*?)<\/loc>/i.exec(block);
      const lastmodMatch = /<lastmod>([\s\S]*?)<\/lastmod>/i.exec(block);
      const changefreqMatch = /<changefreq>([\s\S]*?)<\/changefreq>/i.exec(block);
      const priorityMatch = /<priority>([\s\S]*?)<\/priority>/i.exec(block);

      if (locMatch && locMatch[1]) {
        const loc = normalizeCanonicalUrl(locMatch[1].trim());
        if (loc) {
          entries.push({
            loc,
            lastmod: lastmodMatch ? lastmodMatch[1].trim() : formatDate(new Date()),
            changefreq: changefreqMatch ? changefreqMatch[1].trim() : "weekly",
            priority: priorityMatch ? priorityMatch[1].trim() : "0.8",
          });
        }
      }
    }
  } catch (err) {
    console.warn("parseSitemapEntries warning:", err?.message || err);
  }

  return entries;
}

function writeSitemapEntries(entries) {
  try {
    const xmlLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '  <!-- Custom and Code-Based Static URLs Managed via Admin Panel -->',
    ];

    for (const item of entries) {
      xmlLines.push('  <url>');
      xmlLines.push(`    <loc>${item.loc}</loc>`);
      xmlLines.push(`    <lastmod>${item.lastmod || formatDate(new Date())}</lastmod>`);
      xmlLines.push(`    <changefreq>${item.changefreq || "weekly"}</changefreq>`);
      xmlLines.push(`    <priority>${item.priority || "0.8"}</priority>`);
      xmlLines.push('  </url>');
    }

    xmlLines.push('</urlset>');
    xmlLines.push('');

    fs.writeFileSync(SITEMAP_PATH, xmlLines.join('\n'), 'utf8');
  } catch (fsErr) {
    // In serverless environments (e.g. Vercel), the filesystem is read-only.
    // Database storage handles persistence, so ignore EROFS.
    console.warn("Filesystem write ignored on serverless (read-only):", fsErr?.message || fsErr);
  }
}

// GET: Return all custom sitemap entries + published DB seo pages info
export async function GET() {
  if (!isAdmin()) return unauthorized();

  try {
    const excludedSet = await getExcludedSitemapUrls();
    const dbCustom = await getCustomSitemapEntries();
    const fileEntries = parseSitemapEntries();

    // Merge file entries & DB custom entries, excluding any in excludedSet
    const customMap = new Map();
    for (const item of fileEntries) {
      const normLoc = normalizeCanonicalUrl(item.loc);
      if (normLoc && !excludedSet.has(normLoc.toLowerCase())) {
        customMap.set(normLoc.toLowerCase(), { ...item, loc: normLoc });
      }
    }
    for (const item of dbCustom) {
      const normLoc = normalizeCanonicalUrl(item.loc);
      if (normLoc && !excludedSet.has(normLoc.toLowerCase())) {
        customMap.set(normLoc.toLowerCase(), { ...item, loc: normLoc });
      }
    }

    const customEntries = Array.from(customMap.values());

    let dbSeoPages = [];
    try {
      const allDbPages = await prisma.seoPage.findMany({
        where: { status: "published" },
        select: {
          id: true,
          slug: true,
          h1Title: true,
          canonicalUrl: true,
          updatedAt: true,
          createdAt: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      // Filter out any DB pages that were explicitly excluded
      dbSeoPages = allDbPages.filter((p) => {
        const fullUrl = normalizeCanonicalUrl(p.canonicalUrl || p.slug);
        return !excludedSet.has(fullUrl.toLowerCase());
      });
    } catch (dbErr) {
      console.warn("DB SeoPages fetch note in /api/admin/sitemap:", dbErr?.message || dbErr);
    }

    return NextResponse.json({
      siteUrl: "https://www.oracleeyehospital.com",
      customEntries,
      dbSeoPages: dbSeoPages.map((p) => ({
        ...p,
        fullUrl: normalizeCanonicalUrl(p.canonicalUrl || p.slug),
        lastmod: formatDate(p.updatedAt || p.createdAt),
      })),
    });
  } catch (err) {
    console.error("GET /api/admin/sitemap error:", err);
    return NextResponse.json({ error: "Failed to load sitemap entries." }, { status: 500 });
  }
}

// POST: Add new entry to sitemap
export async function POST(req) {
  if (!isAdmin()) return unauthorized();

  try {
    const body = await req.json().catch(() => ({}));
    let loc = (body.loc || "").trim();
    const changefreq = (body.changefreq || "weekly").trim();
    const priority = (body.priority || "0.8").trim();
    const lastmod = (body.lastmod || formatDate(new Date())).trim();

    if (!loc) {
      return NextResponse.json({ error: "URL path or location is required." }, { status: 400 });
    }

    // Auto-normalize to strict canonical URL
    loc = normalizeCanonicalUrl(loc);

    // If it was in excluded list, un-exclude it
    await removeExcludedSitemapUrl(loc);

    // Save in DB custom entries
    const dbCustom = await getCustomSitemapEntries();
    const filtered = dbCustom.filter((e) => e.loc.toLowerCase() !== loc.toLowerCase());
    filtered.push({ loc, lastmod, changefreq, priority });
    await saveCustomSitemapEntries(filtered);

    // Attempt safe filesystem sync for local dev
    const fileEntries = parseSitemapEntries().filter((e) => e.loc.toLowerCase() !== loc.toLowerCase());
    fileEntries.push({ loc, lastmod, changefreq, priority });
    writeSitemapEntries(fileEntries);

    revalidatePath("/sitemap.xml");
    revalidatePath("/api/sitemap");

    return NextResponse.json({ success: true, entry: { loc, lastmod, changefreq, priority } }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/sitemap error:", err);
    return NextResponse.json({ error: "Failed to add sitemap URL: " + err.message }, { status: 500 });
  }
}

// PUT: Update existing entry
export async function PUT(req) {
  if (!isAdmin()) return unauthorized();

  try {
    const body = await req.json().catch(() => ({}));
    const targetLoc = (body.targetLoc || "").trim();
    let loc = (body.loc || "").trim();
    const changefreq = (body.changefreq || "weekly").trim();
    const priority = (body.priority || "0.8").trim();
    const lastmod = (body.lastmod || formatDate(new Date())).trim();

    if (!targetLoc || !loc) {
      return NextResponse.json({ error: "Both target URL and updated URL are required." }, { status: 400 });
    }

    const normTargetLoc = normalizeCanonicalUrl(targetLoc);
    loc = normalizeCanonicalUrl(loc);

    // If target changed, exclude old and include new
    if (normTargetLoc.toLowerCase() !== loc.toLowerCase()) {
      await addExcludedSitemapUrl(normTargetLoc);
      await removeExcludedSitemapUrl(loc);
    }

    const dbCustom = await getCustomSitemapEntries();
    const nextCustom = dbCustom.filter((e) => e.loc.toLowerCase() !== normTargetLoc.toLowerCase() && e.loc.toLowerCase() !== loc.toLowerCase());
    nextCustom.push({ loc, lastmod, changefreq, priority });
    await saveCustomSitemapEntries(nextCustom);

    // Attempt safe filesystem sync for local dev
    const fileEntries = parseSitemapEntries().filter((e) => e.loc.toLowerCase() !== normTargetLoc.toLowerCase());
    fileEntries.push({ loc, lastmod, changefreq, priority });
    writeSitemapEntries(fileEntries);

    revalidatePath("/sitemap.xml");
    revalidatePath("/api/sitemap");

    return NextResponse.json({ success: true, entry: { loc, lastmod, changefreq, priority } });
  } catch (err) {
    console.error("PUT /api/admin/sitemap error:", err);
    return NextResponse.json({ error: "Failed to update sitemap URL: " + err.message }, { status: 500 });
  }
}

// DELETE: Remove an entry from sitemap
export async function DELETE(req) {
  if (!isAdmin()) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const rawLoc = (searchParams.get("loc") || "").trim();

    if (!rawLoc) {
      return NextResponse.json({ error: "loc query parameter is required." }, { status: 400 });
    }

    const locToDelete = normalizeCanonicalUrl(rawLoc);

    // 1. Add to excluded list in database (persists across serverless)
    await addExcludedSitemapUrl(locToDelete);

    // 2. Remove from DB custom entries if present
    const dbCustom = await getCustomSitemapEntries();
    const nextCustom = dbCustom.filter((e) => e.loc.toLowerCase() !== locToDelete.toLowerCase());
    await saveCustomSitemapEntries(nextCustom);

    // 3. If this URL corresponds to a database SEO page, unpublish it (set to draft)
    try {
      const slugMatch = locToDelete.replace(/^https?:\/\/(www\.)?oracleeyehospital\.com\/?/i, "").replace(/^\/+|\/+$/g, "");
      if (slugMatch) {
        await prisma.seoPage.updateMany({
          where: {
            OR: [
              { slug: slugMatch },
              { canonicalUrl: locToDelete },
            ],
          },
          data: {
            status: "draft",
            updatedAt: new Date(),
          },
        });
      }
    } catch (unpubErr) {
      console.warn("Unpublish DB page note during sitemap delete:", unpubErr?.message || unpubErr);
    }

    // 4. Safe filesystem sync for local dev (won't crash on serverless)
    const fileEntries = parseSitemapEntries().filter((e) => e.loc.toLowerCase() !== locToDelete.toLowerCase());
    writeSitemapEntries(fileEntries);

    revalidatePath("/sitemap.xml");
    revalidatePath("/api/sitemap");
    revalidatePath("/admin/sitemap");
    revalidatePath("/admin/seo-pages");

    return NextResponse.json({ success: true, message: "URL removed from sitemap successfully." });
  } catch (err) {
    console.error("DELETE /api/admin/sitemap error:", err);
    return NextResponse.json({ error: "Failed to delete sitemap entry: " + err.message }, { status: 500 });
  }
}
