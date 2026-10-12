import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";
import { parseVideo } from "@/lib/videoValidate";
import { revalidatePath } from "next/cache";

export async function PUT(req, { params }) {
  if (!isAdmin()) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const result = parseVideo(body);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

  try {
    const video = await prisma.video.update({
      where: { id: params.id },
      data: result.data,
    });
    revalidatePath("/video-gallery");
    return NextResponse.json(video);
  } catch {
    return NextResponse.json({ error: "Video not found." }, { status: 404 });
  }
}

export async function DELETE(req, { params }) {
  if (!isAdmin()) return unauthorized();

  try {
    await prisma.video.delete({ where: { id: params.id } });
    revalidatePath("/video-gallery");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Video not found." }, { status: 404 });
  }
}
