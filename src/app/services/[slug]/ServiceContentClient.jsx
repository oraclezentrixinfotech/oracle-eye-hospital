"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ListOrdered,
  ChevronDown,
  Award,
  Stethoscope,
} from "lucide-react";
import AppointmentForm from "@/components/AppointmentForm";
import "../../(seo_pages)/_components/seo-landing.css";

const CHIP_ICON_COMPONENTS = [Clock, ShieldCheck, Award];

export default function ServiceContentClient({
  page,
  sections = [],
  doctors = [],
  faqs = [],
  relatedServices = [],
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(true);

  // ── Smooth Scroll & Sticky Tracking Matching Content.jsx ──────────
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
  }, [sections]);

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? -1 : idx);
  };

  const helpline = page.ctaPhone || "+91 8006803111";
  const cleanPhone = helpline.replace(/\s+/g, "");

  // Auto-generate TOC items from sections
  const tocItems = sections.map((sec, idx) => ({
    id: sec.id || `section-${idx}`,
    heading: sec.heading,
  }));

  return (
    <div className="seo-content-wrapper" style={{ backgroundColor: "#f8fafc" }}>
      {/* ============================================================ */}
      {/* 1. HERO BANNER (Matches Banner.jsx)                         */}
      {/* ============================================================ */}
      <section className="seo-hero-section">
        <div className="container">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="seo-breadcrumb">
            <Link href="/">Home</Link>
            <span className="mx-2 text-white-50">/</span>
            <Link href="/services">Services</Link>
            <span className="mx-2 text-white-50">/</span>
            <span className="active">{page.h1Title}</span>
          </nav>

          <div className="row align-items-center">
            {/* Left Column: Keyword Heading, Clinical Value, CTAs, Highlights */}
            <div className="col-lg-7 mb-0">
              {/* Accreditation Badge */}
              <div className="seo-trust-badge">
                <ShieldCheck size={16} color="#e8a33d" />
                <span>{page.heroBadge || "NABH-Aligned Centre • 25,000+ Surgeries"}</span>
              </div>

              {/* Mobile Hero Graphic - Shown before Title on Phone view */}
              <div className="d-block d-lg-none my-3">
                <div className="seo-hero-media">
                  <Image
                    src={
                      page.heroImage ||
                      "/Assets/img/services/Cataract-Service.png"
                    }
                    alt={`${page.h1Title} at Oracle Eye Hospital`}
                    width={640}
                    height={360}
                    priority
                    className="img-fluid"
                    style={{ width: "100%", height: "200px", objectFit: "cover", objectPosition: "center" }}
                  />
                  <div className="seo-hero-media-badge">
                    <strong className="text-white">
                      {page.heroBadge ? page.heroBadge.split("•")[0].trim() : "Centurion® Vision Phaco System"}
                    </strong>
                    <span className="badge bg-warning text-dark">Alcon US-FDA Approved</span>
                  </div>
                </div>
              </div>

              {/* Exactly One H1 with Target Keyword */}
              <h1 className="seo-hero-h1">{page.h1Title}</h1>

              {/* Concise Clinical Intro */}
              {page.heroSubtitle && (
                <p className="seo-hero-intro">{page.heroSubtitle}</p>
              )}

              {/* Primary Action Buttons */}
              <div className="seo-hero-actions">
                <a href="#sidebar-appointment" className="seo-btn-appointment">
                  <Calendar size={16} />
                  <span>{page.ctaPrimaryText || "Book Appointment"}</span>
                </a>

                <a href={`tel:${cleanPhone}`} className="seo-btn-call">
                  <Phone size={16} color="#e8a33d" />
                  <span>Call Now: {helpline}</span>
                </a>
              </div>

              {/* Key Clinical Trust Badges (Stat Chips) */}
              {Array.isArray(page.heroChips) && page.heroChips.length > 0 && (
                <div className="seo-highlights-grid mb-0">
                  {page.heroChips.map((chip, idx) => {
                    const IconComponent =
                      CHIP_ICON_COMPONENTS[idx % CHIP_ICON_COMPONENTS.length];
                    return (
                      <div key={idx} className="seo-highlight-item">
                        <div className="seo-highlight-icon">
                          <IconComponent size={16} />
                        </div>
                        <div>
                          <span className="label">{chip.label}</span>
                          <span className="val">{chip.value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Hero Medical Graphic (Desktop view only) */}
            <div className="col-lg-5 d-none d-lg-block">
              <div className="seo-hero-media">
                <Image
                  src={
                    page.heroImage ||
                    "/Assets/img/services/Cataract-Service.png"
                  }
                  alt={`${page.h1Title} at Oracle Eye Hospital`}
                  width={640}
                  height={360}
                  priority
                  className="img-fluid"
                  style={{ width: "100%", height: "240px", objectFit: "cover", objectPosition: "center" }}
                />
                <div className="seo-hero-media-badge">
                  <strong className="text-white">
                    {page.heroBadge ? page.heroBadge.split("•")[0].trim() : "Centurion® Vision Phaco System"}
                  </strong>
                  <span className="badge bg-warning text-dark">Alcon US-FDA Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. TWO-COLUMN MAIN CONTENT WITH STICKY SIDEBAR (Content.jsx) */}
      {/* ============================================================ */}
      <section className="seo-section py-5">
        <div className="container">
          <div className="row g-4 g-lg-5 seo-content-row" ref={rowRef}>
            {/* Left Column: Comprehensive Article in Paragraph & Heading Form */}
            <div className="col-lg-8">
              <article className="seo-article-container">
                {sections.map((sec, idx) => {
                  const sectionId = sec.id || `section-${idx}`;
                  const paragraphs = (sec.content || "")
                    .split(/\n\s*\n/)
                    .filter((p) => p.trim());

                  return (
                    <div
                      key={sectionId}
                      className="seo-article-block"
                      id={sectionId}
                    >
                      <h2 className="seo-article-h2">{sec.heading}</h2>

                      {/* Paragraph text / Rich HTML */}
                      {paragraphs.map((pText, pIdx) => (
                        <div
                          key={pIdx}
                          className="seo-article-p"
                          dangerouslySetInnerHTML={{ __html: pText }}
                        />
                      ))}

                      {/* Structured Table (if present) */}
                      {sec.table && Array.isArray(sec.table.headers) && sec.table.headers.length > 0 && (
                        <div className="table-responsive my-4" style={{ overflowX: "auto" }}>
                          <table className="table table-bordered table-hover" style={{ width: "100%", background: "#fff", borderCollapse: "collapse", borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                            <thead style={{ background: "#0d9488", color: "#ffffff" }}>
                              <tr>
                                {sec.table.headers.map((th, thIdx) => (
                                  <th key={thIdx} style={{ padding: "12px 16px", fontWeight: 600, fontSize: 14 }}>
                                    {th}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(sec.table.rows) &&
                                sec.table.rows.map((row, rIdx) => (
                                  <tr key={rIdx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} style={{ padding: "10px 16px", fontSize: 14, color: "#334155" }}>
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Layout Type: Highlight Callout Box */}
                      {sec.type === "highlight" &&
                        Array.isArray(sec.items) &&
                        sec.items.length > 0 && (
                          <div className="seo-article-callout">
                            <h4>Why Choose Oracle Eye Hospital?</h4>
                            <ul style={{ margin: "10px 0 0 0", paddingLeft: 20 }}>
                              {sec.items.map((hItem, hIdx) => (
                                <li
                                  key={hIdx}
                                  style={{ marginBottom: 6 }}
                                  dangerouslySetInnerHTML={{ __html: hItem }}
                                />
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Layout Type: Checklist */}
                      {sec.type === "checklist" &&
                        Array.isArray(sec.items) &&
                        sec.items.length > 0 && (
                          <ul className="seo-article-list">
                            {sec.items.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                <span dangerouslySetInnerHTML={{ __html: item }} />
                              </li>
                            ))}
                          </ul>
                        )}

                      {/* Layout Type: Numbered Steps */}
                      {sec.type === "numbered" &&
                        Array.isArray(sec.items) &&
                        sec.items.length > 0 && (
                          <div style={{ display: "grid", gap: 12, marginTop: 16, marginBottom: 20 }}>
                            {sec.items.map((step, stepIdx) => (
                              <div
                                key={stepIdx}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 12,
                                  background: "#ffffff",
                                  padding: 14,
                                  borderRadius: 8,
                                  border: "1px solid #e2e8f0",
                                }}
                              >
                                <div
                                  style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    background: "#e8a33d",
                                    color: "#ffffff",
                                    fontWeight: 700,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 13,
                                    flexShrink: 0,
                                  }}
                                >
                                  {stepIdx + 1}
                                </div>
                                <div
                                  style={{ fontSize: 14, lineHeight: 1.6, color: "#334155" }}
                                  dangerouslySetInnerHTML={{ __html: step }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  );
                })}
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
                  <AppointmentForm
                    initialService={page.h1Title}
                    initialDoctor={doctors[0]?.name || "Dr Girjesh Kain"}
                  />
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
                        {tocItems.map((item, idx) => (
                          <li key={idx}>
                            <a href={`#${item.id}`}>• {item.heading}</a>
                          </li>
                        ))}
                        {doctors.length > 0 && (
                          <li>
                            <a href="#expert-doctors">• Meet Specialists</a>
                          </li>
                        )}
                        {faqs.length > 0 && (
                          <li>
                            <a href="#faq-section">• FAQs</a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SENIOR SPECIALISTS SECTION (Matches Content.jsx)           */}
      {/* ============================================================ */}
      {doctors.length > 0 && (
        <section
          className="seo-section"
          style={{ backgroundColor: "#ffffff" }}
          id="expert-doctors"
        >
          <div className="container">
            <div className="seo-doctors-section">
              <div className="seo-section-title-wrap mb-4 text-center">
                <span
                  className="seo-badge-pill"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    color: "#cfe7ea",
                  }}
                >
                  Expert Surgical Team
                </span>
                <h2 className="seo-section-h2 text-white">
                  Meet Our Senior Specialists
                </h2>
                <p className="seo-section-desc text-white-50">
                  Entrust your vision to dedicated ophthalmic surgeons who have restored sight to tens of thousands of patients across Western UP.
                </p>
              </div>

              <div className="row g-4 justify-content-center">
                {doctors.map((doc) => (
                  <div key={doc.id} className="col-md-6 col-lg-5">
                    <div className="seo-doctor-card">
                      <div className="seo-doctor-header">
                        <div className="seo-doctor-avatar">
                          <Image
                            src={doc.image || "/Assets/img/team/3.png"}
                            alt={doc.name}
                            width={76}
                            height={76}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="seo-doctor-info">
                          <h4>{doc.name}</h4>
                          <div className="role">{doc.role || "Senior Specialist"}</div>
                          <div className="qual">{doc.qualification || "MS (Ophthalmology), FICO"}</div>
                        </div>
                      </div>
                      <p className="seo-doctor-bio">{doc.bio}</p>
                      <div className="seo-doctor-footer">
                        <span className="text-white-50">
                          {doc.badgeText || "25,000+ Surgeries Done"}
                        </span>
                        {doc.profileHref && (
                          <Link href={doc.profileHref}>
                            <span>View Profile</span>
                            <ArrowRight size={14} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 4. INTERACTIVE FAQ ACCORDION (Matches Content.jsx)            */}
      {/* ============================================================ */}
      {faqs.length > 0 && (
        <section
          className="seo-section"
          style={{ backgroundColor: "#f8fafc" }}
          id="faq-section"
        >
          <div className="container">
            <div className="seo-section-title-wrap text-center">
              <span className="seo-badge-pill">Patient Questions</span>
              <h2 className="seo-section-h2">
                Frequently Asked Questions About {page.h1Title}
              </h2>
              <p className="seo-section-desc">
                Clear answers to help you make an informed decision for yourself and your family.
              </p>
            </div>

            <div className="row justify-content-center">
              <div className="col-lg-9">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
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
                        <div className="seo-faq-body">
                          {faq.answer || faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 5. RELATED INTERNAL LINKS (Matches Content.jsx)              */}
      {/* ============================================================ */}
      {relatedServices.length > 0 && (
        <section
          className="seo-section"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="container">
            <div className="seo-section-title-wrap text-center">
              <span className="seo-badge-pill">Super-Specialty Care</span>
              <h2 className="seo-section-h2">
                Explore Related Eye Care Services in Moradabad
              </h2>
              <p className="seo-section-desc">
                Discover advanced super-specialty eye treatments available at Oracle Eye Hospital:
              </p>
            </div>

            <div className="row g-4">
              {relatedServices.map((item, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <Link
                    href={`/services/${item.slug}`}
                    className="seo-related-card"
                  >
                    <div className="d-flex justify-content-between align-items-center text-primary">
                      <Stethoscope size={22} color="#137c8b" />
                      <ArrowRight size={16} color="#137c8b" />
                    </div>
                    <h4>{item.h1Title || item.name}</h4>
                    <p>
                      {item.heroBadge || "Specialized clinical diagnosis and advanced surgical care."}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
