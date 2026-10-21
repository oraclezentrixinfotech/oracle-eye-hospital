import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import SeoPageListClient from "./SeoPageListClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage SEO Pages — Admin | Oracle Eye Hospital" };

export default async function AdminSeoPagesPage() {
  if (!isAdmin()) redirect("/admin/login");

  let pages = [];
  try {
    pages = await prisma.seoPage.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("AdminSeoPagesPage DB error:", err?.message || err);
  }

  const rows = (pages || []).map((p) => ({
    ...p,
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
    updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
  }));

  return <SeoPageListClient rows={rows} />;
}
