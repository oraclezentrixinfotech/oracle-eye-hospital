"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import StatsCounters from "@/components/StatsCounters";

const SERVICES_DATA = [
  {
    num: "01",
    title: "Cataract Services",
    slug: "/cataract-service",
    short: "Cataract is the clouding of the natural crystalline lens.",
    img: "/Assets/img/services/1.png",
  },
  {
    num: "02",
    title: "Cornea, Refractive Services",
    slug: "/cornea-refractive-service",
    short: "The cornea plays a crucial role in focusing light and maintaining clear vision.",
    img: "/Assets/img/services/5.png",
  },
  {
    num: "03",
    title: "Computer Vision Syndrome",
    slug: "/computer-vision-syndrome",
    short: "Computer vision syndrome (CVS) is a temporary eye vision problem resulting.",
    img: "/Assets/img/services/6.png",
  },
  {
    num: "04",
    title: "Dry Eyes Clinic",
    slug: "/dry-eyes-clinic",
    short: "Our dedicated Dry Eyes Clinic offers a comprehensive approach to treatment, moving past temporary fixes.",
    img: "/Assets/img/services/10.png",
  },
  {
    num: "05",
    title: "Contact Lens Service",
    slug: "/contact-lens-service",
    short: "Premium contact lenses fitted by experts for your daily comfort.",
    img: "/Assets/img/services/7.png",
  },
  {
    num: "06",
    title: "Myopia Clinic",
    slug: "/myopia-clinic",
    short: "Myopia (nearsightedness) is becoming increasingly common among children worldwide.",
    img: "/Assets/img/services/9.png",
  },
  {
    num: "07",
    title: "Pediatric Eye Services",
    slug: "/pediatric-eye-service",
    short: "A Squint or Strabismus develops when the eye muscles do not work in a balanced way.",
    img: "/Assets/img/services/3.png",
  },
  {
    num: "08",
    title: "Orthoptics Service",
    slug: "/orthoptics-service",
    short: "Specialized binocular vision care for better alignment and focus.",
    img: "/Assets/img/services/8.png",
  },
  {
    num: "09",
    title: "Vitreoretinal Services",
    slug: "/vitreoretinal-service",
    short: "Diabetes is a leading cause of blindness in the world.",
    img: "/Assets/img/services/4.png",
  },
  {
    num: "10",
    title: "Glaucoma Services",
    slug: "/glaucoma-service",
    short: "Glaucoma results from damage to the optic nerve.",
    img: "/Assets/img/services/2.png",
  },
];

const DOCTORS_DATA = [
  {
    name: "Dr Girjesh Kain",
    quals: "MS (Ophthalmology), FICO Founder & Managing Director",
    img: "/Assets/img/team/3.png",
    slug: "/girjesh-kain",
  },
  {
    name: "Dr Rachana",
    quals: "MBBS, MS",
    img: "/Assets/img/team/8.png",
    slug: "/rachana",
  },
  {
    name: "Dr Ramesh Kumar shukla",
    quals: "Glaucoma Surgeon",
    img: "/Assets/img/team/1.png",
    slug: "/ramesh-kumar",
  },
  {
    name: "Dr Sujata Tomar",
    quals: "Ophthalmologist",
    img: "/Assets/img/team/6.png",
    slug: "/sujata-tomar",
  },
];

const FAQS_DATA = [
  {
    id: "collapseOne",
    q: "1. What services does Oracle Eye Hospital provide?",
    a: "We specialize in comprehensive eye care, including general eye check-ups, cataract surgery, LASIK & refractive procedures, glaucoma management, corneal treatments, pediatric ophthalmology, retina care, and advanced diagnostic testing.",
  },
  {
    id: "collapseTwo",
    q: "2. Do I need an appointment before visiting?",
    a: "Walk-ins are welcome, but we recommend booking an appointment to minimize waiting time and ensure you get personalized care from our specialists.",
  },
  {
    id: "collapseThree",
    q: "3. How do I book an appointment?",
    a: "You can book online through our website, call our hospital helpline, or visit our reception desk directly.",
  },
  {
    id: "collapseFour",
    q: "4. What should I bring for my first consultation?",
    a: "Please bring a valid ID, your previous medical/eye reports (if any), current prescription glasses or contact lenses, and a list of medications you are taking.",
  },
];

const TESTIMONIALS_DATA = [
  {
    name: "Rohit Sharma,",
    role: "Patient",
    text: "“I underwent cataract surgery at Oracle Eye Hospital and the experience was excellent. The doctors were very professional and the staff was extremely supportive throughout the process.”",
    img: "/Assets/img/testimonial/clients-1.jpg",
  },
  {
    name: "Neha Verma,",
    role: "Patient",
    text: "“The consultation process was smooth and well-organized. The doctors explained everything clearly and made me feel comfortable before my LASIK procedure.”",
    img: "/Assets/img/testimonial/clients-2.jpg",
  },
  {
    name: "Amit Gupta,",
    role: "Patient",
    text: "“Highly recommended hospital for eye care. The facilities are modern and the team is very experienced. My vision has improved significantly after treatment.”",
    img: "/Assets/img/testimonial/clients-3.jpg",
  },
];

const GALLERY_IMAGES = [
  "/Assets/img/gallery/1.png",
  "/Assets/img/gallery/2.png",
  "/Assets/img/gallery/3.png",
  "/Assets/img/gallery/4.png",
  "/Assets/img/gallery/5.png",
  "/Assets/img/gallery/3.png",
  "/Assets/img/gallery/6.png",
];



export default function Home() {
  const [activeFaq, setActiveFaq] = useState("collapseOne");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  // Active/Hovered Service for left image preview
  const [hoveredServiceIdx, setHoveredServiceIdx] = useState(0);

  // Appointment Form state
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    PhoneNumber: "",
    AppointmentDate: "",
    DoctorName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Testimonials auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // DexignZone Image Tooltip Effect exactly matching oracleeyehospital.com custom.js
  useEffect(() => {
    const handleMouseEnter = function (e) {
      if (window.innerWidth <= 991) return;

      // Remove existing tooltip & remove active from other cards
      document.querySelectorAll(".image-tooltip").forEach((el) => el.remove());
      document.querySelectorAll(".image-tooltip-effect").forEach((el) => el.classList.remove("active"));

      const url = this.getAttribute("data-url");
      const tip = document.createElement("div");
      tip.className = "image-tooltip overflow-visible";
      tip.style.width = "300px";

      const img = document.createElement("img");
      img.src = url;
      img.className = "title";
      img.alt = "Service Preview";
      img.style.width = "300px";
      img.style.height = "auto";
      img.style.aspectRatio = "354 / 429";
      img.style.objectFit = "cover";
      img.style.borderRadius = "15px";

      tip.appendChild(img);
      document.body.appendChild(tip);

      // Trigger scale: 1, opacity: 1
      setTimeout(() => {
        img.style.scale = "1";
        img.style.opacity = "1";
      }, 20);

      this.classList.add("active");

      // Set initial top matching e.pageY - 100
      const mouseY = e.pageY - 100;
      tip.style.top = `${mouseY}px`;
    };

    const handleMouseMove = function (e) {
      if (window.innerWidth <= 991) return;
      const mouseX = e.pageX + 50;
      const mouseY = e.pageY - 100;
      const tip = document.querySelector(".image-tooltip");
      if (!tip) return;
      const img = tip.querySelector("img");
      const tipWidth = tip.offsetWidth || 300;

      // tilt & scale effect matching custom.js
      if (img) {
        if (mouseX > 900) {
          img.style.transform = "rotate(5deg)";
          img.style.scale = "1.1";
        } else if (mouseX > 800) {
          img.style.transform = "rotate(0deg)";
          img.style.scale = "1";
        } else {
          img.style.transform = "rotate(-5deg)";
          img.style.scale = "1";
        }
      }

      // boundary check matching custom.js
      let left = mouseX;
      if (mouseX + tipWidth + 60 > window.innerWidth) {
        left = mouseX - tipWidth - 60;
      }

      tip.style.top = `${mouseY}px`;
      tip.style.left = `${left}px`;
    };

    const handleMouseLeave = function () {
      document.querySelectorAll(".image-tooltip").forEach((el) => el.remove());
      this.classList.remove("active");
    };

    const cards = document.querySelectorAll(".image-tooltip-effect");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
      document.querySelectorAll(".image-tooltip").forEach((el) => el.remove());
    };
  }, []);



  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.Name,
          email: formData.Email,
          phone: formData.PhoneNumber,
          doctor: formData.DoctorName,
          preferredDate: formData.AppointmentDate || undefined,
        }),
      });

      if (res.ok) {
        setBookingMessage("Thank you! Your appointment request has been submitted successfully. Our team will contact you shortly.");
        setShowBookingSuccess(true);
        setFormData({
          Name: "",
          Email: "",
          PhoneNumber: "",
          AppointmentDate: "",
          DoctorName: "",
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setBookingMessage(data.error || "Failed to submit appointment request. Please call us.");
        setShowBookingSuccess(true);
      }
    } catch {
      setBookingMessage("Failed to submit request. Please call us directly.");
      setShowBookingSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ========================================================
          1. HERO BANNER
      ======================================================== */}
      <div className="hero-banner style-1">
        <div className="container-fluid">
          <div className="inner-wrapper">
            <div className="row align-items-center h-100">
              <div className="col-lg-5 m-b30">
                <div className="hero-content">
                  <h1 className="title " data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
                    Clear Vision Awaits
                  </h1>
                  <p data-aos="fade-up">
                    LASER Eye Correction Treatment, Retinal Surgery Services, Microincision Cataract Surgery
                  </p>
                  <div className="contant-box style-1 " data-aos="fade-up" data-aos-delay="800">
                    <Link className="btn btn-primary btn-hover2 btn-shadow mb-3" href="/appointment">
                      Appointment
                      <i className="feather icon-arrow-right"></i>
                    </Link>
                    <Link className="video-btn style-2" href="/contact-us">
                      Get In Touch!
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-7 align-self-end">
                <div className="hero-thumbnail" data-bottom-top="transform: translateY(-50px)" data-top-bottom="transform: translateY(50px)">
                  <div className="row g-4">
                    <div className="col-5">
                      <div className="row justify-content-end">
                        <div className="col-10 m-b30">
                          <div className="dz-media video-bx4 h-auto">
                            <Image
                              src="/Assets/img/banner2.webp"
                              alt="Video Thumbnail"
                              className="thumbnail"
                              width={335}
                              height={275}
                              priority
                              unoptimized
                            />
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowVideoModal(true);
                              }}
                              className="popup-youtube video-btn sm"
                              aria-label="Play Video"
                            >
                              <i className="fa fa-play"></i>
                            </a>
                          </div>
                        </div>
                        <div className="col-12 m-b30">
                          <Image
                            className="thumbnail"
                            src="/Assets/img/banner3.webp"
                            alt="Hospital Care"
                            width={429}
                            height={470}
                            priority
                            unoptimized
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-7 m-b30">
                      <Image
                        className="thumbnail2"
                        src="/Assets/img/banner1.webp"
                        alt="Main Surgeon"
                        width={545}
                        height={775}
                        priority
                        unoptimized
                        fetchPriority="high"
                        sizes="(max-width: 768px) 100vw, 545px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="banner-shape4"></div>
        <div className="banner-shape5"></div>
        <div className="banner-shape6"></div>
        <div className="item1">
          <div className="dz-media2">
            <img src="/Assets/images/hero-banner/img2.png" alt="Shape" />
          </div>
        </div>
        <div className="item4" data-bottom-top="transform: translateY(-50px)" data-top-bottom="transform: translateY(50px)">
          <img src="/Assets/images/hero-banner/img4.png" alt="Shape" />
        </div>
        <div className="item5 hero-shape-mobile" data-bottom-top="transform: translateY(-50px)" data-top-bottom="transform: translateY(50px)">
          <img src="/Assets/images/hero-banner/img5.png" alt="Shape" />
        </div>
      </div>

      {/* ========================================================
          2. ABOUT / WELCOME TO OPHTHALMOLOGY SECTION
      ======================================================== */}
      <section
        className="content-inner overlay-opacity-10 overflow-hidden bg-light"
        style={{ backgroundImage: "url(/Assets/images/background/bg7.webp)" }}
      >
        <div className="container">
          <div className="row content-wrapper style-1 m-b30 justify-content-center">
            <div className="col-xxl-6 col-xl-6 col-lg-6">
              <div className="content-media m-b30">
                <div className="dz-media">
                  <img src="/Assets/img/about/2.png" className="side-media" alt="Doctor Side" loading="lazy" decoding="async" />
                  <img src="/Assets/img/about/1.png" alt="Doctor Main" loading="lazy" decoding="async" />
                </div>

                <div className="item1" data-bottom-top="transform: translateY(-30px)" data-top-bottom="transform: translateY(30px)">
                  <div className="svg-rotate-wrapper">
                    <svg viewBox="0 0 100 100" className="rotating-text-svg">
                      <defs>
                        <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                      </defs>
                      <text fill="#ffffff" fontSize="13" wordSpacing="-4" letterSpacing="3">
                        <textPath href="#circlePath">ORACLE &nbsp;&nbsp;&nbsp; EYE &nbsp;&nbsp;&nbsp; HOSPITAL &nbsp;&nbsp;&nbsp;</textPath>
                      </text>
                    </svg>
                    <i className="icon feather icon-arrow-up-right center-arrow-icon"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-xl-6 col-lg-6">
              <div className="section-head style-14 m-b30 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
                <span className="sub-title">Welcome to Ophthalmology</span>
                <h2 className="title" data-aos="fade-up">We Preserve, Enhance And Protect Your Vision</h2>
                <p data-aos="fade-up">Trusted ophthalmic care with world-class expertise, advanced technology, and compassionate treatment for patients of all ages.</p>
              </div>

              <StatsCounters />

              <Link className="btn btn-primary btn-hover2 btn-shadow m-r30 mb-3 mb-sm-0" href="/overview">
                Read More <i className="feather icon-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. OUR SERVICES SECTION (With Interactive Tooltip Hover)
      ======================================================== */}
      <section className="content-inner overflow-hidden position-relative">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-md-8 section-head style-14 m-b30 text-center">
              <span className="sub-title m-b0 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="700">Our Services</span>
              <h2 className="title m-b0 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="700">We Serve In Different Areas For Our Patients</h2>
            </div>
          </div>

          <div className="row justify-content-end">
            <div className="col-xl-8">
              <div className="row dz-tooltip-blog " data-aos="fade-up" data-aos-delay="800">
                <div className="col-12">
                  {SERVICES_DATA.map((srv, idx) => (
                    <div
                      key={srv.slug}
                      className={`dz-card style-1 image-tooltip-effect ${idx === 0 ? "active" : ""}`}
                      data-url={srv.img}
                    >
                      <div className="dz-info">
                        <span className="small-title">{srv.num}</span>
                        <h3 className="dz-title" data-aos="fade-up">
                          <Link href={srv.slug}>{srv.title}</Link>
                        </h3>
                        <p data-aos="fade-up">{srv.short}</p>
                        <Link className="btn-link" href={srv.slug} aria-label={`View ${srv.title}`}>
                          <i className="feather icon-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. APPOINTMENT FORM SECTION
      ======================================================== */}
      <section className="content-wrapper style-2">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-7">
              <div className="content-info">
                <div className="section-head style-3 m-b40">
                  <h2 className="title text-white m-b0 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
                    Need a comprehensive eye check-up
                  </h2>
                </div>

                <div className="form-wrapper">
                  <div className="form-body">
                    <form id="appointmentForm" className="dzForm" onSubmit={handleAppointmentSubmit}>
                      <div className="row g-5 align-items-end">
                        {/* Name */}
                        <div className="col-xl-4 col-sm-6 " data-aos="fade-up" data-aos-delay="300" data-aos-duration="800">
                          <div className="floating-underline underline-1 input-white input-icon-left">
                            <input
                              name="Name"
                              type="text"
                              className="form-control"
                              id="inputYourName"
                              placeholder="Your Name"
                              required
                              value={formData.Name}
                              onChange={handleFormChange}
                            />
                            <span className="input-group-text">
                              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.9827 17.9043C9.47052 17.9043 5.61719 18.5865 5.61719 21.3187C5.61719 24.051 9.44608 24.7576 13.9827 24.7576C18.495 24.7576 22.3472 24.0743 22.3472 21.3432C22.3472 18.6121 18.5194 17.9043 13.9827 17.9043Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.9794 14.0065C16.9406 14.0065 19.3406 11.6054 19.3406 8.64431C19.3406 5.6832 16.9406 3.2832 13.9794 3.2832C11.0183 3.2832 8.61722 5.6832 8.61722 8.64431C8.60722 11.5954 10.9917 13.9965 13.9417 14.0065H13.9794Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="col-xl-4 col-sm-6 " data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
                          <div className="floating-underline underline-1 input-white input-icon-left">
                            <input
                              name="Email"
                              type="email"
                              className="form-control"
                              id="inputYourEmail"
                              placeholder="Your Email"
                              required
                              value={formData.Email}
                              onChange={handleFormChange}
                            />
                            <span className="input-group-text">
                              <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.8888 8.32617L14.705 12.5414C13.7256 13.3184 12.3476 13.3184 11.3682 12.5414L6.14062 8.32617" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M18.7296 22.5C22.2779 22.5098 24.6693 19.5945 24.6693 16.0114V7.99835C24.6693 4.4153 22.2779 1.5 18.7296 1.5H7.2756C3.72736 1.5 1.33594 4.4153 1.33594 7.99835V16.0114C1.33594 19.5945 3.72736 22.5098 7.2756 22.5H18.7296Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="col-xl-4 col-sm-6 " data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
                          <div className="floating-underline underline-1 input-white input-icon-left">
                            <input
                              type="tel"
                              name="PhoneNumber"
                              id="PhoneNumber"
                              placeholder="Phone No"
                              className="form-control"
                              required
                              pattern="[6-9]\d{9}"
                              maxLength={10}
                              value={formData.PhoneNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, "");
                                setFormData((prev) => ({ ...prev, PhoneNumber: val }));
                              }}
                            />
                            <span className="input-group-text">
                              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.7422 0.916992C20.06 1.39649 23.4714 4.80316 23.9555 9.12099" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M15.7422 5.0498C17.8084 5.45114 19.423 7.06697 19.8255 9.13314" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.8727 12.5514C16.5265 17.2041 17.5823 11.8215 20.5454 14.7826C23.4021 17.6385 25.0452 18.2107 21.4246 21.8292C20.9712 22.1935 18.0907 26.577 7.96781 16.4566C-2.15637 6.33499 2.22443 3.45151 2.58887 2.99827C6.217 -0.630188 6.78056 1.02127 9.63723 3.87721C12.5991 6.83957 7.21889 7.89881 11.8727 12.5514Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="col-xl-4 col-sm-6 " data-aos="fade-up" data-aos-delay="500" data-aos-duration="800">
                          <div className="floating-underline underline-1 input-white input-icon-left">
                            <input
                              name="AppointmentDate"
                              type="date"
                              className="form-control"
                              id="dateTimePickerOnly"
                              placeholder="Date"
                              required
                              value={formData.AppointmentDate}
                              onChange={handleFormChange}
                            />
                            <span className="input-group-text">
                              <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.60938 11.9608H24.404" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18.9446 5.16504H9.06612C5.63999 5.16504 3.5 7.07363 3.5 10.5819V21.1398C3.5 24.7033 5.63999 26.656 9.06612 26.656H18.9338C22.3708 26.656 24.5 24.7364 24.5 21.2281V10.5819C24.5108 7.07363 22.3816 5.16504 18.9446 5.16504Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Doctor Select */}
                        <div className="col-xl-4 col-sm-6 " data-aos="fade-up" data-aos-delay="700" data-aos-duration="800">
                          <div className="floating-underline underline-1 input-white input-icon-left">
                            <select
                              name="DoctorName"
                              className="form-control"
                              required
                              value={formData.DoctorName}
                              onChange={handleFormChange}
                            >
                              <option value="">Select Doctor Name</option>
                              <option value="Dr Girjesh Kain">Dr Girjesh Kain</option>
                              <option value="Dr Rachana">Dr Rachana</option>
                              <option value="Dr Ramesh Kumar">Dr Ramesh Kumar</option>
                              <option value="Dr Sujata Tomar">Dr Sujata Tomar </option>
                            </select>
                            <span className="input-group-text">
                              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.8672 12.713C22.4947 12.4843 23.7477 11.089 23.7512 9.39851C23.7512 7.73251 22.5367 6.35118 20.9442 6.08984" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M23.0156 16.625C24.5918 16.8607 25.692 17.4125 25.692 18.55C25.692 19.3328 25.174 19.8415 24.3363 20.1612" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.8662 17.1074C10.1166 17.1074 6.91406 17.6756 6.91406 19.9448C6.91406 22.2128 10.0967 22.7973 13.8662 22.7973C17.6159 22.7973 20.8172 22.2349 20.8172 19.9646C20.8172 17.6943 17.6357 17.1074 13.8662 17.1074Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M13.8696 13.869C16.3301 13.869 18.3251 11.8752 18.3251 9.41351C18.3251 6.95301 16.3301 4.95801 13.8696 4.95801C11.4091 4.95801 9.4141 6.95301 9.4141 9.41351C9.40476 11.8658 11.3846 13.8608 13.8369 13.869H13.8696Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6.86838 12.713C5.23971 12.4843 3.98788 11.089 3.98438 9.39851C3.98438 7.73251 5.19887 6.35118 6.79138 6.08984" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M4.7154 16.625C3.13923 16.8607 2.03906 17.4125 2.03906 18.55C2.03906 19.3328 2.55706 19.8415 3.39473 20.1612" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="col-xl-4 col-sm-6 " data-aos="fade-up" data-aos-delay="800" data-aos-duration="800">
                          <button
                            type="submit"
                            id="btnSubmitAppointment"
                            disabled={isSubmitting}
                            className="btn w-100 btn-icon btn-white hover-secondary text-primary shadow-sm"
                            style={{ height: "52px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            {isSubmitting ? "Booking..." : "Book Appointment"} <i className="feather icon-arrow-right ms-2"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 align-self-end">
              <div className="content-media " data-aos="fade-up" data-aos-delay="1000" data-aos-duration="800">
                <img src="/Assets/img/book.png" alt="Doctor Illustration" />
              </div>
            </div>
          </div>
        </div>
        <img src="/Assets/img/bg4.png" className="shap" alt="Wave Shape" />
      </section>

      {/* ========================================================
          5. MEET OUR SPECIALISTS SECTION
      ======================================================== */}
      <section className="content-inner bg-light">
        <div className="container">
          <div className="section-head style-14 m-b30 text-center">
            <span className="sub-title m-b0 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="700">Meet Our Specialists</span>
            <h2 className="title m-b0 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="700">Our Team of Eye Doctors</h2>
            <p data-aos="fade-up">Our specialists have more than a decade of experience. Patient comfort and well-being is our topmost priority.</p>
          </div>

          <div className="row">
            {DOCTORS_DATA.map((doc, i) => (
              <div
                key={doc.slug}
                className="col-xl-3 col-sm-6 m-b30 " data-aos="fade-up"
                data-wow-delay={`${0.2 * (i + 1)}s`}
                data-aos-duration="800"
              >
                <div className="dz-team style-1 box-hover active">
                  <div className="dz-media">
                    <img src={doc.img} alt={doc.name} />
                  </div>
                  <div className="dz-content">
                    <div className="team-social">
                      <Link className="plus-btn" href={doc.slug} aria-label={`View profile of ${doc.name}`}>
                        <i className="icon feather icon-plus"></i>
                      </Link>
                    </div>
                    <h2 className="dz-name">
                      <Link href={doc.slug}>{doc.name}</Link>
                    </h2>
                    <span className="dz-position">{doc.quals}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. FREQUENTLY ASKED QUESTIONS SECTION
      ======================================================== */}
      <section className="content-inner-3 pb-0 overflow-hidden content-wrapper style-3">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-xxl-6 col-xl-6 m-b30 align-self-center order-1">
              <div className="content-info right">
                <div className="section-head style-14 m-0 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
                  <h2 className="title" data-aos="fade-up">Frequently Asked Questions</h2>
                </div>

                <div className="accordion dz-accordion style-1 " data-aos="fade-up" data-aos-delay="400" data-aos-duration="800" id="accordionExample">
                  {FAQS_DATA.map((faq) => {
                    const isOpen = activeFaq === faq.id;
                    return (
                      <div className="accordion-item" key={faq.id}>
                        <h2 className="accordion-header" data-aos="fade-up">
                          <button
                            className={`accordion-button ${isOpen ? "" : "collapsed"}`}
                            type="button"
                            onClick={() => setActiveFaq(isOpen ? "" : faq.id)}
                            aria-expanded={isOpen ? "true" : "false"}
                          >
                            {faq.q}
                          </button>
                        </h2>
                        <div
                          className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
                          style={{ display: isOpen ? "block" : "none" }}
                        >
                          <div className="accordion-body">
                            <p data-aos="fade-up">{faq.a}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-xl-6 order-xl-1 order-2">
              <div className="content-media">
                <div className="dz-media">
                  <img src="/Assets/img/faq.png" alt="FAQ Doctor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. CONTACT / HELPLINE SECTION
      ======================================================== */}
      <section className="content-wrapper style-4 content-inner" style={{ backgroundImage: "url(/Assets/img/bg1.jpg)" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-head style-14 m-b30">
                <h2 className="title m-b15 text-white " data-aos="fade-up" data-aos-delay="200" data-aos-duration="700">
                  Don't Hesitate To Contact Us Any Time
                </h2>
                <p className="text-white m-b10" data-aos="fade-up">If you have any questions, we are here to help.</p>
              </div>

              <div className="row">
                <div className="col-md-5 col-12">
                  <div className="info-widget style-4">
                    <div className="widget-media">
                      <svg className="m-r10" width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_16273_16624)">
                          <path d="M27.3676 17.5966L23.0601 29.7043C22.8874 30.1898 23.0994 30.7398 23.5336 30.9328C23.9678 31.1258 24.4598 30.8888 24.6324 30.4035L28.9399 18.2957C29.1126 17.8103 28.9006 17.2603 28.4664 17.0672C28.0323 16.8741 27.5402 17.1111 27.3676 17.5966Z" fill="#57EEE9" />
                          <path d="M30 21.9482C30 22.4719 30.4303 22.8964 30.9612 22.8964H34.5652L31.1013 30.6699C30.8876 31.1493 31.1084 31.7088 31.5944 31.9196C32.0804 32.1303 32.6476 31.9125 32.8612 31.4331L36.9177 22.3298C37.1969 21.7032 36.7317 21 36.0377 21H30.9612C30.4304 20.9999 30 21.4244 30 21.9482Z" fill="#57EEE9" />
                          <path d="M23.1281 20.4168H22.9355C22.9474 18.2131 22.954 15.8269 22.929 15.5007C22.8757 14.8065 22.4943 14.2412 21.957 14.0602C21.4251 13.8809 20.8573 14.1078 20.4383 14.667C19.9538 15.3133 17.5795 19.9784 17.1085 20.907C16.9595 21.2008 16.9643 21.5583 17.1211 21.8472C17.2779 22.136 17.5634 22.3133 17.8719 22.3133H21.1799C21.1757 22.9263 21.1714 23.5146 21.1672 24.0436C21.1631 24.5673 21.55 24.9955 22.0316 25H22.0393C22.5172 25 22.9068 24.5808 22.911 24.0599C22.9135 23.7372 22.9184 23.1006 22.9239 22.3132H23.1281C23.6096 22.3132 24 21.8887 24 21.365C24 20.8413 23.6096 20.4168 23.1281 20.4168ZM21.1914 20.4168H19.3531C20.0494 19.0612 20.7312 17.7579 21.2025 16.8891C21.2033 17.7924 21.1986 19.0805 21.1914 20.4168Z" fill="#57EEE9" />
                          <path d="M16.0118 23.0812C15.032 23.0932 13.9904 23.1008 13.1509 23.1016C13.6658 22.4348 14.3997 21.4642 15.4118 20.0593C15.9943 19.2508 16.3738 18.488 16.5399 17.7918C16.5658 17.653 16.6058 17.373 16.6105 17.2324C16.6105 15.4501 15.1179 14 13.2833 14C11.697 14 10.3239 15.0964 10.0185 16.6068C9.91458 17.1206 10.2591 17.6189 10.788 17.7199C11.3168 17.8207 11.8298 17.4861 11.9337 16.9723C12.0598 16.3488 12.6274 15.8962 13.2833 15.8962C14.0236 15.8962 14.6292 16.4674 14.6577 17.18L14.6279 17.4062C14.5118 17.8556 14.2377 18.3822 13.8128 18.9721C12.3562 20.9938 11.4871 22.0993 11.0202 22.6933C10.442 23.4289 10.2026 23.7333 10.3702 24.2629C10.4682 24.5724 10.7097 24.81 11.0329 24.9147C11.1629 24.9568 11.2955 25 13.0779 25C13.7771 25 14.7303 24.9933 16.0363 24.9774C16.5753 24.9708 17.0067 24.541 16.9999 24.0175C16.9932 23.4937 16.5497 23.0766 16.0118 23.0812Z" fill="#57EEE9" />
                          <path d="M37.4796 0C36.7515 0 36.1612 0.590273 36.1612 1.31836V4.62858C32.2574 1.63389 27.5047 0.0108984 22.502 0.0108984C16.492 0.0108984 10.8417 2.35125 6.59203 6.60103C3.38437 9.80859 1.24309 13.8509 0.399696 18.291C-0.423311 22.6235 0.0299407 27.0605 1.71059 31.1224C1.98893 31.7952 2.76 32.115 3.4328 31.8366C4.1056 31.5583 4.42544 30.7872 4.14709 30.1144C1.06424 22.6637 2.75587 14.166 8.45645 8.46536C12.2082 4.71366 17.1962 2.64753 22.502 2.64753C26.6263 2.64753 30.5584 3.89663 33.8673 6.21475H31.2648C30.5367 6.21475 29.9464 6.80502 29.9464 7.53311C29.9464 8.26119 30.5367 8.85147 31.2648 8.85147H37.4796C38.2077 8.85147 38.798 8.26119 38.798 7.53311V1.31836C38.798 0.590273 38.2078 0 37.4796 0Z" fill="#57EEE9" />
                          <path d="M7.52148 44.9996C8.24957 44.9996 8.83984 44.4093 8.83984 43.6812V40.371C12.7437 43.3657 17.4964 44.9887 22.4992 44.9887C28.5091 44.9887 34.1595 42.6484 38.4091 38.3986C41.6168 35.1909 43.7581 31.1486 44.6016 26.7086C45.4246 22.3761 44.9713 17.9391 43.2907 13.8772C43.0123 13.2044 42.2413 12.8846 41.5685 13.163H41.5684C40.8956 13.4413 40.5758 14.2124 40.8542 14.8852C43.9369 22.3358 42.2452 30.8335 36.5446 36.5341C32.7929 40.2858 27.8049 42.3519 22.4991 42.3519C18.3748 42.3519 14.4427 41.1028 11.1338 38.7847H13.7363C14.4644 38.7847 15.0547 38.1944 15.0547 37.4663C15.0547 36.7382 14.4644 36.148 13.7363 36.148H7.52148C6.7934 36.148 6.20312 36.7382 6.20312 37.4663V43.6812C6.20312 44.4093 6.79331 44.9996 7.52148 44.9996Z" fill="#57EEE9" />
                        </g>
                        <defs>
                          <clipPath id="clip0_16273_16624">
                            <rect width="45" height="45" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className="widget-content">
                      <h3 className="title" data-aos="fade-up">24 x 7 Helpline </h3>
                    </div>
                  </div>
                </div>

                <div className="col-md-5 col-12">
                  <div className="info-widget style-4">
                    <div className="widget-media">
                      <svg className="m-r10" width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_16273_16636)">
                          <path d="M35.5627 27.8755C34.6414 26.9163 33.5302 26.4034 32.3525 26.4034C31.1843 26.4034 30.0636 26.9068 29.1044 27.866L26.1031 30.8578C25.8562 30.7248 25.6093 30.6013 25.3718 30.4779C25.0299 30.3069 24.707 30.1455 24.4316 29.9745C21.6203 28.189 19.0654 25.8621 16.6151 22.8513C15.4279 21.3507 14.6301 20.0875 14.0507 18.8054C14.8295 18.0931 15.5514 17.3522 16.2542 16.6399C16.5201 16.374 16.786 16.0986 17.052 15.8326C19.0465 13.8381 19.0465 11.2548 17.052 9.26033L14.4591 6.66749C14.1647 6.37307 13.8608 6.06915 13.5759 5.76523C13.006 5.17638 12.4077 4.56853 11.7903 3.99868C10.8691 3.08691 9.76734 2.60254 8.60864 2.60254C7.44993 2.60254 6.32922 3.08691 5.37947 3.99868C5.36997 4.00818 5.36997 4.00818 5.36047 4.01768L2.1313 7.27534C0.915614 8.49103 0.222292 9.97264 0.070331 11.6917C-0.15761 14.465 0.65918 17.0483 1.28602 18.7389C2.82462 22.8893 5.12303 26.7358 8.55165 30.8578C12.7116 35.825 17.7168 39.7475 23.4343 42.5113C25.6188 43.5465 28.5345 44.7717 31.7922 44.9806C31.9916 44.9901 32.2006 44.9996 32.3905 44.9996C34.5845 44.9996 36.427 44.2113 37.8706 42.6442C37.8801 42.6253 37.8991 42.6158 37.9086 42.5968C38.4025 41.9984 38.9723 41.4571 39.5707 40.8777C39.9791 40.4883 40.397 40.0799 40.8054 39.6525C41.7456 38.6743 42.2395 37.5346 42.2395 36.3664C42.2395 35.1887 41.7361 34.0585 40.7769 33.1087L35.5627 27.8755ZM38.9628 37.8765C38.9533 37.886 38.9533 37.8765 38.9628 37.8765C38.5924 38.2754 38.2125 38.6363 37.8041 39.0352C37.1868 39.624 36.56 40.2414 35.9711 40.9347C35.0118 41.9604 33.8816 42.4448 32.4 42.4448C32.2576 42.4448 32.1056 42.4448 31.9631 42.4353C29.1424 42.2548 26.521 41.1531 24.555 40.2129C19.1794 37.6105 14.4591 33.916 10.5366 29.2337C7.29797 25.3302 5.13253 21.7211 3.6984 17.8461C2.81513 15.4812 2.49221 13.6387 2.63467 11.9006C2.72965 10.7894 3.15704 9.86817 3.94533 9.07987L7.184 5.84121C7.64938 5.40432 8.14326 5.16688 8.62763 5.16688C9.22598 5.16688 9.71035 5.52779 10.0143 5.83171C10.0238 5.84121 10.0333 5.8507 10.0428 5.8602C10.6221 6.40156 11.173 6.96192 11.7523 7.56026C12.0468 7.86419 12.3507 8.16811 12.6546 8.48153L15.2474 11.0744C16.2542 12.0811 16.2542 13.0119 15.2474 14.0186C14.972 14.294 14.7061 14.5695 14.4306 14.8354C13.6328 15.6522 12.873 16.412 12.0468 17.1528C12.0278 17.1718 12.0088 17.1813 11.9993 17.2003C11.1825 18.0171 11.3344 18.8149 11.5054 19.3562C11.5149 19.3847 11.5244 19.4132 11.5339 19.4417C12.2082 21.0753 13.158 22.6139 14.6016 24.4469L14.6111 24.4564C17.2324 27.6856 19.9962 30.2024 23.0449 32.1304C23.4343 32.3774 23.8332 32.5768 24.2131 32.7668C24.555 32.9377 24.878 33.0992 25.1534 33.2702C25.1914 33.2891 25.2294 33.3176 25.2674 33.3366C25.5903 33.4981 25.8942 33.5741 26.2076 33.5741C26.9959 33.5741 27.4898 33.0802 27.6512 32.9187L30.8994 29.6706C31.2223 29.3477 31.7352 28.9583 32.3335 28.9583C32.9224 28.9583 33.4068 29.3287 33.7012 29.6516C33.7107 29.6611 33.7107 29.6611 33.7202 29.6706L38.9533 34.9037C39.9316 35.8725 39.9316 36.8697 38.9628 37.8765Z" fill="#57EEE9" />
                          <path d="M24.321 10.7037C26.8094 11.1216 29.0698 12.2993 30.8743 14.1038C32.6789 15.9083 33.8471 18.1688 34.2745 20.6571C34.3789 21.284 34.9203 21.7208 35.5376 21.7208C35.6136 21.7208 35.6801 21.7113 35.7561 21.7018C36.4589 21.5879 36.9243 20.923 36.8103 20.2202C36.2974 17.2095 34.8728 14.4647 32.6979 12.2898C30.5229 10.1148 27.7781 8.69019 24.7674 8.17732C24.0646 8.06335 23.4092 8.52873 23.2858 9.22205C23.1623 9.91538 23.6182 10.5897 24.321 10.7037Z" fill="#57EEE9" />
                          <path d="M44.9452 19.8504C44.0999 14.8927 41.7635 10.3814 38.1734 6.79131C34.5833 3.20123 30.072 0.86483 25.1143 0.0195474C24.421 -0.103921 23.7656 0.370957 23.6422 1.06428C23.5282 1.7671 23.9936 2.42243 24.6964 2.5459C29.1222 3.2962 33.1587 5.39516 36.3689 8.59584C39.5791 11.806 41.6685 15.8425 42.4188 20.2683C42.5233 20.8952 43.0647 21.3321 43.682 21.3321C43.758 21.3321 43.8245 21.3226 43.9004 21.3131C44.5938 21.2086 45.0686 20.5438 44.9452 19.8504Z" fill="#57EEE9" />
                        </g>
                        <defs>
                          <clipPath id="clip0_16273_16636">
                            <rect width="45" height="45" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className="widget-content">
                      <h3 className="title" data-aos="fade-up">
                        <a href="tel:+91 8006803111" className="text-white">+91 8006803111</a>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <Link className="btn btn-icon w-auto btn-white hover-secondary text-primary shadow-sm" href="/contact-us">
                More details <i className="feather icon-arrow-right"></i>
              </Link>
            </div>

            <div className="col-lg-6 align-self-end">
              <div className="content-media " data-aos="fade-up" data-aos-delay="1000" data-aos-duration="800">
                <img src="/Assets/img/img3.png" alt="Medical Team" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. CASHLESS TPA LIST SECTION
      ======================================================== */}
      <section className="TPA_section bg-light overflow-hidden" style={{ backgroundImage: "url(/Assets/images/background/bg7.webp)", backgroundSize: "cover" }}>
        <div className="container">
          <div className="section-head style-14 text-center m-b30">
            <h2 className="title m-b0 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="700">Cashless TPA list</h2>
          </div>
          <div className="d-flex justify-content-center">
            <div className="col-md-9">
              <div className="tpa_div">
                <Link href="/CashlessFacility">
                  <img src="/Assets/img/about/tpa.png" alt="Cashless TPA Partners" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. TESTIMONIALS SECTION (With Floating Avatars)
      ======================================================== */}
      <section className="content-inner testimonial-wrapper1 overflow-hidden">
        <div className="container">
          <div className="section-head style-14 text-center m-b30">
            <span className="sub-title m-b0 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="700">Testimonial</span>
            <h2 className="title m-b0 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="700">Patient Success Stories</h2>
          </div>

          <div className="swiper testimonial-swiper1 " data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
            <div className="swiper-wrapper">
              <div className="swiper-slide" style={{ width: "100%" }}>
                <div className="testimonial-1">
                  <div className="testimonial-media">
                    <img src={TESTIMONIALS_DATA[activeTestimonial].img} alt={TESTIMONIALS_DATA[activeTestimonial].name} />
                  </div>
                  <div className="testimonial-detail">
                    <div className="testimonial-contant">
                      <div className="testimonial-text">
                        <p data-aos="fade-up">{TESTIMONIALS_DATA[activeTestimonial].text}</p>
                      </div>
                    </div>
                    <div className="testimonial-info">
                      <div className="clearfix">
                        <h3 className="testimonial-name" data-aos="fade-up">{TESTIMONIALS_DATA[activeTestimonial].name}</h3>
                        <span className="testimonial-position">{TESTIMONIALS_DATA[activeTestimonial].role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination Bullet Indicators */}
            <div className="testimonial-pagination-swiper3 swiper-pagination style-2 d-flex justify-content-center gap-2 mt-4">
              {TESTIMONIALS_DATA.map((_, i) => (
                <span
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`swiper-pagination-bullet cursor-pointer ${
                    activeTestimonial === i ? "swiper-pagination-bullet-active" : ""
                  }`}
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: activeTestimonial === i ? "#00a297" : "#cbd5e1",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                ></span>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Avatars in background */}
        <div className="avatar1"><img src="/Assets/img/testimonial/clients-1.jpg" alt="Patient 1" loading="lazy" decoding="async" /></div>
        <div className="avatar2"><img src="/Assets/img/testimonial/clients-2.jpg" alt="Patient 2" loading="lazy" decoding="async" /></div>
        <div className="avatar3"><img src="/Assets/img/testimonial/clients-3.jpg" alt="Patient 3" loading="lazy" decoding="async" /></div>
        <div className="avatar4"><img src="/Assets/img/testimonial/clients-5.jpg" alt="Patient 4" loading="lazy" decoding="async" /></div>
        <div className="avatar5"><img src="/Assets/img/testimonial/clients-1.jpg" alt="Patient 5" loading="lazy" decoding="async" /></div>
        <div className="avatar6"><img src="/Assets/img/testimonial/clients-2.jpg" alt="Patient 6" loading="lazy" decoding="async" /></div>
        <div className="avatar7"><img src="/Assets/img/testimonial/clients-3.jpg" alt="Patient 7" loading="lazy" decoding="async" /></div>
        <div className="avatar8"><img src="/Assets/img/testimonial/clients-5.jpg" alt="Patient 8" loading="lazy" decoding="async" /></div>

        <div className="bg-shap"><img src="/Assets/images/background/bg5.webp" alt="Background Shape" loading="lazy" decoding="async" /></div>
      </section>

      {/* ========================================================
          10. PORTFOLIO / GALLERY SECTION (Continuous Marquee)
      ======================================================== */}
      <div className="container-fluid p-0 portfolio_section">
        <div className="portfolio-slider-wrapper">
          <div className="portfolio-slider-track">
            {/* Set 1 */}
            {GALLERY_IMAGES.map((src, i) => (
              <div className="portfolio-slide-item" key={`orig-${i}`}>
                <div className="dz-media">
                  <img src={src} loading="lazy" alt={`Gallery photo ${i + 1}`} />
                </div>
              </div>
            ))}
            {/* Set 2 (for continuous infinite scroll) */}
            {GALLERY_IMAGES.map((src, i) => (
              <div className="portfolio-slide-item" key={`repeat-${i}`}>
                <div className="dz-media">
                  <img src={src} loading="lazy" alt={`Gallery photo ${i + 1} repeat`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          VIDEO POPUP MODAL (Playing the exact reference hospital video)
      ======================================================== */}
      {showVideoModal && (
        <div
          className="booking-popup-overlay"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="position-relative bg-black rounded-4 overflow-hidden shadow-2xl"
            style={{ width: "90%", maxWidth: "860px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3"
              style={{ filter: "invert(1)" }}
              aria-label="Close Video"
            ></button>
            <div className="ratio ratio-16x9">
              <video
                controls
                autoPlay
                src="https://oracleeyehospital.com/assets/img/gallery/video.mp4"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              >
                Your browser does not support video playback.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BOOKING CONFIRMATION POPUP (Interactive Feedback)
      ======================================================== */}
      {showBookingSuccess && (
        <div className="booking-popup-overlay" onClick={() => setShowBookingSuccess(false)}>
          <div className="booking-popup-box" onClick={(e) => e.stopPropagation()}>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "70px", height: "70px", backgroundColor: "#e6f7f5", color: "#00a297" }}
            >
              <i className="feather icon-check" style={{ fontSize: "36px" }}></i>
            </div>
            <h3 className="h4 fw-bold text-dark mb-2" data-aos="fade-up">Appointment Booked!</h3>
            <p className="text-muted small mb-4" data-aos="fade-up">{bookingMessage}</p>
            <button
              type="button"
              className="btn btn-primary btn-hover2 w-100"
              onClick={() => setShowBookingSuccess(false)}
            >
              OK, Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
