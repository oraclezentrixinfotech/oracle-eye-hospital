import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import EnquiriesClient from "./EnquiriesClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact Messages — Admin | Oracle Eye Hospital" };

export default async function EnquiriesAdminPage() {
  if (!isAdmin()) redirect("/admin/login");

  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates for client component
  const rows = enquiries.map((e) => ({
    ...e,
    createdAt: e.createdAt ? e.createdAt.toISOString() : null,
  }));

  return <EnquiriesClient initialRows={rows} />;
}
