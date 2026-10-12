import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdmin()) redirect("/admin/login");

  const [
    appointmentsCount, 
    enquiriesCount, 
    newsCount, 
    photosCount, 
    videosCount
  ] = await Promise.all([
    prisma.appointment.count(),
    prisma.enquiry.count(),
    prisma.post.count({ where: { type: "NEWS" } }),
    prisma.photo.count(),
    prisma.video.count(),
  ]);

  const counts = {
    appointments: appointmentsCount,
    enquiries: enquiriesCount,
    news: newsCount,
    photos: photosCount,
    videos: videosCount,
  };

  return <AdminPanel counts={counts} />;
}
