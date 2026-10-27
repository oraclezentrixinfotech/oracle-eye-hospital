import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";
import { clean, cleanMultiline, slugify } from "@/lib/validate";
import { revalidatePath } from "next/cache";
import { sanitizeSeoFaqs, sanitizeSeoSections } from "@/lib/sanitizeSeoPage";
import { validateSchemaJson } from "@/lib/validateSchema";
import { SITE_URL } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  if (!isAdmin()) return unauthorized();

  const id = parseInt(params?.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid page ID." }, { status: 400 });
  }

  try {
    const page = await prisma.seoPage.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: "SEO page not found." }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (err) {
    console.error("GET /api/admin/seo-pages/[id] error:", err?.message || err);
    return NextResponse.json({ error: "Failed to fetch SEO page." }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  if (!isAdmin()) return unauthorized();

  const id = parseInt(params?.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid page ID." }, { status: 400 });
  }

  const existing = await prisma.seoPage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "SEO page not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));

  const h1Title = clean(body.h1Title || body.h1_title, 255) || existing.h1Title;
  if (!h1Title || h1Title.length < 2) {
    return NextResponse.json({ error: "H1 Title is required (minimum 2 characters)." }, { status: 400 });
  }

  const rawSlug = clean(body.slug, 120);
  const slug = rawSlug ? slugify(rawSlug) : existing.slug;

  // Check unique slug if changed
  if (slug !== existing.slug) {
    const conflict = await prisma.seoPage.findUnique({ where: { slug } });
    if (conflict && conflict.id !== id) {
      return NextResponse.json(
        { error: `The slug "${slug}" is already in use by another page. Please enter a unique slug.` },
        { status: 409 }
      );
    }
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
  const heroChips = Array.isArray(body.heroChips) ? body.heroChips : existing.heroChips;
  const ctaPrimaryText = clean(body.ctaPrimaryText || body.cta_primary_text, 100) || "Book Consultation";
  const ctaPrimaryLink = clean(body.ctaPrimaryLink || body.cta_primary_link, 500) || existing.ctaPrimaryLink || "https://www.oracleeyehospital.com/";
  const ctaPhone = clean(body.ctaPhone || body.cta_phone, 50) || "+919458422606";
  const sections = Array.isArray(body.sections)
    ? sanitizeSeoSections(body.sections)
    : existing.sections;
  const doctorIds = Array.isArray(body.doctorIds)
    ? body.doctorIds.map(Number).filter((n) => !isNaN(n))
    : existing.doctorIds;
  const faqs = Array.isArray(body.faqs)
    ? sanitizeSeoFaqs(body.faqs)
    : existing.faqs;
  const relatedIds = Array.isArray(body.relatedIds)
    ? body.relatedIds.map(Number).filter((n) => !isNaN(n))
    : existing.relatedIds;
  const customLinks = Array.isArray(body.customLinks)
    ? body.customLinks
        .filter((l) => l && typeof l === "object" && (l.title || l.url))
        .map((l) => ({
          title: clean(l.title, 200) || "Related Service",
          url: clean(l.url, 500) || "https://www.oracleeyehospital.com/",
        }))
    : existing.customLinks || [];

  // Schema Validation & Handling
  let schemaJson = existing.schemaJson;
  let schemaUpdatedAt = existing.schemaUpdatedAt;
  let customSchema = existing.customSchema;

  const rawSchemaInput = body.schemaJson !== undefined ? body.schemaJson : body.customSchema;
  if (rawSchemaInput !== undefined) {
    const allowRatings = Boolean(body.allowRatings);
    const schemaValidation = validateSchemaJson(rawSchemaInput, allowRatings);
    if (!schemaValidation.valid) {
      return NextResponse.json(
        { error: schemaValidation.error, warning: schemaValidation.warning },
        { status: 400 }
      );
    }
    schemaJson = schemaValidation.schemaJson;
    schemaUpdatedAt = new Date();
    customSchema = schemaJson ? JSON.stringify(schemaJson, null, 2) : null;
  }

  try {
    const updated = await prisma.seoPage.update({
      where: { id },
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
        ctaPrimaryLink,
        ctaPhone,
        sections,
        doctorIds,
        faqs,
        customSchema,
        schemaJson,
        schemaUpdatedAt,
        relatedIds,
        customLinks,
        updatedAt: new Date(),
      },
    });

    if (existing.slug !== updated.slug) {
      revalidatePath("/" + existing.slug);
      revalidatePath("/services/" + existing.slug);
    }
    revalidatePath("/" + updated.slug);
    revalidatePath("/services/" + updated.slug);
    revalidatePath("/admin/seo-pages");
    revalidatePath("/sitemap.xml");

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/admin/seo-pages/[id] error:", err?.message || err);
    return NextResponse.json({ error: "Failed to update SEO page." }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  if (!isAdmin()) return unauthorized();

  const id = parseInt(params?.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid page ID." }, { status: 400 });
  }

  const existing = await prisma.seoPage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "SEO page not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  if (typeof body.status !== "string") {
    return NextResponse.json({ error: "Status is required." }, { status: 400 });
  }

  const status = body.status === "published" ? "published" : "draft";

  try {
    const updated = await prisma.seoPage.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date(),
      },
      select: { id: true, status: true, slug: true },
    });

    revalidatePath("/" + existing.slug);
    revalidatePath("/services/" + existing.slug);
    revalidatePath("/admin/seo-pages");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ ok: true, id: updated.id, status: updated.status });
  } catch (err) {
    console.error("PATCH /api/admin/seo-pages/[id] error:", err?.message || err);
    return NextResponse.json({ error: "Failed to update page status." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!isAdmin()) return unauthorized();

  const id = parseInt(params?.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid page ID." }, { status: 400 });
  }

  try {
    const existing = await prisma.seoPage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "SEO page not found." }, { status: 404 });
    }

    await prisma.seoPage.delete({ where: { id } });

    revalidatePath("/" + existing.slug);
    revalidatePath("/services/" + existing.slug);
    revalidatePath("/admin/seo-pages");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ ok: true, message: "Page deleted successfully." });
  } catch (err) {
    console.error("DELETE /api/admin/seo-pages/[id] error:", err?.message || err);
    return NextResponse.json({ error: "Failed to delete SEO page." }, { status: 500 });
  }
}
