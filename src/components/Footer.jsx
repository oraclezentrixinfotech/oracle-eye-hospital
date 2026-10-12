import Link from "next/link";

export default function Footer({ settings = {} }) {
  const phone = settings.phone || "+91 8006803111";
  const email = settings.email || "oracleeyehospital@gmail.com";
  const address = settings.address || "491, Hi-Street, Near TDI City, Parampara, MDA, Moradabad, Uttar Pradesh-244001, India";
  const workingHours = settings.working_hours || "Mon – Sat, 10:00 AM – 8:00 PM";
  const facebook = settings.facebook || "https://www.facebook.com/oracleeyehospital/";
  const instagram = settings.instagram || "https://www.instagram.com/oracleeyehospital/";

  return (
    <footer className="site-footer style-1" style={{ backgroundImage: "url(/Assets/images/background/bg3.webp)" }}>
      {/* Footer Top */}
      <div className="footer-top">
        <div className="container">
          <div className="row">
            {/* Widget About */}
            <div className="col-xl-4 col-sm-12 wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="0.8s">
              <div className="widget widget_about me-2">
                <div className="footer-logo logo-white">
                  <Link href="/">
                    <img src="/uploads/logos/bb48fa7a-e46d-4dc6-932c-0e8e15a72925.png" alt="Oracle Eye Hospital" />
                  </Link>
                </div>
                <p>
                  Providing world-class treatments in cataract, LASIK, retina, glaucoma, pediatric ophthalmology, and more.
                </p>

                <div className="widget-rating2">
                  <img src="/Assets/images/google.svg" alt="Google Ratings" />
                  <div className="clearfix">
                    <div className="d-flex">
                      <ul className="star-list">
                        <li><i className="fa fa-star"></i></li>
                        <li><i className="fa fa-star"></i></li>
                        <li><i className="fa fa-star"></i></li>
                        <li><i className="fa fa-star"></i></li>
                        <li><i className="fa fa-star"></i></li>
                      </ul>
                      <span className="rating ms-1">(4.2)</span>
                    </div>
                    <span className="text">12k+ ratings on google</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-xl-2 col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.4s" data-wow-duration="0.8s">
              <div className="widget widget_services">
                <h2 className="footer-title">Quick Links </h2>
                <ul className="list-hover1">
                  <li><Link href="/"><span>Home</span></Link></li>
                  <li><Link href="/overview"><span>About Us</span></Link></li>
                  <li><Link href="/community-outreach"><span>Community Outreach</span></Link></li>
                  <li><Link href="/career"><span>Career</span></Link></li>
                  <li><Link href="/contact-us"><span>Contact Us</span></Link></li>
                  <li><Link href="/doctor-team"><span>Doctor's Team</span></Link></li>
                </ul>
              </div>
            </div>

            {/* Contacts Us */}
            <div className="col-xl-3 col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.6s" data-wow-duration="0.8s">
              <div className="widget widget-getintouch">
                <h2 className="footer-title">Contacts Us</h2>
                <ul>
                  <li>
                    <a href={`mailto:${email}`}>
                      <i className="feather icon-mail"></i> <span>{email}</span>
                    </a>
                  </li>
                  <li>
                    <a href={`tel:${phone}`}>
                      <i className="feather icon-phone-call"></i>{phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="feather icon-map-pin"></i>
                      {address}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Working Hours */}
            <div className="col-xl-3 col-lg-6 col-sm-12 wow fadeInUp" data-wow-delay="0.6s" data-wow-duration="0.8s">
              <div className="widget me-2">
                <h2 className="footer-title">Working Hours</h2>
                <p className="text-white">{workingHours}</p>

                <Link className="btn btn-icon btn-white hover-secondary text-primary shadow-sm" href="/appointment">
                  Get Appointment <i className="feather icon-arrow-right"></i>
                </Link>

                <div className="dz-social-icon mt-4">
                  <ul>
                    <li>
                      <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <i className="fa-brands fa-facebook-f"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Top End */}

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="fb-inner">
            <div className="row">
              <div className="col-lg-6 col-md-12 text-start">
                <p className="copyright-text"> © Copyright 2026 By Oracle Eye Hospital. All Right Reserved </p>
              </div>
              <div className="col-lg-6 col-md-12 text-end">
                <p>Designed By <a href="https://www.zentrixinfotech.com/" target="_blank" rel="noopener noreferrer">Zentrix Infotech</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Bottom End */}
    </footer>
  );
}
