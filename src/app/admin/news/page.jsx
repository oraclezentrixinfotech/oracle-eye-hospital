import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import PostManager from "../components/PostManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage News — Admin | Oracle Eye Hospital" };

export default async function AdminNewsPage() {
  if (!isAdmin()) redirect("/admin/login");

  let posts = [];
  try {
    posts = await prisma.post.findMany({
      where: { type: "NEWS" },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("AdminNewsPage DB error:", err?.message || err);
  }

  const rows = (posts || []).map((p) => ({
    ...p,
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
  }));

  return <PostManager type="NEWS" rows={rows} />;
}
