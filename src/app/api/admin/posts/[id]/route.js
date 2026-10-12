import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";
import { clean, cleanMultiline, slugify } from "@/lib/validate";
import { revalidatePath } from "next/cache";

export async function PUT(req, { params }) {
  if (!isAdmin()) return unauthorized();

  const id = params?.id;
  if (!id) return NextResponse.json({ error: "Post ID is required." }, { status: 400 });

  const existingPost = await prisma.post.findUnique({ where: { id } });
  if (!existingPost) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const b = await req.json().catch(() => ({}));
  const title = clean(b.title, 200);
  const type = b.type === "NEWS" ? "NEWS" : b.type === "BLOG" ? "BLOG" : existingPost.type;
  const rawSlug = clean(b.slug, 120);
  const slug = slugify(rawSlug || title);
  const excerpt = cleanMultiline(b.excerpt, 1000);
  const body = cleanMultiline(b.body, 50000);
  const image = b.image !== undefined ? (b.image && typeof b.image === "string" ? clean(b.image, 500) : null) : existingPost.image;
  const published = b.published !== undefined ? Boolean(b.published) : existingPost.published;

  if (!title || title.length < 2) {
    return NextResponse.json({ error: "Title is required (minimum 2 characters)." }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json({ error: "A valid slug is required." }, { status: 400 });
  }

  // Check unique slug if changed
  if (slug !== existingPost.slug) {
    const conflict = await prisma.post.findUnique({ where: { slug } });
    if (conflict && conflict.id !== id) {
      return NextResponse.json(
        { error: `The slug "${slug}" is already in use. Please enter a different slug.` },
        { status: 400 }
      );
    }
  }

  if (!excerpt) {
    return NextResponse.json({ error: "Excerpt is required." }, { status: 400 });
  }

  if (!body) {
    return NextResponse.json({ error: "Body content is required." }, { status: 400 });
  }

  const updated = await prisma.post.update({
    where: { id },
    data: { title, slug, excerpt, body, type, image, published },
  });

  // Revalidate paths
  if (updated.type === "NEWS") {
    revalidatePath("/news");
    revalidatePath("/admin/news");
  } else {
    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);
    if (existingPost.slug !== updated.slug) {
      revalidatePath(`/blog/${existingPost.slug}`);
    }
    revalidatePath("/admin/blog");
  }

  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  if (!isAdmin()) return unauthorized();

  const id = params?.id;
  if (!id) return NextResponse.json({ error: "Post ID is required." }, { status: 400 });

  const existingPost = await prisma.post.findUnique({ where: { id } });
  if (!existingPost) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  await prisma.post.delete({ where: { id } });

  if (existingPost.type === "NEWS") {
    revalidatePath("/news");
    revalidatePath("/admin/news");
  } else {
    revalidatePath("/blog");
    if (existingPost.slug) {
      revalidatePath(`/blog/${existingPost.slug}`);
    }
    revalidatePath("/admin/blog");
  }

  return NextResponse.json({ ok: true });
}
