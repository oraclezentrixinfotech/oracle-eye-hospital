import { SITE, SERVICES, DOCTORS } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATIC = ["", "/overview", "/chairman-message", "/board-of-directors", "/testimonials", "/doctor-team", "/optometrist-team", "/services", "/photo-gallery", "/video-gallery", "/blog", "/news", "/comprehensive-internship-in-optometry", "/awards", "/publications", "/cashless-facility", "/charitable-wings", "/community-outreach", "/career", "/contact-us", "/appointment"];

export default async function sitemap() {
  const entries = [
    ...STATIC.map((p) => ({ url: `${SITE.url}${p}` })),
    ...SERVICES.map((s) => ({ url: `${SITE.url}/services/${s.slug}` })),
    ...DOCTORS.map((d) => ({ url: `${SITE.url}/doctors/${d.slug}` })),
  ];
  try {
    const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true, createdAt: true } });
    posts.forEach((p) => entries.push({ url: `${SITE.url}/blog/${p.slug}`, lastModified: p.createdAt }));
  } catch {
    /* DB offline: sitemap still works without posts */
  }
  return entries;
}
