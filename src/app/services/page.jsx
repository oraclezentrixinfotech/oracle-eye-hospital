import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { SERVICES } from "@/lib/content";

export const metadata = {
  title: "Eye Care Services",
  description: "Cataract, cornea and refractive, retina, glaucoma, myopia, pediatric, dry eye and contact lens services at Oracle Eye Hospital, Moradabad.",
};

export default function Services() {
  return (
    <>
      <PageHeader title="Our services" intro="Complete eye care from routine check-ups to advanced surgery." crumbs={[{ label: "Services" }]} />
      <div className="container-x grid gap-x-12 py-12 md:grid-cols-2">
        {SERVICES.map((s) => (
          <Link key={s.slug} href={`/services/${s.slug}`} className="group border-t border-ink/15 py-6">
            <h2 className="text-2xl group-hover:text-iris" data-aos="fade-up">{s.title}</h2>
            <p className="mt-2 text-ink/70" data-aos="fade-up">{s.short}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
