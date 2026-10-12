import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { SERVICES, SITE } from "@/lib/content";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }) {
  const s = SERVICES.find((x) => x.slug === params.slug);
  if (!s) return {};
  return { title: s.title, description: s.intro.slice(0, 155) };
}

export default function ServicePage({ params }) {
  const s = SERVICES.find((x) => x.slug === params.slug);
  if (!s) notFound();

  return (
    <>
      <PageHeader title={s.title} intro={s.short} crumbs={[{ label: "Services", href: "/services" }, { label: s.title }]} />
      <div className="container-x grid gap-12 py-12 md:grid-cols-3 md:py-16">
        <div className="space-y-10 md:col-span-2">
          <p className="text-lg leading-8 text-ink/85" data-aos="fade-up">{s.intro}</p>
          <section>
            <h2 className="text-2xl" data-aos="fade-up">When to see an eye doctor</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-ink/85">
              {s.signs.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl" data-aos="fade-up">How we can help</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-ink/85">
              {s.care.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </section>
        </div>
        <aside className="self-start rounded-2xl bg-mist p-6">
          <h2 className="text-xl" data-aos="fade-up">Book a consultation</h2>
          <p className="mt-2 text-sm text-ink/75" data-aos="fade-up">{SITE.hours}</p>
          <Link href="/appointment" className="btn btn-primary mt-4 w-full">Book appointment</Link>
          <a href={`tel:${SITE.helpline.replace(/\s/g, "")}`} className="btn btn-outline mt-3 w-full">Call {SITE.helpline}</a>
          <h3 className="mt-8 text-base" data-aos="fade-up">Other services</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {SERVICES.filter((x) => x.slug !== s.slug).map((x) => (
              <li key={x.slug}><Link href={`/services/${x.slug}`} className="hover:text-iris">{x.title}</Link></li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
