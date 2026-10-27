import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { SERVICES, SITE } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import ServiceContentClient from "./ServiceContentClient";
import { SITE_URL } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) return {};

  let seoPage = null;
  try {
    seoPage = await prisma.seoPage.findFirst({
      where: { slug, status: "published" },
    });
  } catch (err) {
    console.error("generateMetadata SEO Page DB error:", err?.message || err);
  }

  if (seoPage) {
    const pageTitle =
      seoPage.metaTitle || `${seoPage.h1Title} | Oracle Eye Hospital`;
    const pageDesc =
      seoPage.metaDescription ||
      seoPage.heroSubtitle ||
      `Advanced ${seoPage.h1Title} at Oracle Eye Hospital in Moradabad.`;
    const canonical =
      seoPage.canonicalUrl ||
      `${SITE_URL}/services/${seoPage.slug}`;
    const ogImg =
      seoPage.ogImage ||
      seoPage.heroImage ||
      `${SITE_URL}/Assets/img/services/Cataract-Service.png`;

    return {
      title: pageTitle,
      description: pageDesc,
      keywords: seoPage.keywords || undefined,
      alternates: {
        canonical,
      },
      openGraph: {
        title: pageTitle,
        description: pageDesc,
        url: canonical,
        siteName: "Oracle Eye Hospital",
        locale: "en_IN",
        type: "website",
        images: [
          {
            url: ogImg,
            width: 1200,
            height: 630,
            alt: `${seoPage.h1Title} - Oracle Eye Hospital`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: pageDesc,
        images: [ogImg],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  }

  // Fallback to legacy static service if registered in content.js
  const s = SERVICES.find((x) => x.slug === slug);
  if (s) {
    return {
      title: `${s.title} | Oracle Eye Hospital`,
      description: s.intro.slice(0, 155),
      alternates: {
        canonical: `${SITE_URL}/services/${s.slug}`,
      },
    };
  }

  return {};
}

export default async function ServicePage({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  let seoPage = null;
  let doctors = [];
  let relatedServices = [];

  try {
    seoPage = await prisma.seoPage.findFirst({
      where: { slug, status: "published" },
    });

    if (seoPage) {
      // Fetch associated doctors
      if (Array.isArray(seoPage.doctorIds) && seoPage.doctorIds.length > 0) {
        doctors = await prisma.doctor.findMany({
          where: { id: { in: seoPage.doctorIds }, active: true },
          orderBy: { sortOrder: "asc" },
        });
      }
      if (doctors.length === 0) {
        // Fallback to default active doctors
        doctors = await prisma.doctor.findMany({
          where: { active: true },
          orderBy: { sortOrder: "asc" },
          take: 2,
        });
      }

      // Fetch related published services
      if (Array.isArray(seoPage.relatedIds) && seoPage.relatedIds.length > 0) {
        relatedServices = await prisma.seoPage.findMany({
          where: { id: { in: seoPage.relatedIds }, status: "published" },
          select: { id: true, slug: true, h1Title: true, heroBadge: true },
        });
      }
      if (relatedServices.length === 0 && (!Array.isArray(seoPage.customLinks) || seoPage.customLinks.length === 0)) {
        relatedServices = await prisma.seoPage.findMany({
          where: { NOT: { id: seoPage.id }, status: "published" },
          select: { id: true, slug: true, h1Title: true, heroBadge: true },
          take: 4,
        });
      }

      // Append custom links if present
      if (Array.isArray(seoPage.customLinks) && seoPage.customLinks.length > 0) {
        const formattedCustom = seoPage.customLinks
          .filter((cl) => cl && cl.title && cl.url)
          .map((cl, idx) => ({
            id: `custom-${idx}`,
            title: cl.title,
            h1Title: cl.title,
            url: cl.url,
            heroBadge: "Specialized Internal Care",
          }));
        relatedServices = [...relatedServices, ...formattedCustom];
      }
    }
  } catch (err) {
    console.error("ServicePage DB query error:", err?.message || err);
  }

  // 1. If SEO Page found in DB -> Render Rich SEO Layout
  if (seoPage) {
    // Prepare schema items from DB (schemaJson or legacy customSchema fallback if JSON)
    let schemaList = [];
    if (seoPage.schemaJson) {
      schemaList = Array.isArray(seoPage.schemaJson)
        ? seoPage.schemaJson
        : [seoPage.schemaJson];
    } else if (seoPage.customSchema && seoPage.customSchema.trim()) {
      try {
        let raw = seoPage.customSchema.trim();
        if (raw.startsWith("<script") && raw.endsWith("</script>")) {
          raw = raw.replace(/<script[^>]*>/i, "").replace(/<\/script>$/i, "").trim();
        }
        const parsed = JSON.parse(raw);
        schemaList = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        schemaList = [];
      }
    }

    return (
      <>
        {/* Schema.org Structured Data: strictly from database written via Admin Panel */}
        {schemaList.length > 0 &&
          schemaList.map((item, index) => {
            const jsonText = JSON.stringify(item).replace(/</g, "\\u003c");
            return (
              <script
                key={index}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonText }}
              />
            );
          })}

        {/* Dynamic SEO Content with Sticky TOC & Interactive Elements */}
        <ServiceContentClient
          page={seoPage}
          sections={seoPage.sections || []}
          doctors={doctors}
          faqs={seoPage.faqs || []}
          relatedServices={relatedServices}
        />
      </>
    );
  }

  // 2. Legacy fallback for static services
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) notFound();

  return (
    <>
      <PageHeader
        title={s.title}
        intro={s.short}
        crumbs={[{ label: "Services", href: "/services" }, { label: s.title }]}
      />
      <div className="container-x grid gap-12 py-12 md:grid-cols-3 md:py-16">
        <div className="space-y-10 md:col-span-2">
          <p className="text-lg leading-8 text-ink/85" data-aos="fade-up">
            {s.intro}
          </p>
          <section>
            <h2 className="text-2xl" data-aos="fade-up">
              When to see an eye doctor
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-ink/85">
              {s.signs.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl" data-aos="fade-up">
              How we can help
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-ink/85">
              {s.care.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
        </div>
        <aside className="self-start rounded-2xl bg-mist p-6">
          <h2 className="text-xl" data-aos="fade-up">
            Book a consultation
          </h2>
          <p className="mt-2 text-sm text-ink/75" data-aos="fade-up">
            {SITE.hours}
          </p>
          <Link href="/appointment" className="btn btn-primary mt-4 w-full">
            Book appointment
          </Link>
          <a
            href={`tel:${SITE.helpline.replace(/\s/g, "")}`}
            className="btn btn-outline mt-3 w-full"
          >
            Call {SITE.helpline}
          </a>
          <h3 className="mt-8 text-base" data-aos="fade-up">
            Other services
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {SERVICES.filter((x) => x.slug !== s.slug).map((x) => (
              <li key={x.slug}>
                <Link href={`/services/${x.slug}`} className="hover:text-iris">
                  {x.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
