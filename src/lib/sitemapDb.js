import { prisma } from "@/lib/prisma";
import { normalizeCanonicalUrl } from "@/lib/siteUrl";

const CUSTOM_SITEMAP_KEY = "custom_sitemap_urls";
const EXCLUDED_SITEMAP_KEY = "excluded_sitemap_urls";

/**
 * Returns a Set of lowercase normalized URLs that have been removed/excluded from sitemap
 */
export async function getExcludedSitemapUrls() {
  try {
    const row = await prisma.setting.findUnique({
      where: { key: EXCLUDED_SITEMAP_KEY },
    });
    if (!row || !row.value) return new Set();
    const arr = JSON.parse(row.value);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.map((u) => normalizeCanonicalUrl(u).toLowerCase()));
  } catch (err) {
    console.warn("getExcludedSitemapUrls warning:", err?.message || err);
    return new Set();
  }
}

/**
 * Adds a URL or slug to the excluded sitemap list in DB
 */
export async function addExcludedSitemapUrl(urlOrSlug) {
  try {
    const norm = normalizeCanonicalUrl(urlOrSlug).toLowerCase();
    if (!norm) return;

    const excluded = await getExcludedSitemapUrls();
    excluded.add(norm);

    const arr = Array.from(excluded);
    await prisma.setting.upsert({
      where: { key: EXCLUDED_SITEMAP_KEY },
      update: { value: JSON.stringify(arr) },
      create: { key: EXCLUDED_SITEMAP_KEY, value: JSON.stringify(arr) },
    });
  } catch (err) {
    console.warn("addExcludedSitemapUrl warning:", err?.message || err);
  }
}

/**
 * Removes a URL or slug from the excluded sitemap list in DB
 */
export async function removeExcludedSitemapUrl(urlOrSlug) {
  try {
    const norm = normalizeCanonicalUrl(urlOrSlug).toLowerCase();
    if (!norm) return;

    const excluded = await getExcludedSitemapUrls();
    if (!excluded.has(norm)) return;

    excluded.delete(norm);
    const arr = Array.from(excluded);
    await prisma.setting.upsert({
      where: { key: EXCLUDED_SITEMAP_KEY },
      update: { value: JSON.stringify(arr) },
      create: { key: EXCLUDED_SITEMAP_KEY, value: JSON.stringify(arr) },
    });
  } catch (err) {
    console.warn("removeExcludedSitemapUrl warning:", err?.message || err);
  }
}

/**
 * Retrieves custom sitemap URLs stored in DB
 */
export async function getCustomSitemapEntries() {
  try {
    const row = await prisma.setting.findUnique({
      where: { key: CUSTOM_SITEMAP_KEY },
    });
    if (!row || !row.value) return [];
    const arr = JSON.parse(row.value);
    if (!Array.isArray(arr)) return [];

    return arr.map((item) => ({
      loc: normalizeCanonicalUrl(item.loc),
      lastmod: item.lastmod || new Date().toISOString().split("T")[0],
      changefreq: item.changefreq || "weekly",
      priority: item.priority || "0.8",
    }));
  } catch (err) {
    console.warn("getCustomSitemapEntries warning:", err?.message || err);
    return [];
  }
}

/**
 * Upserts/saves custom sitemap URLs in DB
 */
export async function saveCustomSitemapEntries(entries) {
  try {
    const cleanEntries = (entries || []).map((item) => ({
      loc: normalizeCanonicalUrl(item.loc),
      lastmod: item.lastmod || new Date().toISOString().split("T")[0],
      changefreq: item.changefreq || "weekly",
      priority: item.priority || "0.8",
    }));

    await prisma.setting.upsert({
      where: { key: CUSTOM_SITEMAP_KEY },
      update: { value: JSON.stringify(cleanEntries) },
      create: { key: CUSTOM_SITEMAP_KEY, value: JSON.stringify(cleanEntries) },
    });
    return true;
  } catch (err) {
    console.warn("saveCustomSitemapEntries warning:", err?.message || err);
    return false;
  }
}
