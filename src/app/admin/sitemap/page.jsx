import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import SitemapManagerClient from "./SitemapManagerClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Manage Sitemap — Admin | Oracle Eye Hospital",
};

export default function AdminSitemapPage() {
  if (!isAdmin()) redirect("/admin/login");

  return <SitemapManagerClient />;
}
