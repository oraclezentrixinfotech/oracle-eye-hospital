"use client";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="dz-bnr-inr style-1 dz-bnr-inr-sm" style={{ backgroundImage: "url(/Assets/img/inner-bg.jpg)" }}>
        <div className="container">
          <div className="dz-bnr-inr-entry d-table-cell">
            <h1 className="" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">Community Outreach</h1>
          </div>
        </div>
      </div>

      <section className="content-inner">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 m-b10 ps-xl-5">
              <div className="section-head style-6 m-b30 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
                <p className="fw-normal" data-aos="fade-up">
                  At <b>Oracle Eye Hospital,</b> we believe that restoring vision is more than a medical service - it’s a gift of independence, dignity, and hope.
                  Through our outreach programs, we bring advanced eye care directly to the communities that need it most.
                </p>
              </div>

              <div className="clearfix m-b50 m-md-b20 " data-aos="fade-up" data-aos-delay="600" data-aos-duration="800">
                <h3 className="text-primary title-dashed-separator" data-aos="fade-up">Touching Lives Every Day</h3>
                <ul className="list-check text-secondary fw-medium m-b35">
                  <li>
                    <b>Free Eye Camps :</b> Thousands of patients in rural and underserved areas receive screenings, consultations, and life-changing treatments.
                  </li>
                  <li>
                    <b>School Eye Health Programs : </b>Children are given the chance to see clearly, learn better, and dream bigger.
                  </li>
                  <li>
                    <b>Senior Citizen Care :</b> Specialized support for cataract, glaucoma, and age-related vision problems, helping elders regain confidence in daily life.
                  </li>
                  <li>
                    <b>Awareness Campaigns : </b>Educating families about preventive eye care, early detection, and the importance of regular check-ups.
                  </li>
                </ul>
              </div>

              <h3 className="text-primary title-dashed-separator" data-aos="fade-up">
                Patient Stories
              </h3>

              <ul className="list-check text-secondary fw-medium m-b35">
                <li>
                  <i>“I had been living with blurred vision for years. After attending the free camp, I received cataract surgery at Oracle Eye Hospital. Today, I can see my grandchildren’s faces clearly again.”</i>
                </li>
                <li>
                  <i>“My son struggled in school because he couldn’t read the blackboard. Thanks to the school eye program, he now wears glasses and his grades have improved.”</i>
                </li>
              </ul>

              <h3 className="text-primary title-dashed-separator" data-aos="fade-up">
                Our Mission
              </h3>
              <p data-aos="fade-up">To eliminate avoidable blindness and ensure that every individual, regardless of background, has access to world-class eye care.</p>

              <h3 className="text-primary title-dashed-separator" data-aos="fade-up">
                How You Can Help
              </h3>
              <p data-aos="fade-up">Your support allows us to reach more people in need:</p>
              <ul className="list-check text-secondary fw-medium m-b35">
                <li>Volunteer at our outreach programs</li>
                <li>Partner with us for community initiatives</li>
                <li>Contribute resources or donations</li>
              </ul>

              <h3 className="text-primary title-dashed-separator" data-aos="fade-up">
                Connect With Us
              </h3>
              <p data-aos="fade-up">For details on upcoming outreach programs or to collaborate, reach us at:</p>
              <ul className="list-check text-secondary fw-medium m-b35">
                <li><b>Phone : </b><a href="tel:+91-7500603111">+91-7500603111</a></li>
                <li><b>Email : </b> <a href="mailto:admin@oracleeyehospital.com">admin@oracleeyehospital.com</a></li>
              </ul>
              <p data-aos="fade-up">Together, let’s bring the <b>gift of sight</b> to every community.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
