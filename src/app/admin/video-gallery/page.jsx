import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import VideoClient from "./VideoClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Video Gallery — Admin | Oracle Eye Hospital" };

export default async function VideoGalleryAdminPage() {
  if (!isAdmin()) redirect("/admin/login");

  const videos = await prisma.video.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  // Serialize dates for client component
  const rows = videos.map(v => ({
    ...v,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
  }));

  return <VideoClient rows={rows} />;
}
