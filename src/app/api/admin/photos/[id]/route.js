import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";
import { parsePhoto } from "@/lib/photoValidate";
import { revalidatePath } from "next/cache";

export async function PUT(req, { params }) {
  if (!isAdmin()) return unauthorized();

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const result = parsePhoto(body);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

  try {
    const photo = await prisma.photo.update({ where: { id }, data: result.data });
    revalidatePath("/photo-gallery");
    revalidatePath("/admin/photo-gallery");
    return NextResponse.json(photo);
  } catch {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }
}

export async function DELETE(req, { params }) {
  if (!isAdmin()) return unauthorized();

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

  try {
    await prisma.photo.delete({ where: { id } });
    revalidatePath("/photo-gallery");
    revalidatePath("/admin/photo-gallery");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }
}
