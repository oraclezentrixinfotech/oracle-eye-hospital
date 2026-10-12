import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";
import { clean, cleanMultiline, slugify } from "@/lib/validate";
import { revalidatePath } from "next/cache";

export async function GET(req) {
  if (!isAdmin()) return unauthorized();

  const { searchParams } = new URL(req.url);
  const typeParam = searchParams.get("type");

  const where = typeParam === "NEWS" || typeParam === "BLOG" ? { type: typeParam } : {};

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req) {
  if (!isAdmin()) return unauthorized();

  const b = await req.json().catch(() => ({}));
  const title = clean(b.title, 200);
  const type = b.type === "NEWS" ? "NEWS" : b.type === "BLOG" ? "BLOG" : null;
  const rawSlug = clean(b.slug, 120);
  const slug = slugify(rawSlug || title);
  const excerpt = cleanMultiline(b.excerpt, 1000);
  const body = cleanMultiline(b.body, 50000);
  const image = b.image && typeof b.image === "string" ? clean(b.image, 500) : null;
  const published = b.published === undefined ? true : Boolean(b.published);

  if (!type) {
    return NextResponse.json({ error: "Invalid post type. Must be NEWS or BLOG." }, { status: 400 });
  }

  if (!title || title.length < 2) {
    return NextResponse.json({ error: "Title is required (minimum 2 characters)." }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json({ error: "A valid slug is required." }, { status: 400 });
  }

  // Check unique slug
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: `The slug "${slug}" is already in use. Please enter a different slug.` },
      { status: 400 }
    );
  }

  if (!excerpt) {
    return NextResponse.json({ error: "Excerpt is required." }, { status: 400 });
  }

  if (!body) {
    return NextResponse.json({ error: "Body content is required." }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: { title, slug, excerpt, body, type, image, published },
  });

  // Revalidate public and admin paths
  if (type === "NEWS") {
    revalidatePath("/news");
    revalidatePath("/admin/news");
  } else {
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/blog");
  }

  return NextResponse.json(post, { status: 201 });
}
