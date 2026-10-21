import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import SeoPageForm from "../../components/SeoPageForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit SEO Page — Admin | Oracle Eye Hospital" };

export default async function EditSeoPage({ params }) {
  if (!isAdmin()) redirect("/admin/login");

  const id = parseInt(params?.id, 10);
  if (isNaN(id)) notFound();

  let page = null;
  let doctors = [];
  let allPages = [];

  try {
    page = await prisma.seoPage.findUnique({
      where: { id },
    });
    if (!page) notFound();

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
    console.error("EditSeoPage DB load error:", err?.message || err);
    notFound();
  }

  // Serialize page dates
  const serialized = {
    ...page,
    createdAt: page.createdAt ? page.createdAt.toISOString() : null,
    updatedAt: page.updatedAt ? page.updatedAt.toISOString() : null,
  };

  return <SeoPageForm initialData={serialized} doctorsList={doctors} allPages={allPages} />;
}
