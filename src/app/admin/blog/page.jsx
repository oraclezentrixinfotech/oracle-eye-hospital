import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import PostManager from "../components/PostManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage Blog — Admin | Oracle Eye Hospital" };

export default async function AdminBlogPage() {
  if (!isAdmin()) redirect("/admin/login");

  let posts = [];
  try {
    posts = await prisma.post.findMany({
      where: { type: "BLOG" },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("AdminBlogPage DB error:", err?.message || err);
  }

  const rows = (posts || []).map((p) => ({
    ...p,
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
  }));

  return <PostManager type="BLOG" rows={rows} />;
}
