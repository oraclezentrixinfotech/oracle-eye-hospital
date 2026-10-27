import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";
import { SITE_URL } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

function escapeCsvField(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(req) {
  if (!isAdmin()) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate"); // YYYY-MM-DD
    const endDate = searchParams.get("endDate");     // YYYY-MM-DD

    const whereClause = {};

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        // Start of day
        whereClause.createdAt.gte = new Date(`${startDate}T00:00:00.000Z`);
      }
      if (endDate) {
        // End of day
        whereClause.createdAt.lte = new Date(`${endDate}T23:59:59.999Z`);
      }
    }

    // Fetch DB SEO Pages with date filter
    const dbPages = await prisma.seoPage.findMany({
      where: whereClause,
      select: {
        h1Title: true,
        metaTitle: true,
        slug: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const entries = [];
    const seenUrls = new Set();

    for (const p of dbPages) {
      const fullUrl = `${SITE_URL}/${p.slug.replace(/^\/+/, "")}`;
      if (!seenUrls.has(fullUrl.toLowerCase())) {
        seenUrls.add(fullUrl.toLowerCase());
        entries.push({
          title: p.h1Title || p.metaTitle || p.slug,
          url: fullUrl,
        });
      }
    }

    // CSV Headers strictly: Title and URL
    const headers = ["Title", "URL"];
    const csvRows = [headers.map(escapeCsvField).join(",")];

    for (const item of entries) {
      csvRows.push([escapeCsvField(item.title), escapeCsvField(item.url)].join(","));
    }

    // Prepend UTF-8 BOM so Excel opens it with proper encoding
    const csvContent = "\uFEFF" + csvRows.join("\r\n");

    let filename = `seo-pages-export`;
    if (startDate && endDate) {
      filename += `-${startDate}-to-${endDate}`;
    } else if (startDate) {
      filename += `-from-${startDate}`;
    } else if (endDate) {
      filename += `-until-${endDate}`;
    } else {
      filename += `-all-${new Date().toISOString().split("T")[0]}`;
    }
    filename += `.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("GET /api/admin/seo-pages/export error:", err);
    return NextResponse.json({ error: "Failed to export SEO pages sheet." }, { status: 500 });
  }
}
