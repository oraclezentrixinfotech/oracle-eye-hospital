import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import SeoPageForm from "../../components/SeoPageForm";
import { ensureDbSchema } from "@/lib/ensureDbSchema";

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
    await ensureDbSchema();

    const [fetchedPage, fetchedDoctors, fetchedAllPages] = await Promise.all([
      prisma.seoPage.findUnique({ where: { id } }),
      prisma.doctor.findMany({
        where: { active: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      }),
      prisma.seoPage.findMany({
        where: { status: "published" },
        select: { id: true, slug: true, h1Title: true },
        orderBy: { h1Title: "asc" },
      }),
    ]);

    page = fetchedPage;
    doctors = fetchedDoctors || [];
    allPages = fetchedAllPages || [];

    if (!page) {
      console.log(`[EditSeoPage] Page not found for id ${id}`);
      notFound();
    }
  } catch (err) {
    console.error("EditSeoPage DB load error:", err?.message || err);
    if (!page) notFound();
  }

  if (!page) notFound();

  // Serialize page dates
  const serialized = {
    ...page,
    createdAt: page.createdAt ? page.createdAt.toISOString() : null,
    updatedAt: page.updatedAt ? page.updatedAt.toISOString() : null,
  };

  return <SeoPageForm initialData={serialized} doctorsList={doctors} allPages={allPages} />;
}
