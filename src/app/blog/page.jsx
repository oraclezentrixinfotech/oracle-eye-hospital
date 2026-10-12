import Link from "next/link";
import { PageHeader, EmptyState, formatDate } from "@/components/ui";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Eye Care Blog", description: "Eye health tips and updates from Oracle Eye Hospital, Moradabad." };

export default async function Blog() {
  const posts = await getPosts("BLOG");
  return (
    <>
      <PageHeader title="Eye care blog" intro="Practical advice from our doctors." crumbs={[{ label: "Latest Updates" }, { label: "Blogs" }]} />
      <div className="container-x py-12">
        {posts.length === 0 ? (
          <EmptyState>No posts yet. Add one from the admin panel.</EmptyState>
        ) : (
          <div className="grid gap-x-12 md:grid-cols-2">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group border-t border-ink/15 py-6">
                <p className="text-sm text-ink/60" data-aos="fade-up">{formatDate(p.createdAt)}</p>
                <h2 className="mt-1 text-2xl group-hover:text-iris" data-aos="fade-up">{p.title}</h2>
                <p className="mt-2 text-ink/75" data-aos="fade-up">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
