/**
 * Central registry of SEO landing pages for Oracle Eye Hospital.
 * Location: app/(seo_pages)/_lib/pages.js
 *
 * Every new target keyword page MUST be registered here:
 * 1. app/sitemap.js automatically reads this file and generates canonical clean URLs (without 'seo_pages').
 * 2. Cross-linking components consume this registry for contextual internal links.
 */

export const SEO_PAGES = [
  {
    slug: "cataract-surgery-in-moradabad",
    keyword: "Cataract Surgery in Moradabad",
    h1: "Cataract Surgery in Moradabad",
    title: "Cataract Surgery in Moradabad | Oracle Eye Hospital",
    description:
      "Looking for advanced cataract surgery in Moradabad? Oracle Eye Hospital offers stitchless phacoemulsification, robotic precision & premium IOLs. Book today!",
    category: "Cataract",
    lastModified: new Date("2026-10-19T00:00:00.000Z"),
    changeFrequency: "weekly",
    priority: 0.9,
    doctor: "Dr. Girjesh Kain",
  },
];

export const UPCOMING_SEO_KEYWORDS = [
  {
    slug: "lasik-eye-surgery-in-moradabad",
    keyword: "LASIK Eye Surgery in Moradabad",
    title: "LASIK Eye Surgery in Moradabad | Oracle Eye Hospital",
    category: "Refractive",
  },
  {
    slug: "glaucoma-treatment-in-moradabad",
    keyword: "Glaucoma Treatment in Moradabad",
    title: "Glaucoma Treatment in Moradabad | Oracle Eye Hospital",
    category: "Glaucoma",
  },
  {
    slug: "retina-specialist-in-moradabad",
    keyword: "Retina Specialist in Moradabad",
    title: "Retina Specialist in Moradabad | Oracle Eye Hospital",
    category: "Retina",
  },
  {
    slug: "pediatric-eye-care-in-moradabad",
    keyword: "Pediatric Eye Care in Moradabad",
    title: "Pediatric Eye Care in Moradabad | Oracle Eye Hospital",
    category: "Pediatric",
  },
  {
    slug: "squint-surgery-in-moradabad",
    keyword: "Squint Surgery in Moradabad",
    title: "Squint Surgery in Moradabad | Oracle Eye Hospital",
    category: "Pediatric / Squint",
  },
];

export function getSeoPageBySlug(slug) {
  return SEO_PAGES.find((page) => page.slug === slug);
}

export function getAllSeoPages() {
  return SEO_PAGES;
}
