import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import SeoPageForm from "../components/SeoPageForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Add New SEO Page — Admin | Oracle Eye Hospital" };

export default async function NewSeoPage() {
  if (!isAdmin()) redirect("/admin/login");

  let doctors = [];
  let allPages = [];

  try {
    doctors = await prisma.doctor.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
    allPages = await prisma.seoPage.findMany({
      where: { status: "published" },
      select: { id: true, slug: true, h1Title: true },
      orderBy: { h1Title: "asc" },
    });
  } catch (err) {
    console.error("NewSeoPage DB load error:", err?.message || err);
  }

  return <SeoPageForm doctorsList={doctors} allPages={allPages} />;
}
