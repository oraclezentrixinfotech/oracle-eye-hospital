import Link from "next/link";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "News & Events | Oracle Eye Hospital",
  description: "Stay updated with the latest news, events, and announcements from Oracle Eye Hospital, Moradabad.",
};

function formatNewsDate(isoStr) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function NewsPage() {
  const newsPosts = await getPosts("NEWS");

  return (
    <>
      <div
        className="dz-bnr-inr style-1 dz-bnr-inr-sm"
        style={{ backgroundImage: "url(/Assets/img/inner-bg.jpg)" }}
      >
        <div className="container">
          <div className="dz-bnr-inr-entry d-table-cell">
            <h1 data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
              News & Events
            </h1>
          </div>
        </div>
      </div>

      <section className="content-inner-1 bg-light overflow-hidden content-wrapper style-3">
        <div className="container">
          {newsPosts.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No news updates available currently. Please check back later.</p>
            </div>
          ) : (
            <div className="row">
              {newsPosts.map((post) => (
                <div key={post.id} className="col-xl-4 col-lg-4 col-md-4 col-12 m-b30">
                  <div className="dz-card style-3">
                    <div className="dz-media">
                      <img
                        src={post.image || "/Assets/img/inner-bg.jpg"}
                        alt={post.title}
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="dz-info">
                      <span className="date_div">
                        <i className="fa fa-calendar" aria-hidden="true"></i> {formatNewsDate(post.createdAt)}
                      </span>
                      <h3 className="dz-title" data-aos="fade-up">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <Link className="btn-link icon-link-hover-end" href={`/blog/${post.slug}`}>
                        Read more <i className="feather icon-arrow-right"></i>
                      </Link>
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
