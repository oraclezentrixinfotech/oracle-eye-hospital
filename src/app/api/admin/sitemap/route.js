import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAdmin, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/siteUrl";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const SITEMAP_PATH = path.join(process.cwd(), "public", "sitemap-custom.xml");

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
  if (!fs.existsSync(SITEMAP_PATH)) {
    return entries;
  }

  const content = fs.readFileSync(SITEMAP_PATH, "utf8");
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
      entries.push({
        loc,
        lastmod: lastmodMatch ? lastmodMatch[1].trim() : formatDate(new Date()),
        changefreq: changefreqMatch ? changefreqMatch[1].trim() : "weekly",
        priority: priorityMatch ? priorityMatch[1].trim() : "0.8",
      });
    }
  }

  return entries;
}

function writeSitemapEntries(entries) {
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
}

// GET: Return all custom sitemap entries + published DB seo pages info
export async function GET() {
  if (!isAdmin()) return unauthorized();

  try {
    const customEntries = parseSitemapEntries();

    let dbSeoPages = [];
    try {
      dbSeoPages = await prisma.seoPage.findMany({
        where: { status: "published" },
        select: {
          id: true,
          slug: true,
          h1Title: true,
          updatedAt: true,
          createdAt: true,
        },
        orderBy: { updatedAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("DB SeoPages fetch note in /api/admin/sitemap:", dbErr?.message || dbErr);
    }

    return NextResponse.json({
      siteUrl: SITE_URL,
      customEntries,
      dbSeoPages: dbSeoPages.map((p) => ({
        ...p,
        fullUrl: `${SITE_URL}/${p.slug.replace(/^\/+/, "")}`,
        lastmod: formatDate(p.updatedAt || p.createdAt),
      })),
    });
  } catch (err) {
    console.error("GET /api/admin/sitemap error:", err);
    return NextResponse.json({ error: "Failed to load sitemap entries." }, { status: 500 });
  }
}

// POST: Add new entry to sitemap-custom.xml
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

    // Auto-normalize relative or absolute URL
    if (!loc.startsWith("http://") && !loc.startsWith("https://")) {
      const cleanPath = loc.startsWith("/") ? loc : `/${loc}`;
      loc = `${SITE_URL}${cleanPath}`;
    }

    const currentEntries = parseSitemapEntries();

    // Check duplicate
    if (currentEntries.some((e) => e.loc.toLowerCase() === loc.toLowerCase())) {
      return NextResponse.json({ error: "This URL already exists in the sitemap." }, { status: 409 });
    }

    currentEntries.push({
      loc,
      lastmod,
      changefreq,
      priority,
    });

    writeSitemapEntries(currentEntries);
    revalidatePath("/sitemap.xml");

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

    if (!loc.startsWith("http://") && !loc.startsWith("https://")) {
      const cleanPath = loc.startsWith("/") ? loc : `/${loc}`;
      loc = `${SITE_URL}${cleanPath}`;
    }

    const currentEntries = parseSitemapEntries();
    const index = currentEntries.findIndex((e) => e.loc.toLowerCase() === targetLoc.toLowerCase());

    if (index === -1) {
      return NextResponse.json({ error: "Target URL not found in sitemap." }, { status: 404 });
    }

    currentEntries[index] = {
      loc,
      lastmod,
      changefreq,
      priority,
    };

    writeSitemapEntries(currentEntries);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true, entry: currentEntries[index] });
  } catch (err) {
    console.error("PUT /api/admin/sitemap error:", err);
    return NextResponse.json({ error: "Failed to update sitemap URL: " + err.message }, { status: 500 });
  }
}

// DELETE: Remove an entry from sitemap-custom.xml
export async function DELETE(req) {
  if (!isAdmin()) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const locToDelete = (searchParams.get("loc") || "").trim();

    if (!locToDelete) {
      return NextResponse.json({ error: "loc query parameter is required." }, { status: 400 });
    }

    const currentEntries = parseSitemapEntries();
    const nextEntries = currentEntries.filter((e) => e.loc.toLowerCase() !== locToDelete.toLowerCase());

    if (nextEntries.length === currentEntries.length) {
      return NextResponse.json({ error: "URL not found in custom sitemap." }, { status: 404 });
    }

    writeSitemapEntries(nextEntries);
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ success: true, message: "URL removed from sitemap." });
  } catch (err) {
    console.error("DELETE /api/admin/sitemap error:", err);
    return NextResponse.json({ error: "Failed to delete sitemap entry: " + err.message }, { status: 500 });
  }
}
