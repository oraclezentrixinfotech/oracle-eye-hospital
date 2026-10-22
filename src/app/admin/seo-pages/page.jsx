import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import SeoPageListClient from "./SeoPageListClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage SEO Pages — Admin | Oracle Eye Hospital" };

export default async function AdminSeoPagesPage() {
  if (!isAdmin()) redirect("/admin/login");

  let pages = [];
  let doctors = [];

  try {
    pages = await prisma.seoPage.findMany({
      orderBy: { createdAt: "desc" },
    });
    doctors = await prisma.doctor.findMany({
      where: { active: true },
      select: { id: true, name: true, role: true, qualification: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (err) {
    console.error("AdminSeoPagesPage DB error:", err?.message || err);
  }

  const rows = (pages || []).map((p) => ({
    ...p,
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
    updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
  }));

  const allPages = (pages || []).filter((p) => p.status === "published").map((p) => ({
    id: p.id,
    slug: p.slug,
    h1Title: p.h1Title,
  }));

  return <SeoPageListClient rows={rows} doctorsList={doctors} allPages={allPages} />;
}
