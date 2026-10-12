import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGalleryBySlug, getAllGallerySlugs } from "@/lib/galleryData";
import GalleryViewer from "@/components/GalleryViewer";

export function generateStaticParams() {
  return getAllGallerySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const gallery = getGalleryBySlug(slug);
  if (!gallery) return { title: "Gallery Not Found - Oracle Eye Hospital" };

  return {
    title: `${gallery.title} - Photo Gallery | Oracle Eye Hospital`,
    description: `View photos of ${gallery.title} at Oracle Eye Hospital, Moradabad. Modern eye care infrastructure and facilities.`,
    openGraph: {
      title: `${gallery.title} - Oracle Eye Hospital`,
      description: `View photos of ${gallery.title} at Oracle Eye Hospital, Moradabad.`,
      images: [{ url: gallery.coverImage }],
    },
  };
}

export default async function GalleryDetailPage({ params }) {
  const { slug } = await params;
  const gallery = getGalleryBySlug(slug);

  if (!gallery) {
    notFound();
  }

  return (
    <>
      {/* Banner */}
      <div
        className="dz-bnr-inr style-1 dz-bnr-inr-sm"
        style={{ backgroundImage: "url(/Assets/img/inner-bg.jpg)" }}
      >
        <div className="container">
          <div className="dz-bnr-inr-entry d-table-cell">
            <h1
              className="wow fadeInUp"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="800"
            >
              {gallery.bannerTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Gallery Section */}
      <section className="content-inner-1 bg-light overflow-hidden content-wrapper style-3">
        <div className="container">
          {/* Breadcrumb / Back Navigation */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <Link
              href="/photo-gallery"
              className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2"
              style={{
                borderRadius: "30px",
                padding: "8px 18px",
                fontWeight: "500",
                fontSize: "0.9rem",
              }}
            >
              <i className="feather icon-arrow-left"></i> Back to Gallery
            </Link>

            <span className="badge bg-secondary text-white py-2 px-3" style={{ fontSize: "0.85rem", borderRadius: "20px" }}>
              {gallery.items.length} Photos
            </span>
          </div>

          {/* Heading */}
          <div className="text-center pb-4">
            <h4 style={{ fontWeight: "700", color: "#1e293b", letterSpacing: "-0.5px" }}>
              <p className="mb-0">{gallery.heading}</p>
            </h4>
          </div>

          {/* Justified Gallery with Hover Animations and Photobox Lightbox */}
          <GalleryViewer items={gallery.items} title={gallery.title} />
        </div>
      </section>
    </>
  );
}
