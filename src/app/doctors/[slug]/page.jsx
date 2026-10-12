import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Avatar } from "@/components/ui";
import { DOCTORS } from "@/lib/content";

export function generateStaticParams() {
  return DOCTORS.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }) {
  const d = DOCTORS.find((x) => x.slug === params.slug);
  return d ? { title: d.name, description: `${d.name}, ${d.title} at Oracle Eye Hospital, Moradabad.` } : {};
}

export default function DoctorPage({ params }) {
  const d = DOCTORS.find((x) => x.slug === params.slug);
  if (!d) notFound();
  return (
    <>
      <PageHeader title={d.name} intro={`${d.quals} · ${d.title}`} crumbs={[{ label: "Doctors", href: "/doctor-team" }, { label: d.name }]} />
      <div className="container-x grid gap-10 py-12 md:grid-cols-3">
        <Avatar name={d.name} photo={d.photo} className="aspect-[4/5] w-full max-w-xs rounded-2xl" />
        <div className="md:col-span-2">
          <p className="max-w-2xl text-lg leading-8 text-ink/85" data-aos="fade-up">{d.bio}</p>
          <Link href={`/appointment?doctor=${encodeURIComponent(d.name)}`} className="btn btn-primary mt-8">Book with {d.name}</Link>
        </div>
      </div>
    </>
  );
}
