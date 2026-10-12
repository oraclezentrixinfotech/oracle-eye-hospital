import { prisma } from "@/lib/prisma";

// Returns [] instead of crashing the page if the database is unreachable.
export async function getPosts(type) {
  try {
    return await prisma.post.findMany({
      where: { type, published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("getPosts failed:", e.message);
    return [];
  }
}

export async function getPost(slug) {
  try {
    return await prisma.post.findFirst({ where: { slug, published: true } });
  } catch (e) {
    console.error("getPost failed:", e.message);
    return null;
  }
}
