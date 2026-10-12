import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website Settings — Admin | Oracle Eye Hospital" };

export default async function SettingsAdminPage() {
  if (!isAdmin()) redirect("/admin/login");

  const settings = await getSettings();

  return <SettingsClient initialSettings={settings} />;
}
