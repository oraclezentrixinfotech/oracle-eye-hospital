import Link from "next/link";

export function PageHeader({ title, intro, crumbs = [] }) {
  return (
    <section className="bg-mist">
      <div className="container-x py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-ink/60">
          <Link href="/" className="hover:text-iris">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}> / {c.href ? <Link href={c.href} className="hover:text-iris">{c.label}</Link> : c.label}</span>
          ))}
        </nav>
        <h1 className="max-w-3xl text-4xl font-semibold md:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-ink/75">{intro}</p>}
      </div>
    </section>
  );
}

export function Prose({ children }) {
  return <div className="container-x prose-oeh max-w-3xl py-12 md:py-16">{children}</div>;
}

export function Avatar({ name, photo, className = "" }) {
  const initials = name.replace(/^Dr\.?\s+/i, "").split(" ").slice(0, 2).map((w) => w[0]).join("");
  if (photo)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt={name} className={`object-cover ${className}`} />;
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-iris-light to-mist font-display text-5xl text-iris-dark ${className}`} aria-label={name} role="img">
      {initials}
    </div>
  );
}

export function EmptyState({ children }) {
  return <p className="rounded-xl border border-dashed border-ink/25 p-8 text-center text-ink/70">{children}</p>;
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
