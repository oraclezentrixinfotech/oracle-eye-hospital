import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";
import { parseVideo } from "@/lib/videoValidate";
import { revalidatePath } from "next/cache";

export async function GET() {
  if (!isAdmin()) return unauthorized();
  const videos = await prisma.video.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(videos);
}

export async function POST(req) {
  if (!isAdmin()) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const result = parseVideo(body);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

  const video = await prisma.video.create({ data: result.data });
  revalidatePath("/video-gallery");
  return NextResponse.json(video, { status: 201 });
}
