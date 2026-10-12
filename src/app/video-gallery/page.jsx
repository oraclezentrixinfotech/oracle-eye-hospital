import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Video Gallery | Oracle Eye Hospital",
  description: "Watch informative videos, doctor talks, and hospital tours from Oracle Eye Hospital, Moradabad.",
};

function getEmbedUrl(url) {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

export default async function VideoGalleryPage() {
  let videos = [];
  try {
    videos = await prisma.video.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.error("Failed to load videos from database:", err?.message || err);
  }

  return (
    <>
      <div className="dz-bnr-inr style-1 dz-bnr-inr-sm" style={{ backgroundImage: "url(/Assets/img/inner-bg.jpg)" }}>
        <div className="container">
          <div className="dz-bnr-inr-entry d-table-cell">
            <h1 data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
              Video Gallery
            </h1>
          </div>
        </div>
      </div>

      <section className="content-inner-1 bg-light overflow-hidden content-wrapper style-3">
        <div className="container">
          {videos.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No videos available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="row">
              {videos.map((vid) => (
                <div key={vid.id} className="col-xxl-4 col-lg-4 m-b30">
                  <div className="dz-card style-3">
                    <iframe
                      src={getEmbedUrl(vid.url)}
                      className="video_frame"
                      style={{ border: 0 }}
                      allowFullScreen
                      title={vid.title}
                    ></iframe>
                    <div className="dz-info">
                      <h3 className="dz-title text-center" data-aos="fade-up">
                        {vid.title}
                      </h3>
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
