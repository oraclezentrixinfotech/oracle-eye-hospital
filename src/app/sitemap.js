import { SITE, SERVICES, DOCTORS } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { SEO_PAGES } from "@/app/(seo_pages)/_lib/pages";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.oracleeyehospital.com";

const STATIC = [
  "",
  "/overview",
  "/chairman-message",
  "/board-of-directors",
  "/testimonials",
  "/doctor-team",
  "/optometrist-team",
  "/services",
  "/photo-gallery",
  "/video-gallery",
  "/blog",
  "/news",
  "/comprehensive-internship-in-optometry",
  "/awards",
  "/publications",
  "/cashless-facility",
  "/charitable-wings",
  "/community-outreach",
  "/career",
  "/contact-us",
  "/appointment",
];

export default async function sitemap() {
  const entries = [
    // Static core pages
    ...STATIC.map((p) => ({
      url: `${SITE_URL}${p}`,
      lastModified: new Date(),
      changeFrequency: p === "" ? "daily" : "monthly",
      priority: p === "" ? 1.0 : 0.8,
    })),

    // Dedicated SEO keyword landing pages
    ...SEO_PAGES.map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: page.lastModified || new Date(),
      changeFrequency: page.changeFrequency || "weekly",
      priority: page.priority || 0.9,
    })),

    // Service pages
    ...SERVICES.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })),

    // Doctor profiles
    ...DOCTORS.map((d) => ({
      url: `${SITE_URL}/doctors/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];

  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, createdAt: true, updatedAt: true },
    });
    posts.forEach((p) =>
      entries.push({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: p.updatedAt || p.createdAt,
        changeFrequency: "monthly",
        priority: 0.6,
      })
    );
  } catch {
    /* DB offline: sitemap still works without posts */
  }

  return entries;
}
