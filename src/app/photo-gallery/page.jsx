import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Photo Gallery | Oracle Eye Hospital",
  description: "View photos of our state-of-the-art infrastructure, operation theatres, and facilities at Oracle Eye Hospital, Moradabad.",
};

export default async function PhotoGalleryPage() {
  let photos = [];
  try {
    photos = await prisma.photo.findMany({
      where: { status: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.error("Failed to load photos from database:", err?.message || err);
  }

  return (
    <>
      <div
        className="dz-bnr-inr style-1 dz-bnr-inr-sm"
        style={{ backgroundImage: "url(/Assets/img/inner-bg.jpg)" }}
      >
        <div className="container">
          <div className="dz-bnr-inr-entry d-table-cell">
            <h1 data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
              Photo Gallery
            </h1>
          </div>
        </div>
      </div>

      <section className="content-inner-1 bg-light overflow-hidden content-wrapper style-3">
        <div className="container">
          {photos.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No photos available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="row">
              {photos.map((photo) => (
                <div key={photo.id} className="col-xxl-4 col-lg-4 col-md-6 m-b30">
                  <div className="dz-card style-3 h-100 d-flex flex-column shadow-sm rounded-3 overflow-hidden">
                    <div className="dz-media position-relative">
                      <a href={photo.image} target="_blank" rel="noopener noreferrer" title={photo.title}>
                        <img
                          src={photo.image}
                          alt={photo.title}
                          style={{ height: "260px", width: "100%", objectFit: "cover" }}
                        />
                      </a>
                    </div>
                    <div className="dz-info p-4 flex-grow-1 d-flex flex-column justify-content-between">
                      <h3 className="dz-title mb-3" data-aos="fade-up">
                        <span className="text-dark">{photo.title}</span>
                      </h3>
                      <a
                        className="btn-link icon-link-hover-end fw-semibold text-primary d-inline-flex align-items-center gap-1"
                        href={photo.image}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Photo <i className="feather icon-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
