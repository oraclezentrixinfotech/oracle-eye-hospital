"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Calendar,
  Stethoscope,
  ArrowRight,
  ListOrdered,
} from "lucide-react";
import AppointmentForm from "@/components/AppointmentForm";
import "../_components/seo-landing.css";

// ============================================================================
// 1. FAQS CONFIGURATION (Easily editable for any keyword / procedure)
// ============================================================================
export const DEFAULT_CATARACT_FAQS = [
  {
    question: "What is the recovery time after cataract surgery in Moradabad?",
    answer:
      "Most patients notice improved vision within 24 to 48 hours following micro-incision phacoemulsification surgery. You can resume basic indoor activities, walking, and reading the very next day. Complete corneal stabilization and final lens settling generally take 2 to 4 weeks, during which prescribed antibiotic and anti-inflammatory eye drops must be used as advised by our specialists.",
  },
  {
    question: "Is cataract surgery painful or does it require injections?",
    answer:
      "No. At Oracle Eye Hospital in Moradabad, modern cataract surgery is performed using topical anesthesia (numbing eye drops). It is completely stitchless, blade-free, and injection-free for the vast majority of cases. Patients feel virtually no pain during the 10 to 15 minute procedure.",
  },
  {
    question: "What types of intraocular lenses (IOLs) are available?",
    answer:
      "We provide a comprehensive range of US-FDA approved foldable intraocular lenses, including Monofocal IOLs (clear distance vision, reading glasses needed), Toric IOLs (correcting corneal astigmatism alongside cataracts), Multifocal & Trifocal IOLs (freedom from glasses for distance, intermediate computer distance, and near reading), and Extended Depth of Focus (EDOF) lenses.",
  },
  {
    question: "Is cataract surgery covered by health insurance and cashless TPA in Moradabad?",
    answer:
      "Yes. Oracle Eye Hospital is empaneled with major health insurance companies, TPAs (Third Party Administrators), and corporate healthcare panels. Our dedicated cashless insurance helpdesk assists you with instant eligibility verification, pre-authorization, and paperless claims.",
  },
  {
    question: "How do I know if I need cataract surgery?",
    answer:
      "If you experience blurred or foggy vision, sensitivity to glare from headlights during night driving, fading colors, double vision in one eye, or rapid changes in spectacle power, you should undergo a comprehensive slit-lamp evaluation at Oracle Eye Hospital. Surgery is recommended when the cataract begins interfering with your daily lifestyle, reading, or driving.",
  },
  {
    question: "Why is phacoemulsification better than traditional cataract surgery?",
    answer:
      "Phacoemulsification uses gentle ultrasonic energy through a microscopic 1.8 mm to 2.2 mm incision to emulsify and remove the clouded lens. Because the opening is self-sealing, no stitches are required, induced astigmatism is minimized, infection risks are extremely low, and visual recovery is significantly faster than older surgical methods.",
  },
  {
    question: "Can both eyes be operated on the same day?",
    answer:
      "For patient safety and optimal post-operative tracking, international ophthalmology guidelines recommend operating on one eye at a time. Typically, the second eye is scheduled within 3 to 7 days once the first eye shows healthy healing and stable vision.",
  },
];

// ============================================================================
// 2. RELATED KEYWORD PAGES (For internal linking & SEO topical authority)
// ============================================================================
const RELATED_KEYWORD_PAGES = [
  {
    name: "LASIK Eye Surgery in Moradabad",
    href: "/services/cornea-refractive-service",
    desc: "Blade-free laser vision correction for complete freedom from glasses.",
  },
  {
    name: "Glaucoma Treatment in Moradabad",
    href: "/services/glaucoma-service",
    desc: "Early detection, pressure monitoring & laser treatment for optic nerve care.",
  },
  {
    name: "Retina Specialist & Vitreoretinal Care",
    href: "/services/vitreoretinal-service",
    desc: "Advanced management of diabetic retinopathy and retinal detachments.",
  },
  {
    name: "Pediatric Eye Care & Squint Evaluation",
    href: "/services/pediatric-eye-service",
    desc: "Specialized child-friendly eye examinations and strabismus management.",
  },
];

export default function Content({ faqs = DEFAULT_CATARACT_FAQS }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [tocOpen, setTocOpen] = useState(true);
  const rowRef = useRef(null);
  const sidebarColRef = useRef(null);
  const [sidebarStyle, setSidebarStyle] = useState({});

  useEffect(() => {
    let ticking = false;

    const updateSidebarPosition = () => {
      if (typeof window === "undefined") return;

      // Only fix position on desktop (>= 992px)
      if (window.innerWidth < 992) {
        setSidebarStyle({});
        return;
      }

      if (!rowRef.current || !sidebarColRef.current) return;

      const rowRect = rowRef.current.getBoundingClientRect();
      const colRect = sidebarColRef.current.getBoundingClientRect();
      const topOffset = 90; // distance from top of viewport below header
      const formCard = sidebarColRef.current.querySelector(".seo-sticky-appointment-card");
      const cardHeight = formCard ? formCard.offsetHeight : 380;

      // 1. Above content row: natural static position
      if (rowRect.top > topOffset) {
        setSidebarStyle({
          position: "relative",
          top: 0,
          left: "auto",
          width: "100%",
          zIndex: 30,
        });
      }
      // 2. Reached bottom of content row (expert doctors section): stop and park at bottom
      else if (rowRect.bottom <= topOffset + cardHeight) {
        setSidebarStyle({
          position: "absolute",
          bottom: 0,
          top: "auto",
          left: 0,
          width: "100%",
          zIndex: 30,
        });
      }
      // 3. Actively scrolling left-side content: strictly FIXED on screen
      else {
        setSidebarStyle({
          position: "fixed",
          top: `${topOffset}px`,
          left: `${colRect.left}px`,
          width: `${colRect.width}px`,
          zIndex: 90,
        });
      }
    };

    const handleScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateSidebarPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Run on mount
    updateSidebarPosition();

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <div className="seo-content-wrapper" style={{ backgroundColor: "#f8fafc" }}>
      {/* Main Reading Section: Standard Heading & Paragraph Structure */}
      <section className="seo-section py-5">
        <div className="container">
          <div className="row g-4 g-lg-5 seo-content-row" ref={rowRef}>
            {/* Left Column: Comprehensive Article in Paragraph & Heading Form */}
            <div className="col-lg-8">
              <article className="seo-article-container">
                {/* Block 1: Overview & Clinical Excellence */}
                <div className="seo-article-block" id="overview">
                  <span className="seo-badge-pill">Clinical Overview</span>
                  <h2 className="seo-article-h2">
                    Advanced Cataract Surgery in Moradabad: Safe, Stitchless &amp; Permanent Vision Restoration
                  </h2>
                  <p className="seo-article-p">
                    If you or your family members are noticing blurred, foggy vision or difficulty driving at night, you may be experiencing the early signs of a cataract. At <strong>Oracle Eye Hospital, Moradabad</strong>, we offer internationally recognized micro-incision phacoemulsification cataract surgery designed to restore crisp, high-definition eyesight in a gentle, walk-in outpatient setting.
                  </p>
                  <p className="seo-article-p">
                    Under the clinical leadership of <strong>Dr. Girjesh Kain (MS, FICO)</strong> and our team of senior ophthalmic surgeons, Oracle Eye Hospital has successfully performed over 25,000 eye surgeries. We combine NABH-aligned clinical hygiene with world-class Alcon Centurion&reg; phaco technology, ensuring every patient benefits from precision microsurgery with zero stitches, zero injections, and virtually zero downtime.
                  </p>

                  <div className="seo-article-callout">
                    <h4>Why Choose Oracle Eye Hospital for Cataract Care?</h4>
                    <p>
                      Our center is fully equipped with state-of-the-art optical biometry (IOL Master), sterile modular operation theaters, US-FDA approved foldable intraocular lenses, and a dedicated cashless insurance desk empaneled with all major TPAs.
                    </p>
                  </div>
                </div>

                {/* Block 2: What is a Cataract? Symptoms & Causes */}
                <div className="seo-article-block" id="understanding-cataract">
                  <h2 className="seo-article-h2">
                    What is a Cataract (Safed Motia) and Why Does It Occur?
                  </h2>
                  <p className="seo-article-p">
                    Inside every human eye is a natural crystalline lens that focuses light rays directly onto the retina, producing sharp, vibrant images. Over time, natural proteins within this lens begin to denature and clump together, causing the lens to turn cloudy, opaque, and rigid. This progressive clouding is medically classified as a <strong>cataract</strong>, widely known in Hindi as <em>Safed Motia</em>.
                  </p>
                  <p className="seo-article-p">
                    As the cataract advances, incoming light is blocked or scattered, making everyday scenes appear as though you are looking through a frosted bathroom window or a smoggy haze. Eye drops, ayurvedic remedies, or updated spectacles cannot dissolve or reverse this protein opacity. Safe surgical removal of the clouded lens and replacement with a permanent artificial Intraocular Lens (IOL) is the only proven, permanent treatment.
                  </p>

                  <h3 className="seo-article-h3">Common Warning Symptoms of Cataract</h3>
                  <p className="seo-article-p">
                    Recognizing cataract symptoms early helps prevent visual strain and accidental injuries. Consult an eye specialist if you experience:
                  </p>
                  <ul className="seo-article-list">
                    <li>Cloudy, misty, or blurred vision that does not clear even after blinking.</li>
                    <li>Extreme sensitivity to bright glare and halo rings around automobile headlights during night driving.</li>
                    <li>Colors appearing washed out, faded, or tinted with a brownish-yellow hue.</li>
                    <li>Frequent, unexplained changes in your eyeglass or reading lens power.</li>
                    <li>Double vision (diplopia) or overlapping shadowy images in a single eye.</li>
                    <li>Difficulty performing fine tasks like reading small newsprint, threading a needle, or working on smartphones.</li>
                  </ul>

                  <h3 className="seo-article-h3">Primary Causes and Risk Factors</h3>
                  <p className="seo-article-p">
                    While biological aging is the predominant cause of cataract development after age 45 to 50, several health and environmental factors can accelerate lens opacification:
                  </p>
                  <ul className="seo-article-list">
                    <li><strong>Diabetes Mellitus:</strong> Fluctuating high blood glucose accelerates protein glycation inside the lens.</li>
                    <li><strong>Ultraviolet (UV) Exposure:</strong> Long-term direct exposure to sunlight without UV-blocking eyewear.</li>
                    <li><strong>Physical Trauma or Injury:</strong> Past eye impact, blunt trauma, or previous ocular inflammation.</li>
                    <li><strong>Corticosteroid Medications:</strong> Prolonged usage of oral, inhaled, or topical steroid medicines.</li>
                    <li><strong>Lifestyle &amp; Diet:</strong> Excessive smoking, nutritional deficiencies, and chronic dehydration.</li>
                  </ul>
                </div>

                {/* Block 3: Modern Treatment Options & Lens Technology */}
                <div className="seo-article-block" id="treatment-technology">
                  <h2 className="seo-article-h2">
                    Advanced Surgical Techniques &amp; Premium Intraocular Lens (IOL) Options
                  </h2>
                  <p className="seo-article-p">
                    Gone are the days when cataract surgery required large incisions, hospital admissions, or dark eye patches. At Oracle Eye Hospital in Moradabad, we perform <strong>Micro-Incision Cataract Surgery (MICS)</strong> using advanced phacoemulsification technology.
                  </p>
                  <p className="seo-article-p">
                    During phacoemulsification, high-frequency ultrasonic energy emulsifies the clouded lens through a self-sealing 1.8 mm to 2.2 mm opening. Because the incision is microscopic and contoured, it seals automatically with natural fluid pressure — meaning <strong>no stitches are needed</strong> and the risk of infection or induced astigmatism is minimized.
                  </p>

                  <h3 className="seo-article-h3">Selecting the Right Intraocular Lens for Your Lifestyle</h3>
                  <p className="seo-article-p">
                    After the cataract is cleared, an artificial Intraocular Lens (IOL) is permanently inserted to take over focusing light. We offer a full spectrum of US-FDA approved foldable lenses:
                  </p>
                  <p className="seo-article-p">
                    <strong>1. Monofocal IOLs:</strong> The standard, highly reliable lens that restores crystal-clear clarity for a single fixed distance (typically far distance for driving, TV, and walking). Lightweight reading glasses are utilized for reading books, smartphones, or desk work.
                  </p>
                  <p className="seo-article-p">
                    <strong>2. Toric IOLs:</strong> Specifically engineered for individuals with pre-existing corneal astigmatism (cylindrical eyeglass number). Toric lenses correct both the cataract and astigmatism simultaneously, eliminating the need for distance cylindrical glasses.
                  </p>
                  <p className="seo-article-p">
                    <strong>3. Multifocal &amp; Trifocal IOLs:</strong> Designed with diffractive optical zones that split light into multiple focus points, providing sharp clarity across distance, intermediate computer distances, and near reading distances. Over 90% of patients achieve complete freedom from spectacles.
                  </p>
                  <p className="seo-article-p">
                    <strong>4. Extended Depth of Focus (EDOF) IOLs:</strong> Advanced optical technology providing a continuous, seamless channel of vision from distance through intermediate computer range, offering superior night-time contrast with virtually zero glare or halo rings.
                  </p>
                </div>

                {/* Block 4: Step-by-Step Surgical Workflow */}
                <div className="seo-article-block" id="surgical-procedure">
                  <h2 className="seo-article-h2">
                    Step-by-Step Procedure: What to Expect on Surgery Day
                  </h2>
                  <p className="seo-article-p">
                    We understand that any surgical procedure can cause initial anxiety. At Oracle Eye Hospital, our standardized outpatient protocol ensures a relaxing, comfortable, and reassuring experience from check-in to discharge:
                  </p>

                  <h3 className="seo-article-h3">Step 1: Precision Pre-Operative Diagnostic Evaluation</h3>
                  <p className="seo-article-p">
                    Before surgery, comprehensive optical biometry (IOL Master), corneal topography, and macula OCT scans are performed to measure your eye&apos;s dimensions down to the micron. This guarantees that your intraocular lens power is calculated with scientific exactness.
                  </p>

                  <h3 className="seo-article-h3">Step 2: Topical Drop Anesthesia (Zero Injections)</h3>
                  <p className="seo-article-p">
                    Your eye is completely numbed using gentle topical anesthetic eye drops. There are no painful syringe injections around the eye, ensuring you remain awake, relaxed, and fully comfortable throughout.
                  </p>

                  <h3 className="seo-article-h3">Step 3: Micro-Incision Phacoemulsification</h3>
                  <p className="seo-article-p">
                    Through a tiny 2 mm self-sealing tunnel, an ultrasonic probe emulsifies the clouded lens into microscopic particles and gently aspirates them out under continuous microfluidic regulation.
                  </p>

                  <h3 className="seo-article-h3">Step 4: Premium Foldable IOL Implantation &amp; Discharge</h3>
                  <p className="seo-article-p">
                    The chosen foldable IOL is loaded into a sterile cartridge and injected into the lens capsule, where it unfolds naturally into position. The entire procedure takes only 10 to 15 minutes. After resting comfortably in our day-care recovery lounge for 30 to 45 minutes, you are discharged to return home the very same day.
                  </p>
                </div>

                {/* Block 5: Post-Operative Recovery & Guidelines */}
                <div className="seo-article-block" id="recovery-care">
                  <h2 className="seo-article-h2">
                    Post-Operative Recovery Protocol &amp; Care Guidelines
                  </h2>
                  <p className="seo-article-p">
                    Visual recovery after modern micro-incision phacoemulsification is rapid. Most patients observe dramatically brighter colors and sharper clarity within 24 to 48 hours. Following our simple post-op guidelines ensures smooth, uneventful healing:
                  </p>
                  <ul className="seo-article-list">
                    <li><strong>Medicated Eye Drops:</strong> Instill prescribed antibiotic and anti-inflammatory eye drops strictly according to the schedule provided by your doctor.</li>
                    <li><strong>Protective Eye Shield:</strong> Wear the transparent eye shield while sleeping during the first week to avoid accidental rubbing or pressure.</li>
                    <li><strong>Water &amp; Hygiene Precautions:</strong> Prevent direct tap water, soap, or shampoo from splashing into the operated eye for 7 to 10 days. Clean your face gently using a moist clean towel.</li>
                    <li><strong>Physical Activity:</strong> Light indoor activities, gentle walking, watching television, and mobile reading can be resumed the day after surgery. Avoid heavy weight lifting, vigorous workouts, swimming, or bending forward for 3 weeks.</li>
                    <li><strong>Follow-Up Visits:</strong> Attend scheduled routine evaluations at Day 1, Week 1, and Month 1 to monitor lens stability and optimal healing.</li>
                  </ul>
                </div>

                {/* Block 6: Cost Factors & Cashless Insurance / TPA */}
                <div className="seo-article-block" id="cost-insurance">
                  <h2 className="seo-article-h2">
                    Cataract Surgery Cost Transparency &amp; Cashless TPA Facilities
                  </h2>
                  <p className="seo-article-p">
                    At Oracle Eye Hospital, we believe world-class eye care should be accessible and financially transparent. We provide upfront, transparent packages with zero hidden fees or unexpected post-procedure billing.
                  </p>
                  <p className="seo-article-p">
                    The overall package cost is primarily determined by your selection of Intraocular Lens (standard Indian monofocal, imported US-FDA monofocal, toric astigmatism-correcting lens, or premium trifocal/EDOF lens) and specific pre-operative diagnostic tests.
                  </p>
                  <p className="seo-article-p">
                    <strong>Cashless Insurance &amp; TPA Empanelment:</strong> We are empaneled with all major private health insurance providers, corporate panels, and Third Party Administrators (TPAs). Our dedicated insurance coordination desk assists you with immediate eligibility checks, pre-authorization documentation, and hassle-free paperless approvals so you can focus entirely on your recovery.
                  </p>
                </div>
              </article>
            </div>

            {/* Right Column: Sticky Sidebar with Table of Contents & Appointment Form */}
            <div className="col-lg-4 seo-sidebar-col" ref={sidebarColRef}>
              <aside
                className="seo-sticky-appointment-card"
                id="sidebar-appointment"
                style={sidebarStyle}
              >
                {/* Book an Appointment Form Box (Placed First) */}
                <div className="seo-sidebar-box seo-sidebar-form-box" style={{ marginBottom: "14px" }}>
                  <h4>
                    <Calendar size={18} color="#e8a33d" />
                    <span>Book an Appointment</span>
                  </h4>
                  <AppointmentForm initialService="Cataract Service" initialDoctor="Dr Girjesh Kain" />
                </div>

                {/* Table of Contents Card (Placed Below Form) */}
                <div className="seo-sidebar-box seo-sidebar-toc-box">
                  <div
                    className="seo-sidebar-toc-header"
                    onClick={() => setTocOpen(!tocOpen)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={tocOpen}
                  >
                    <h4>
                      <ListOrdered size={16} color="#137c8b" />
                      <span>Table of Contents</span>
                    </h4>
                    <span className="seo-sidebar-toc-toggle">
                      {tocOpen ? "Hide" : "Show"}
                      <ChevronDown
                        size={13}
                        style={{
                          transform: tocOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </span>
                  </div>

                  {tocOpen && (
                    <div className="seo-sidebar-toc-content">
                      <ul className="seo-sidebar-toc-list">
                        <li><a href="#overview">&bull; Overview</a></li>
                        <li><a href="#understanding-cataract">&bull; Symptoms</a></li>
                        <li><a href="#treatment-technology">&bull; IOL Lenses</a></li>
                        <li><a href="#surgical-procedure">&bull; Procedure</a></li>
                        <li><a href="#recovery-care">&bull; Recovery</a></li>
                        <li><a href="#cost-insurance">&bull; Cost &amp; TPA</a></li>
                        <li><a href="#expert-doctors">&bull; Doctors</a></li>
                        <li><a href="#faq-section">&bull; FAQs</a></li>
                      </ul>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Section */}
      <section className="seo-section" style={{ backgroundColor: "#ffffff" }} id="expert-doctors">
        <div className="container">
          <div className="seo-doctors-section">
            <div className="seo-section-title-wrap mb-4">
              <span className="seo-badge-pill" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#cfe7ea" }}>
                Expert Surgical Team
              </span>
              <h2 className="seo-section-h2 text-white">
                Meet Our Senior Cataract Specialists
              </h2>
              <p className="seo-section-desc text-white-50">
                Entrust your vision to dedicated ophthalmic surgeons who have restored sight to tens of thousands of patients across Western UP.
              </p>
            </div>

            <div className="row g-4 justify-content-center">
              {/* Dr. Girjesh Kain */}
              <div className="col-md-6 col-lg-5">
                <div className="seo-doctor-card">
                  <div className="seo-doctor-header">
                    <div className="seo-doctor-avatar">
                      <Image
                        src="/Assets/img/team/3.png"
                        alt="Dr. Girjesh Kain"
                        width={76}
                        height={76}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="seo-doctor-info">
                      <h4>Dr. Girjesh Kain</h4>
                      <div className="role">Founder &amp; Managing Director</div>
                      <div className="qual">MS (Ophthalmology), FICO</div>
                    </div>
                  </div>
                  <p className="seo-doctor-bio">
                    Dr. Kain is an internationally trained cataract and refractive surgeon with fellowship honors. He has spearheaded modern micro-incision surgery techniques in Moradabad for more than 15 years.
                  </p>
                  <div className="seo-doctor-footer">
                    <span className="text-white-50">25,000+ Surgeries Done</span>
                    <Link href="/girjesh-kain">
                      <span>View Profile</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dr. Rachana */}
              <div className="col-md-6 col-lg-5">
                <div className="seo-doctor-card">
                  <div className="seo-doctor-header">
                    <div className="seo-doctor-avatar" style={{ borderColor: "#137c8b" }}>
                      <Image
                        src="/Assets/img/team/8.png"
                        alt="Dr. Rachana"
                        width={76}
                        height={76}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="seo-doctor-info">
                      <h4>Dr. Rachana</h4>
                      <div className="role" style={{ color: "#cfe7ea" }}>Senior Ophthalmologist</div>
                      <div className="qual">MBBS, MS (Ophthalmology)</div>
                    </div>
                  </div>
                  <p className="seo-doctor-bio">
                    Dr. Rachana specializes in comprehensive eye diagnostics, complex cataract procedures, and customized intraocular lens selections to achieve optimal postoperative visual sharpness.
                  </p>
                  <div className="seo-doctor-footer">
                    <span className="text-white-50">Cataract &amp; Comprehensive Care</span>
                    <Link href="/rachana">
                      <span>View Profile</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="seo-section" style={{ backgroundColor: "#f8fafc" }} id="faq-section">
        <div className="container">
          <div className="seo-section-title-wrap">
            <span className="seo-badge-pill">Patient Questions</span>
            <h2 className="seo-section-h2">
              Frequently Asked Questions About Cataract Surgery in Moradabad
            </h2>
            <p className="seo-section-desc">
              Clear answers to help you make an informed decision for yourself and your family.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-9">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="seo-faq-item">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="seo-faq-btn"
                      aria-expanded={isOpen}
                    >
                      <span className="pe-3">{faq.question || faq.q}</span>
                      <ChevronDown
                        size={18}
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                          color: "#137c8b",
                          minWidth: "18px",
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div
                        className="seo-faq-body"
                        dangerouslySetInnerHTML={{ __html: faq.answer || faq.a || "" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Related Internal Links */}
      <section className="seo-section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <div className="seo-section-title-wrap">
            <span className="seo-badge-pill">Super-Specialty Care</span>
            <h2 className="seo-section-h2">Explore Related Eye Care Services in Moradabad</h2>
            <p className="seo-section-desc">
              Discover advanced super-specialty eye treatments available at Oracle Eye Hospital:
            </p>
          </div>

          <div className="row g-4">
            {RELATED_KEYWORD_PAGES.map((item, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <Link href={item.href} className="seo-related-card">
                  <div className="d-flex justify-content-between align-items-center text-primary">
                    <Stethoscope size={22} color="#137c8b" />
                    <ArrowRight size={16} color="#137c8b" />
                  </div>
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
