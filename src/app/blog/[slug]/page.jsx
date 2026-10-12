import { notFound } from "next/navigation";
import { PageHeader, formatDate } from "@/components/ui";
import { getPost } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const p = await getPost(params.slug);
  return p ? { title: `${p.title} | Oracle Eye Hospital`, description: p.excerpt } : {};
}

export default async function BlogPost({ params }) {
  const p = await getPost(params.slug);
  if (!p) notFound();
  const listHref = p.type === "NEWS" ? "/news" : "/blog";

  return (
    <>
      <PageHeader
        title={p.title}
        intro={formatDate(p.createdAt)}
        crumbs={[
          { label: p.type === "NEWS" ? "News & Events" : "Blog", href: listHref },
          { label: p.title },
        ]}
      />
      <article className="container-x prose-oeh max-w-3xl py-12">
        {p.image && (
          <div className="mb-8 overflow-hidden rounded-xl shadow-sm" data-aos="fade-up">
            <img
              src={p.image}
              alt={p.title}
              className="w-full max-h-[440px] object-cover rounded-xl"
            />
          </div>
        )}
        {/* body is plain text; blank line = new paragraph. React escapes it, so no HTML injection. */}
        {p.body.split(/\n{2,}/).map((para, i) => (
          <p key={i} data-aos="fade-up" className="mb-4 text-base leading-relaxed text-ink/80">
            {para}
          </p>
        ))}
      </article>
    </>
  );
}