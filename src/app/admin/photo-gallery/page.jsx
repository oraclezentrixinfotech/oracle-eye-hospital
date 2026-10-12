import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import PhotoClient from "./PhotoClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Photo Gallery — Admin | Oracle Eye Hospital" };

export default async function PhotoGalleryAdminPage() {
  if (!isAdmin()) redirect("/admin/login");

  const photos = await prisma.photo.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  // Serialize dates for client component
  const rows = photos.map((p) => ({
    ...p,
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
  }));

  return <PhotoClient rows={rows} />;
}
