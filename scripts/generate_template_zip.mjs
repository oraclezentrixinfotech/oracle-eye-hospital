import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const bannerTemplate = `"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Calendar, Clock, ShieldCheck, Award } from "lucide-react";

export default function Banner() {
  const helpline = "+91 8006803111";
  const cleanPhone = helpline.replace(/[^0-9+]/g, "");

  return (
    <section className="seo-hero-section">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="seo-breadcrumb">
          <Link href="/">Home</Link>
          <span className="mx-2 text-white-50">/</span>
          <Link href="/services">Services</Link>
          <span className="mx-2 text-white-50">/</span>
          <span className="active">[Your Procedure Name] in Moradabad</span>
        </nav>

        <div className="row align-items-center">
          {/* Left Column: Keyword Heading, Clinical Value, CTAs, Highlights */}
          <div className="col-lg-7 mb-0">
            {/* Accreditation Badge */}
            <div className="seo-trust-badge">
              <ShieldCheck size={16} color="#e8a33d" />
              <span>NABH-Aligned Centre &bull; 25,000+ Surgeries</span>
            </div>

            {/* Mobile Hero Graphic - Shown before Title on Phone view */}
            <div className="d-block d-lg-none my-3">
              <div className="seo-hero-media">
                <Image
                  src="/Assets/img/services/Cataract-Service.png"
                  alt="[Your Procedure Name] in Moradabad at Oracle Eye Hospital"
                  width={640}
                  height={360}
                  priority
                  className="img-fluid"
                  style={{ width: "100%", height: "200px", objectFit: "cover", objectPosition: "center" }}
                />
                <div className="seo-hero-media-badge">
                  <strong className="text-white">Advanced Medical Technology</strong>
                  <span className="badge bg-warning text-dark">US-FDA Approved</span>
                </div>
              </div>
            </div>

            {/* Exactly One H1 with Target Keyword */}
            <h1 className="seo-hero-h1">[Your Procedure Name] in Moradabad</h1>

            {/* Concise Clinical Intro */}
            <p className="seo-hero-intro">
              Experience world-class eye care with cutting-edge surgical precision, experienced super-specialist surgeons, and premium patient care at Oracle Eye Hospital, Moradabad.
            </p>

            {/* Primary Action Buttons */}
            <div className="seo-hero-actions">
              <a href="#sidebar-appointment" className="seo-btn-appointment">
                <Calendar size={16} />
                <span>Book Appointment</span>
              </a>

              <a href={\`tel:\${cleanPhone}\`} className="seo-btn-call">
                <Phone size={16} color="#e8a33d" />
                <span>Call Now: {helpline}</span>
              </a>
            </div>

            {/* Key Clinical Trust Badges */}
            <div className="seo-highlights-grid mb-0">
              <div className="seo-highlight-item">
                <div className="seo-highlight-icon">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="label">Procedure Duration</span>
                  <span className="val">15-Min Walk-In</span>
                </div>
              </div>

              <div className="seo-highlight-item">
                <div className="seo-highlight-icon">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <span className="label">Surgical Technique</span>
                  <span className="val">Stitchless &amp; Painless</span>
                </div>
              </div>

              <div className="seo-highlight-item">
                <div className="seo-highlight-icon">
                  <Award size={16} />
                </div>
                <div>
                  <span className="label">Payment &amp; TPA</span>
                  <span className="val">Cashless Insurance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Medical Graphic (Desktop view only) */}
          <div className="col-lg-5 d-none d-lg-block">
            <div className="seo-hero-media">
              <Image
                src="/Assets/img/services/Cataract-Service.png"
                alt="[Your Procedure Name] in Moradabad at Oracle Eye Hospital"
                width={640}
                height={360}
                priority
                className="img-fluid"
                style={{ width: "100%", height: "240px", objectFit: "cover", objectPosition: "center" }}
              />
              <div className="seo-hero-media-badge">
                <strong className="text-white">Advanced Medical Technology</strong>
                <span className="badge bg-warning text-dark">US-FDA Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`;

const contentTemplate = `"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ListOrdered,
  Award,
  Clock,
  Sparkles,
} from "lucide-react";
import AppointmentForm from "../../components/AppointmentForm";

const SECTIONS = [
  { id: "overview", heading: "1. Overview & Clinical Significance" },
  { id: "symptoms-candidacy", heading: "2. Symptoms & When to Seek Consultation" },
  { id: "procedure-technology", heading: "3. Advanced Surgical Procedure & Technology" },
  { id: "comparison-table", heading: "4. Clinical Options & Technique Comparison" },
  { id: "recovery-aftercare", heading: "5. Recovery Timeline & Post-Operative Care" },
  { id: "cost-insurance", heading: "6. Cost Transparency & Cashless Insurance (TPA)" },
  { id: "faqs", heading: "7. Frequently Asked Questions" },
];

const FAQS = [
  {
    question: "How long does the procedure take?",
    answer: "The advanced procedure typically takes only 15 to 20 minutes under topical drop anesthesia with same-day walk-in and discharge.",
  },
  {
    question: "Is the procedure painful?",
    answer: "No. Advanced numbing eye drops ensure the surgery is virtually painless without any needles or injections.",
  },
  {
    question: "Does insurance cover this treatment?",
    answer: "Yes, Oracle Eye Hospital is empanelled with major TPAs, Ayushman Bharat (PM-JAY), and government panels for seamless cashless treatment.",
  },
];

export default function Content() {
  const [activeSection, setActiveSection] = useState("overview");
  const [tocOpen, setTocOpen] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);
  const rowRef = useRef(null);

  const helpline = "+91 8006803111";
  const cleanPhone = helpline.replace(/[^0-9+]/g, "");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="seo-section py-5">
        <div className="container">
          <div className="row g-4 g-lg-5 seo-content-row" ref={rowRef}>
            {/* Left Column: Comprehensive Article */}
            <div className="col-lg-8">
              <article className="seo-article-container">
                {/* 1. Overview */}
                <div className="seo-article-block" id="overview">
                  <h2 className="seo-article-h2">1. Overview &amp; Clinical Significance</h2>
                  <p className="seo-article-p">
                    Write your clinical overview here. Introduce the condition, treatment methods, and why early diagnosis is critical for preserving vision.
                  </p>
                  <p className="seo-article-p">
                    Explain how modern micro-incision surgical techniques have made this outpatient procedure stitchless, injection-free, and pain-free.
                  </p>
                </div>

                {/* 2. Symptoms */}
                <div className="seo-article-block" id="symptoms-candidacy">
                  <h2 className="seo-article-h2">2. Symptoms &amp; When to Seek Consultation</h2>
                  <p className="seo-article-p">
                    Detail the common warning signs patients should monitor before scheduling their comprehensive eye evaluation:
                  </p>
                  <ul className="seo-checklist">
                    <li><CheckCircle2 size={18} color="#137c8b" /> <span>Progressive blurriness or cloudy vision.</span></li>
                    <li><CheckCircle2 size={18} color="#137c8b" /> <span>Difficulty driving at night due to glare and halos around headlights.</span></li>
                    <li><CheckCircle2 size={18} color="#137c8b" /> <span>Frequent changes in eyeglass or contact lens prescription.</span></li>
                    <li><CheckCircle2 size={18} color="#137c8b" /> <span>Faded or yellowed perception of bright colors.</span></li>
                  </ul>
                </div>

                {/* 3. Technology */}
                <div className="seo-article-block" id="procedure-technology">
                  <h2 className="seo-article-h2">3. Advanced Surgical Procedure &amp; Technology</h2>
                  <p className="seo-article-p">
                    Describe the cutting-edge technology platforms utilized at Oracle Eye Hospital, such as robotic precision lasers and US-FDA approved vision systems.
                  </p>
                </div>

                {/* 4. Comparison Table */}
                <div className="seo-article-block" id="comparison-table">
                  <h2 className="seo-article-h2">4. Clinical Options &amp; Technique Comparison</h2>
                  <div className="table-responsive my-3">
                    <table className="table table-bordered table-striped seo-content-table">
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Standard Technique</th>
                          <th>Advanced Robotic Precision</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Incision Size</strong></td>
                          <td>2.8 mm – 3.2 mm</td>
                          <td>1.8 mm – 2.2 mm (Micro-Incision)</td>
                        </tr>
                        <tr>
                          <td><strong>Visual Recovery</strong></td>
                          <td>3 to 7 Days</td>
                          <td>24 to 48 Hours</td>
                        </tr>
                        <tr>
                          <td><strong>Stitches Required</strong></td>
                          <td>None</td>
                          <td>None (Self-sealing)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5. Recovery */}
                <div className="seo-article-block" id="recovery-aftercare">
                  <h2 className="seo-article-h2">5. Recovery Timeline &amp; Post-Operative Care</h2>
                  <p className="seo-article-p">
                    Explain what patients can expect on the day of procedure, within the first 24 hours, and during long-term visual stabilization.
                  </p>
                </div>

                {/* 6. Cost & Insurance */}
                <div className="seo-article-block" id="cost-insurance">
                  <h2 className="seo-article-h2">6. Cost Transparency &amp; Cashless Insurance (TPA)</h2>
                  <p className="seo-article-p">
                    At Oracle Eye Hospital, we maintain 100% pricing transparency with zero hidden charges. Our cashless insurance helpdesk coordinates with all leading TPAs and PM-JAY.
                  </p>
                </div>

                {/* 7. FAQs */}
                <div className="seo-article-block" id="faqs">
                  <h2 className="seo-article-h2">7. Frequently Asked Questions</h2>
                  <div className="seo-faq-accordion">
                    {FAQS.map((faq, idx) => (
                      <div key={idx} className="seo-faq-item">
                        <button
                          type="button"
                          className="seo-faq-question"
                          onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                          aria-expanded={openFaq === idx}
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            size={18}
                            className={\`seo-faq-icon \${openFaq === idx ? "open" : ""}\`}
                          />
                        </button>
                        {openFaq === idx && (
                          <div className="seo-faq-answer">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>

            {/* Right Column: Sticky Sidebar with Appointment Form & TOC */}
            <div className="col-lg-4">
              <aside className="seo-sidebar-sticky" id="sidebar-appointment">
                {/* 1. Book an Appointment Card */}
                <div className="seo-sidebar-form-box">
                  <div className="seo-sidebar-form-header">
                    <span className="badge bg-warning text-dark mb-1">Direct OPD Booking</span>
                    <h3>Schedule Your Consultation</h3>
                    <p>Meet our senior ophthalmologists at Oracle Eye Hospital.</p>
                  </div>
                  <div className="seo-sidebar-form-body">
                    <AppointmentForm />
                  </div>
                </div>

                {/* 2. Interactive Table of Contents (Positioned below Appointment Card) */}
                <div className="seo-sidebar-card mb-4 mt-4">
                  <div className="seo-sidebar-toc-header" onClick={() => setTocOpen(!tocOpen)}>
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
                        {SECTIONS.map((sec) => (
                          <li key={sec.id}>
                            <a
                              href={\`#\${sec.id}\`}
                              className={activeSection === sec.id ? "active" : ""}
                            >
                              {sec.heading}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Quick Helpline Card */}
                <div className="seo-sidebar-card seo-sidebar-emergency mt-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="seo-emergency-icon">
                      <Phone size={24} color="#ffffff" />
                    </div>
                    <div>
                      <span className="text-white-50 small d-block">24/7 Helpline &amp; TPA Desk</span>
                      <a href={\`tel:\${cleanPhone}\`} className="fw-bold text-white text-decoration-none">
                        {helpline}
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="seo-bottom-cta-section py-5">
        <div className="container">
          <div className="seo-bottom-cta-body text-center p-5 rounded-4">
            <h2 className="text-white mb-3">Protect Your Vision With Trusted Specialists</h2>
            <p className="text-white-50 max-w-2xl mx-auto mb-4">
              Schedule your appointment at Moradabad&apos;s foremost NABH-aligned eye care hospital.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <a href="#sidebar-appointment" className="seo-btn-appointment">
                <Calendar size={18} />
                <span>Book Appointment Online</span>
              </a>
              <a href={\`tel:\${cleanPhone}\`} className="seo-btn-call">
                <Phone size={18} color="#e8a33d" />
                <span>Call Helpline: {helpline}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
`;

const pageTemplate = `import Banner from "./Banner";
import Content from "./Content";
import {
  generateHospitalSchema,
  generatePhysicianSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateProcedureSchema,
  PRIMARY_DOCTORS,
} from "../_lib/schema";

// EDIT THESE CONSTANTS FOR YOUR TARGET KEYWORD & LOCATION
const PAGE_SLUG = "your-procedure-slug-in-moradabad";
const PAGE_URL = \`https://www.oracleeyehospital.com/\${PAGE_SLUG}\`;

// 50–60 characters, keyword first, ends with "| Oracle Eye Hospital"
const PAGE_TITLE = "[Your Procedure Name] in Moradabad | Oracle Eye Hospital";

// 140–160 characters, keyword + CTA
const PAGE_DESCRIPTION =
  "Looking for [procedure name] in Moradabad? Oracle Eye Hospital offers stitchless surgical precision, experienced eye specialists & cashless insurance. Book today!";

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Oracle Eye Hospital",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.oracleeyehospital.com/Assets/img/services/Cataract-Service.png",
        width: 1200,
        height: 630,
        alt: \`\${PAGE_TITLE} - Oracle Eye Hospital\`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["https://www.oracleeyehospital.com/Assets/img/services/Cataract-Service.png"],
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

const FAQS_DATA = [
  {
    question: "How long does the procedure take?",
    answer: "The advanced procedure typically takes only 15 to 20 minutes under topical drop anesthesia with same-day walk-in and discharge.",
  },
  {
    question: "Is the procedure painful?",
    answer: "No. Advanced numbing eye drops ensure the surgery is virtually painless without any needles or injections.",
  },
  {
    question: "Does insurance cover this treatment?",
    answer: "Yes, Oracle Eye Hospital is empanelled with major TPAs, Ayushman Bharat (PM-JAY), and government panels for seamless cashless treatment.",
  },
];

export default function SeoLandingPage() {
  const hospitalSchema = generateHospitalSchema();
  const physicianSchema = generatePhysicianSchema(PRIMARY_DOCTORS[0]);
  const faqSchema = generateFAQSchema(FAQS_DATA);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.oracleeyehospital.com" },
    { name: "Services", url: "https://www.oracleeyehospital.com/services" },
    { name: "[Your Procedure Name]", url: PAGE_URL },
  ]);
  const procedureSchema = generateProcedureSchema({
    name: "[Your Procedure Name] in Moradabad",
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    bodyLocation: "Eye",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureSchema) }}
      />

      <main className="seo-landing-page">
        <Banner />
        <Content />
      </main>
    </>
  );
}
`;

const readmeTemplate = `# Oracle Eye Hospital - SEO Landing Page Templates

This bundle contains the 3 standard template files for creating high-performing SEO landing pages:

1. **Banner.jsx**:
   - Hero banner with 30% compressed height, mobile-optimized order (Image before Title on phones).
   - Side-by-side buttons on mobile (Book Appointment & Call Now in 1 row).
   - Single-row 3-column clinical badges (Procedure Duration, Surgical Technique, Payment & TPA).

2. **Content.jsx**:
   - Two-column layout with responsive article blocks.
   - Sticky sidebar with Appointment form + Table of Contents (TOC positioned below appointment form).
   - Comparison tables, FAQ accordion, Doctor profiles, and Bottom CTA.

3. **page.jsx**:
   - Next.js App Router Server Component with dynamic SEO metadata.
   - Fully automated JSON-LD Schema integration (Hospital, Physician, FAQ, Breadcrumb, MedicalProcedure).

## How to Use:
1. Create a new folder under \`src/app/(seo_pages)/[your-target-slug]/\`
   Example: \`src/app/(seo_pages)/lasik-laser-surgery-in-moradabad/\`
2. Extract or copy \`Banner.jsx\`, \`Content.jsx\`, and \`page.jsx\` into that folder.
3. Replace \`[Your Procedure Name]\` and slug in \`page.jsx\`, \`Banner.jsx\`, and \`Content.jsx\`.
4. Your new landing page is immediately live and accessible at \`http://localhost:3000/[your-target-slug]\`!
`;

async function buildZip() {
  const zip = new JSZip();
  zip.file("Banner.jsx", bannerTemplate.trim());
  zip.file("Content.jsx", contentTemplate.trim());
  zip.file("page.jsx", pageTemplate.trim());
  zip.file("README.md", readmeTemplate.trim());

  const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  const outDir = path.resolve('public/templates');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, 'seo-page-templates.zip');
  fs.writeFileSync(outPath, buffer);
  console.log('Created:', outPath, 'Size:', buffer.length, 'bytes');
}

buildZip().catch(err => {
  console.error(err);
  process.exit(1);
});
