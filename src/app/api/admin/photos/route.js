import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";
import { parsePhoto } from "@/lib/photoValidate";
import { revalidatePath } from "next/cache";

export async function GET() {
  if (!isAdmin()) return unauthorized();
  const photos = await prisma.photo.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(photos);
}

export async function POST(req) {
  if (!isAdmin()) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const result = parsePhoto(body);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

  const photo = await prisma.photo.create({ data: result.data });
  revalidatePath("/photo-gallery");
  revalidatePath("/admin/photo-gallery");
  return NextResponse.json(photo, { status: 201 });
}
