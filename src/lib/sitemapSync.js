import fs from "fs";
import path from "path";
import { normalizeCanonicalUrl } from "@/lib/siteUrl";

const SITEMAP_PATH = path.join(process.cwd(), "public", "sitemap.xml");

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
 * Parses all <url> blocks from public/sitemap.xml
 */
export function getSitemapXmlEntries() {
  if (!fs.existsSync(SITEMAP_PATH)) return [];
  try {
    const content = fs.readFileSync(SITEMAP_PATH, "utf8");
    const urlRegex = /<url>([\s\S]*?)<\/url>/gi;
    const entries = [];
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
      const block = match[1];
      const locMatch = /<loc>([\s\S]*?)<\/loc>/i.exec(block);
      const lastmodMatch = /<lastmod>([\s\S]*?)<\/lastmod>/i.exec(block);
      const changefreqMatch = /<changefreq>([\s\S]*?)<\/changefreq>/i.exec(block);
      const priorityMatch = /<priority>([\s\S]*?)<\/priority>/i.exec(block);

      if (locMatch && locMatch[1]) {
        const rawLoc = locMatch[1].trim();
        const loc = normalizeCanonicalUrl(rawLoc);
        if (loc) {
          entries.push({
            loc,
            lastmod: lastmodMatch ? lastmodMatch[1].trim() : formatDate(new Date()),
            changefreq: changefreqMatch ? changefreqMatch[1].trim() : "weekly",
            priority: priorityMatch ? priorityMatch[1].trim() : "0.9",
          });
        }
      }
    }
    return entries;
  } catch (err) {
    console.warn("Could not read sitemap.xml entries:", err?.message || err);
    return [];
  }
}

/**
 * Rewrites public/sitemap.xml with given entries cleanly
 */
export function writeSitemapXmlEntries(entries) {
  try {
    const seen = new Set();
    const unique = [];

    for (const item of entries) {
      const normLoc = normalizeCanonicalUrl(item.loc);
      if (normLoc && !seen.has(normLoc)) {
        seen.add(normLoc);
        unique.push({
          ...item,
          loc: normLoc,
          lastmod: item.lastmod || formatDate(new Date()),
          changefreq: item.changefreq || "weekly",
          priority: item.priority || "0.9",
        });
      }
    }

    const xmlLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '  <!-- Code-based & Database Published SEO Pages Sitemap -->',
    ];

    for (const item of unique) {
      xmlLines.push('  <url>');
      xmlLines.push(`    <loc>${item.loc}</loc>`);
      xmlLines.push(`    <lastmod>${item.lastmod}</lastmod>`);
      xmlLines.push(`    <changefreq>${item.changefreq}</changefreq>`);
      xmlLines.push(`    <priority>${item.priority}</priority>`);
      xmlLines.push('  </url>');
    }

    xmlLines.push('</urlset>');
    xmlLines.push('');

    fs.writeFileSync(SITEMAP_PATH, xmlLines.join('\n'), 'utf8');
    return true;
  } catch (err) {
    console.warn("Could not write sitemap.xml:", err?.message || err);
    return false;
  }
}

/**
 * Upserts a page into public/sitemap.xml with strictly canonical www URL
 */
export function syncPageToSitemapFile({ slug, canonicalUrl, updatedAt, priority = "0.9", changefreq = "weekly" }) {
  if (!slug) return false;
  const targetLoc = normalizeCanonicalUrl(canonicalUrl || slug);
  if (!targetLoc) return false;

  const entries = getSitemapXmlEntries();
  const index = entries.findIndex((e) => normalizeCanonicalUrl(e.loc).toLowerCase() === targetLoc.toLowerCase());

  const formattedDate = formatDate(updatedAt || new Date());

  if (index >= 0) {
    entries[index] = {
      ...entries[index],
      loc: targetLoc,
      lastmod: formattedDate,
      changefreq: changefreq || entries[index].changefreq || "weekly",
      priority: priority || entries[index].priority || "0.9",
    };
  } else {
    entries.push({
      loc: targetLoc,
      lastmod: formattedDate,
      changefreq,
      priority,
    });
  }

  return writeSitemapXmlEntries(entries);
}
