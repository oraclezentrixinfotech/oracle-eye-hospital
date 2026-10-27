import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";
import { clean, cleanMultiline, slugify } from "@/lib/validate";
import { revalidatePath } from "next/cache";
import { sanitizeSeoFaqs, sanitizeSeoSections } from "@/lib/sanitizeSeoPage";
import { validateSchemaJson } from "@/lib/validateSchema";
import { SITE_URL } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAdmin()) return unauthorized();

  try {
    const pages = await prisma.seoPage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pages);
  } catch (err) {
    console.error("GET /api/admin/seo-pages error:", err?.message || err);
    return NextResponse.json({ error: "Failed to fetch SEO pages." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!isAdmin()) return unauthorized();

  const body = await req.json().catch(() => ({}));

  const h1Title = clean(body.h1Title || body.h1_title, 255);
  if (!h1Title || h1Title.length < 2) {
    return NextResponse.json({ error: "H1 Title is required (minimum 2 characters)." }, { status: 400 });
  }

  const rawSlug = clean(body.slug, 120);
  const slug = slugify(rawSlug || h1Title);
  if (!slug) {
    return NextResponse.json({ error: "A valid slug is required." }, { status: 400 });
  }

  // Check unique slug
  const existing = await prisma.seoPage.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: `The slug "${slug}" is already in use. Please enter a unique slug.` },
      { status: 409 }
    );
  }

  const status = body.status === "published" ? "published" : "draft";
  const metaTitle = clean(body.metaTitle || body.meta_title, 255) || h1Title;
  const metaDescription = cleanMultiline(body.metaDescription || body.meta_description, 1000);
  const keywords = cleanMultiline(body.keywords, 1000);
  const canonicalUrl = clean(body.canonicalUrl || body.canonical_url, 500);
  const ogImage = clean(body.ogImage || body.og_image, 500);
  const heroBadge = clean(body.heroBadge || body.hero_badge, 255);
  const heroSubtitle = cleanMultiline(body.heroSubtitle || body.hero_subtitle, 2000);
  const heroImage = clean(body.heroImage || body.hero_image, 500);
  const heroChips = Array.isArray(body.heroChips) ? body.heroChips : [];
  const ctaPrimaryText = clean(body.ctaPrimaryText || body.cta_primary_text, 100) || "Book Consultation";
  const ctaPhone = clean(body.ctaPhone || body.cta_phone, 50) || "+919458422606";
  const sections = sanitizeSeoSections(body.sections);
  const doctorIds = Array.isArray(body.doctorIds)
    ? body.doctorIds.map(Number).filter((n) => !isNaN(n))
    : [];
  const faqs = sanitizeSeoFaqs(body.faqs);
  const relatedIds = Array.isArray(body.relatedIds)
    ? body.relatedIds.map(Number).filter((n) => !isNaN(n))
    : [];

  // Schema Validation & Handling
  const rawSchemaInput = body.schemaJson !== undefined ? body.schemaJson : body.customSchema;
  const allowRatings = Boolean(body.allowRatings);
  const schemaValidation = validateSchemaJson(rawSchemaInput, allowRatings);
  if (!schemaValidation.valid) {
    return NextResponse.json(
      { error: schemaValidation.error, warning: schemaValidation.warning },
      { status: 400 }
    );
  }
  const schemaJson = schemaValidation.schemaJson;
  const schemaUpdatedAt = schemaJson ? new Date() : null;
  const customSchemaText = schemaJson ? JSON.stringify(schemaJson, null, 2) : null;

  try {
    const page = await prisma.seoPage.create({
      data: {
        slug,
        status,
        metaTitle,
        metaDescription,
        keywords,
        canonicalUrl: canonicalUrl || `${SITE_URL}/${slug}`,
        ogImage: ogImage || heroImage,
        heroBadge,
        h1Title,
        heroSubtitle,
        heroImage,
        heroChips,
        ctaPrimaryText,
        ctaPhone,
        sections,
        doctorIds,
        faqs,
        customSchema: customSchemaText,
        schemaJson,
        schemaUpdatedAt,
        relatedIds,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/" + slug);
    revalidatePath("/services/" + slug);
    revalidatePath("/admin/seo-pages");
    revalidatePath("/sitemap.xml");

    return NextResponse.json(page, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/seo-pages error:", err?.message || err);
    return NextResponse.json({ error: "Failed to create SEO page: " + (err?.message || "Unknown error") }, { status: 500 });
  }
}
