import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdmin()) redirect("/admin/login");

  let counts = {
    appointments: 0,
    enquiries: 0,
    news: 0,
    photos: 0,
    videos: 0,
  };

  try {
    const [
      appointmentsCount, 
      enquiriesCount, 
      newsCount, 
      photosCount, 
      videosCount
    ] = await Promise.all([
      prisma.appointment.count().catch(() => 0),
      prisma.enquiry.count().catch(() => 0),
      prisma.post.count({ where: { type: "NEWS" } }).catch(() => 0),
      prisma.photo.count().catch(() => 0),
      prisma.video.count().catch(() => 0),
    ]);

    counts = {
      appointments: appointmentsCount || 0,
      enquiries: enquiriesCount || 0,
      news: newsCount || 0,
      photos: photosCount || 0,
      videos: videosCount || 0,
    };
  } catch (err) {
    console.error("Failed to load admin counts from database:", err?.message || err);
  }

  return <AdminPanel counts={counts} />;
}
