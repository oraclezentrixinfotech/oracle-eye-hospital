import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import EnquiriesClient from "./EnquiriesClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact Messages — Admin | Oracle Eye Hospital" };

export default async function EnquiriesAdminPage() {
  if (!isAdmin()) redirect("/admin/login");

  let enquiries = [];
  try {
    enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("EnquiriesAdminPage DB error:", err?.message || err);
  }

  // Serialize dates for client component
  const rows = (enquiries || []).map((e) => ({
    ...e,
    createdAt: e.createdAt ? e.createdAt.toISOString() : null,
  }));

  return <EnquiriesClient initialRows={rows} />;
}
