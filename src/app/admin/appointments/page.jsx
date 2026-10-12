import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import AppointmentsClient from "./AppointmentsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Appointments — Admin | Oracle Eye Hospital" };

export default async function AppointmentsAdminPage() {
  if (!isAdmin()) redirect("/admin/login");

  const appointments = await prisma.appointment.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates for client component
  const rows = appointments.map((a) => ({
    ...a,
    createdAt: a.createdAt ? a.createdAt.toISOString() : null,
    preferredDate: a.preferredDate ? a.preferredDate.toISOString() : null,
  }));

  return <AppointmentsClient initialRows={rows} />;
}
