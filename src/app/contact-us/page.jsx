"use client";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    PhoneNumber: "",
    Address: "",
    Message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(formData.PhoneNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.Name,
          email: formData.Email,
          phone: formData.PhoneNumber,
          subject: formData.Address ? `Address: ${formData.Address}` : "Website Enquiry",
          message: formData.Message,
        }),
      });
      if (res.ok) {
        setShowSuccess(true);
        setFormData({
          Name: "",
          Email: "",
          PhoneNumber: "",
          Address: "",
          Message: "",
        });
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to send message. Please call us.");
      }
    } catch {
      alert("Failed to send message. Please call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="dz-bnr-inr style-1 dz-bnr-inr-sm" style={{ backgroundImage: "url(/Assets/img/inner-bg.jpg)" }}>
        <div className="container">
          <div className="dz-bnr-inr-entry d-table-cell">
            <h1 className="" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">Contact Us</h1>
          </div>
        </div>
      </div>

      <section className="content-inner bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-sm-6 m-b30 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
              <div className="icon-bx-wraper style-5 bg-white box-hover">
                <div className="contact_img">
                  <img src="/Assets/img/contact3.jpg" alt="Address" />
                </div>
                <div className="icon-content">
                  <h3 className="dz-title fw-semibold" data-aos="fade-up">Address</h3>
                  <p data-aos="fade-up">
                    <a href="https://www.google.com/maps/search/?api=1&query=Oracle+Eye+Hospital+491+Hi+Street+Near+TDI+City+Parampara+MDA+Moradabad+Uttar+Pradesh+244001" target="_blank" rel="noopener noreferrer">
                      491, Hi-Street, Near TDI City, Parampara, MDA, Moradabad, Uttar Pradesh-244001, India
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 m-b30 " data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
              <div className="icon-bx-wraper style-5 bg-white box-hover">
                <div className="contact_img">
                  <img src="/Assets/img/contact1.jpg" alt="Call Us" />
                </div>
                <div className="icon-content">
                  <h3 className="dz-title fw-semibold" data-aos="fade-up">Call Us</h3>
                  <p data-aos="fade-up">
                    <a href="tel:+918006803111" className="text-body">+91 8006803111</a><br />
                    <a href="tel:+917500503111" className="text-body">+91 7500503111</a>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 m-b30 " data-aos="fade-up" data-aos-delay="600" data-aos-duration="800">
              <div className="icon-bx-wraper style-5 bg-white box-hover active">
                <div className="contact_img">
                  <img src="/Assets/img/contact2.jpg" alt="Email Us" />
                </div>
                <div className="icon-content">
                  <h3 className="dz-title fw-semibold" data-aos="fade-up">Send us a Mail</h3>
                  <p data-aos="fade-up">
                    <a href="mailto:oracleeyehospital@gmail.com" className="text-body">oracleeyehospital@gmail.com</a><br />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-inner content-wrapper style-7 pb-0 bg-white overflow-hidden" style={{ backgroundImage: "url(/Assets/images/background/bg7.webp)" }}>
        <div className="container">
          <div className="row align-items-end justify-content-between">
            <div className="col-xl-6 col-lg-6 pe-xl-5  order-lg-1 order-2" data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
              <div className="content-media">
                <div className="dz-media">
                  <img src="/Assets/img/contact.png" alt="Contact Illustration" />
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6 m-b30  order-lg-2 order-1" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
              <div className="content-info m-0">
                <div className="form-wrapper style-1 bg-light">
                  <div className="form-body">
                    <div className="section-head style-1 mb-3">
                      <h2 className="title fw-semibold m-b0" data-aos="fade-up">Get in Touch</h2>
                      <p className="m-b0">You Can Reach Us Anytime</p>
                    </div>
                    <form id="contactForm" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-sm-6 m-b20 " data-aos="fade-up" data-aos-delay="100">
                          <div className="floating-underline underline-1 input-icon-left">
                            <span className="input-group-text text-primary"><i className="feather icon-user"></i></span>
                            <input name="Name" type="text" className="form-control" placeholder="Your Name" required value={formData.Name} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="col-sm-6 m-b20 " data-aos="fade-up" data-aos-delay="200">
                          <div className="floating-underline underline-1 input-icon-left">
                            <span className="input-group-text text-primary"><i className="feather icon-mail"></i></span>
                            <input name="Email" type="email" className="form-control" placeholder="Your Email" required value={formData.Email} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="col-sm-6 m-b20 " data-aos="fade-up" data-aos-delay="300">
                          <div className="floating-underline underline-1 input-icon-left">
                            <span className="input-group-text text-primary"><i className="feather icon-phone"></i></span>
                            <input
                              name="PhoneNumber"
                              type="tel"
                              className="form-control dz-number"
                              placeholder="Phone Number"
                              required
                              pattern="[6-9]\d{9}"
                              maxLength={10}
                              value={formData.PhoneNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, "");
                                setFormData((prev) => ({ ...prev, PhoneNumber: val }));
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-sm-6 m-b20 " data-aos="fade-up" data-aos-delay="400">
                          <div className="floating-underline underline-1 input-icon-left">
                            <span className="input-group-text text-primary"><i className="feather icon-home"></i></span>
                            <input name="Address" required type="text" className="form-control dz-address" placeholder="Your Address" value={formData.Address} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="col-sm-12 m-b20 " data-aos="fade-up" data-aos-delay="500">
                          <div className="floating-underline underline-1">
                            <textarea name="Message" className="form-control" rows={2} placeholder="Write Message" required value={formData.Message} onChange={handleChange}></textarea>
                          </div>
                        </div>

                        <div className="col-sm-12 m-t10 " data-aos="fade-up" data-aos-delay="600">
                          <button type="submit" id="btnSubmit" className="btn btn-lg btn-primary w-100" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Message"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="clearfix">
        <div className="map-wrapper style-1">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13975.305150734877!2d78.74642614296583!3d28.87378453253998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390af989bedcdbff%3A0x2a5de317f0ed8e54!2sOracle%20Eye%20Hospital%20-%20Best%20Eye%20Care%20in%20Moradabad%20(Dr%20Girjesh%20Kain%20%2F%20Cataract%20Surgeon%2F%20Free%20Cataract%20Surgery%20in%20Moradabad))!5e0!3m2!1sen!2sin!4v1780402841525!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Hospital Location Map"
          ></iframe>
        </div>
      </div>

      {showSuccess && (
        <div className="booking-popup-overlay" onClick={() => setShowSuccess(false)}>
          <div className="booking-popup-box" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 text-success" style={{ fontSize: "50px" }}>✓</div>
            <h3 className="mb-2" data-aos="fade-up">Message Sent!</h3>
            <p className="text-muted" data-aos="fade-up">Thank you! Your message has been sent successfully. Our team will contact you shortly.</p>
            <button className="btn btn-primary mt-3" onClick={() => setShowSuccess(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}
