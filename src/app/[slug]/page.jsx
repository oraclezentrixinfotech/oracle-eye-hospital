import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceContentClient from "@/app/services/[slug]/ServiceContentClient";
import {
  generateHospitalSchema,
  generatePhysicianSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateProcedureSchema,
  HOSPITAL_INFO,
} from "@/app/(seo_pages)/_lib/schema";

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
    console.error("generateMetadata Root SEO Page DB error:", err?.message || err);
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
      `https://www.oracleeyehospital.com/${seoPage.slug}`;
    const ogImg =
      seoPage.ogImage ||
      seoPage.heroImage ||
      "https://www.oracleeyehospital.com/Assets/img/services/Cataract-Service.png";

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

  return {};
}

export default async function RootSeoPage({ params }) {
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
      if (relatedServices.length === 0) {
        relatedServices = await prisma.seoPage.findMany({
          where: { NOT: { id: seoPage.id }, status: "published" },
          select: { id: true, slug: true, h1Title: true, heroBadge: true },
          take: 4,
        });
      }
    }
  } catch (err) {
    console.error("RootSeoPage DB query error:", err?.message || err);
  }

  // If no published SEO Page found in DB -> 404
  if (!seoPage) {
    notFound();
  }

  const pageUrl =
    seoPage.canonicalUrl ||
    `https://www.oracleeyehospital.com/${seoPage.slug}`;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: seoPage.h1Title, url: `/${seoPage.slug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const faqSchema =
    Array.isArray(seoPage.faqs) && seoPage.faqs.length > 0
      ? generateFAQSchema(seoPage.faqs)
      : null;
  const hospitalSchema = generateHospitalSchema();
  const procedureSchema = generateProcedureSchema({
    name: seoPage.h1Title,
    description: seoPage.metaDescription || seoPage.heroSubtitle,
    url: pageUrl,
  });
  const physicianSchema =
    doctors.length > 0
      ? generatePhysicianSchema({
          name: doctors[0].name,
          qualification: doctors[0].qualification,
          specialty: doctors[0].role,
          jobTitle: doctors[0].role,
          url: doctors[0].profileHref,
          image: doctors[0].image,
        })
      : null;

  // MedicalWebPage Schema
  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${pageUrl}/#medicalwebpage`,
    name: seoPage.metaTitle || seoPage.h1Title,
    description: seoPage.metaDescription || seoPage.heroSubtitle,
    url: pageUrl,
    headline: seoPage.h1Title,
    inLanguage: "en-IN",
    audience: {
      "@type": "MedicalAudience",
      audienceType: "Patients & Family",
    },
    lastReviewed: seoPage.updatedAt ? new Date(seoPage.updatedAt).toISOString() : new Date().toISOString(),
    publisher: {
      "@type": "Hospital",
      name: HOSPITAL_INFO.name,
      url: HOSPITAL_INFO.url,
    },
  };

  return (
    <>
      {/* Structured JSON-LD Data for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureSchema) }}
      />
      {physicianSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }}
      />
      {seoPage.customSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoPage.customSchema }}
        />
      )}

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
