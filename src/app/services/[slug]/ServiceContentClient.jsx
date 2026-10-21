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
  Sparkles,
  Stethoscope,
} from "lucide-react";
import AppointmentForm from "@/components/AppointmentForm";
import "../../(seo_pages)/_components/seo-landing.css";

export default function ServiceContentClient({
  page,
  sections = [],
  doctors = [],
  faqs = [],
  relatedServices = [],
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // ── Smooth Scroll & Sticky Tracking ────────────────────────────
  const articleRef = useRef(null);
  const asideRef = useRef(null);
  const [sidebarStyle, setSidebarStyle] = useState({});

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateSidebarPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    const updateSidebarPosition = () => {
      if (window.innerWidth < 992) {
        setSidebarStyle({});
        return;
      }

      const articleEl = articleRef.current;
      const asideEl = asideRef.current;
      if (!articleEl || !asideEl) return;

      const colEl = asideEl.parentElement;
      const colRect = colEl.getBoundingClientRect();
      const articleRect = articleEl.getBoundingClientRect();
      const asideHeight = asideEl.offsetHeight;

      const fixedTop = 90; // Header offset
      const stopBuffer = 40; // Space before next section
      const stopPoint = articleRect.bottom - asideHeight - stopBuffer;

      if (articleRect.top <= fixedTop && stopPoint > fixedTop) {
        // Sticky Fixed
        setSidebarStyle({
          position: "fixed",
          top: `${fixedTop}px`,
          left: `${colRect.left}px`,
          width: `${colRect.width}px`,
          zIndex: 40,
        });
      } else if (stopPoint <= fixedTop) {
        // Pinned to bottom of article
        setSidebarStyle({
          position: "absolute",
          top: "auto",
          bottom: "0px",
          left: "0px",
          width: "100%",
          zIndex: 10,
        });
      } else {
        // Normal flow
        setSidebarStyle({
          position: "relative",
          top: "auto",
          left: "auto",
          width: "100%",
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    updateSidebarPosition();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sections]);

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? -1 : idx);
  };

  const helpline = page.ctaPhone || "+919458422606";
  const cleanPhone = helpline.replace(/\s+/g, "");

  // Auto-generate TOC items from sections
  const tocItems = sections.map((sec, idx) => ({
    id: sec.id || `section-${idx}`,
    heading: sec.heading,
  }));

  return (
    <>
      {/* ============================================================ */}
      {/* 1. HERO BANNER */}
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
            {/* Left Column: Heading, Subtitle, CTAs, Highlights */}
            <div className="col-lg-7 mb-4 mb-lg-0">
              {page.heroBadge && (
                <div className="seo-trust-badge">
                  <ShieldCheck size={16} color="#e8a33d" />
                  <span>{page.heroBadge}</span>
                </div>
              )}

              <h1 className="seo-hero-h1">{page.h1Title}</h1>

              {page.heroSubtitle && (
                <p className="seo-hero-intro">{page.heroSubtitle}</p>
              )}

              {/* Primary Action Buttons */}
              <div className="seo-hero-actions">
                <a href="#sidebar-appointment" className="seo-btn-appointment">
                  <Calendar size={18} />
                  <span>{page.ctaPrimaryText || "Book Consultation"}</span>
                </a>

                <a href={`tel:${cleanPhone}`} className="seo-btn-call">
                  <Phone size={18} color="#e8a33d" />
                  <span>Call Now: {helpline}</span>
                </a>
              </div>

              {/* Stat Chips */}
              {Array.isArray(page.heroChips) && page.heroChips.length > 0 && (
                <div className="seo-highlights-grid mb-0">
                  {page.heroChips.map((chip, idx) => (
                    <div key={idx} className="seo-highlight-item">
                      <div className="seo-highlight-icon">
                        <Clock size={18} />
                      </div>
                      <div>
                        <div className="label">{chip.label}</div>
                        <div className="val">{chip.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Hero Visual Image */}
            <div className="col-lg-5 text-center">
              <div className="seo-hero-media-wrapper">
                <Image
                  src={
                    page.heroImage ||
                    "/Assets/img/services/Cataract-Service.png"
                  }
                  alt={`${page.h1Title} at Oracle Eye Hospital`}
                  width={520}
                  height={380}
                  className="seo-hero-image img-fluid"
                  priority
                  style={{
                    borderRadius: "16px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. TWO-COLUMN MAIN CONTENT WITH STICKY SIDEBAR */}
      {/* ============================================================ */}
      <section className="seo-section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <div className="row g-4 g-lg-5" style={{ position: "relative" }}>
            {/* Left Column: Dynamic Content Sections */}
            <div className="col-lg-8" ref={articleRef}>
              <article className="seo-article-body">
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
                      style={{ marginBottom: 36 }}
                    >
                      <h2 className="seo-article-h2">{sec.heading}</h2>

                      {/* Paragraph text */}
                      {paragraphs.map((pText, pIdx) => (
                        <p key={pIdx} className="seo-article-p">
                          {pText}
                        </p>
                      ))}

                      {/* Type: Checklist */}
                      {sec.type === "checklist" &&
                        Array.isArray(sec.items) &&
                        sec.items.length > 0 && (
                          <ul className="seo-article-list" style={{ listStyle: "none", paddingLeft: 0 }}>
                            {sec.items.map((item, itemIdx) => (
                              <li
                                key={itemIdx}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 10,
                                  marginBottom: 10,
                                }}
                              >
                                <CheckCircle2
                                  size={18}
                                  color="#137c8b"
                                  style={{ flexShrink: 0, marginTop: 3 }}
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                      {/* Type: Numbered Steps */}
                      {sec.type === "numbered" &&
                        Array.isArray(sec.items) &&
                        sec.items.length > 0 && (
                          <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
                            {sec.items.map((step, stepIdx) => (
                              <div
                                key={stepIdx}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 12,
                                  background: "#f8fafc",
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
                                    color: "#fff",
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
                                <div style={{ fontSize: 14, lineHeight: 1.6, color: "#334155" }}>
                                  {step}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Type: Highlight Callout Box */}
                      {sec.type === "highlight" && (
                        <div
                          className="seo-article-callout"
                          style={{
                            background: "linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)",
                            border: "1px solid #99f6e4",
                            borderRadius: 12,
                            padding: 20,
                            marginTop: 16,
                          }}
                        >
                          {Array.isArray(sec.items) && sec.items.length > 0 && (
                            <ul style={{ margin: "10px 0 0 0", paddingLeft: 20 }}>
                              {sec.items.map((hItem, hIdx) => (
                                <li key={hIdx} style={{ marginBottom: 6, color: "#0f766e", fontSize: 14 }}>
                                  {hItem}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </article>
            </div>

            {/* Right Column: Sticky Sidebar (TOC + Appointment Form) */}
            <div className="col-lg-4" style={{ position: "relative" }} id="sidebar-appointment">
              <aside
                ref={asideRef}
                style={sidebarStyle}
                className="seo-sticky-appointment-card"
              >
                {/* Auto Table of Contents */}
                {tocItems.length > 0 && (
                  <div className="seo-sidebar-box seo-sidebar-toc-box">
                    <h4>
                      <ListOrdered size={16} color="#137c8b" />
                      <span>Table of Contents</span>
                    </h4>
                    <ul className="seo-sidebar-toc-list">
                      {tocItems.map((item, idx) => (
                        <li key={idx}>
                          <a href={`#${item.id}`}>• {item.heading}</a>
                        </li>
                      ))}
                      {doctors.length > 0 && (
                        <li>
                          <a href="#expert-doctors">• Specialist Doctors</a>
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

                {/* Book an Appointment Form */}
                <div className="seo-sidebar-box seo-sidebar-form-box">
                  <h4>
                    <Calendar size={18} color="#e8a33d" />
                    <span>Book an Appointment</span>
                  </h4>
                  <AppointmentForm
                    initialService={page.h1Title}
                    initialDoctor={doctors[0]?.name || "Dr Girjesh Kain"}
                  />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SENIOR SPECIALISTS SECTION */}
      {/* ============================================================ */}
      {doctors.length > 0 && (
        <section
          className="seo-section"
          style={{ backgroundColor: "#07242c", color: "#fff" }}
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
                    display: "inline-block",
                    padding: "4px 14px",
                    borderRadius: 50,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Expert Surgical Team
                </span>
                <h2 className="seo-section-h2 text-white" style={{ marginTop: 8 }}>
                  Meet Our Senior Specialists
                </h2>
                <p className="seo-section-desc text-white-50" style={{ maxWidth: 640, margin: "0 auto" }}>
                  Entrust your eye health to dedicated ophthalmic surgeons who have restored sight to tens of thousands of patients across Western UP.
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
                          <div className="role">{doc.role || "Ophthalmologist"}</div>
                          <div className="qual">{doc.qualification || "MS, FICO"}</div>
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
      {/* 4. FAQ ACCORDION SECTION */}
      {/* ============================================================ */}
      {faqs.length > 0 && (
        <section
          className="seo-section"
          style={{ backgroundColor: "#f8fafc" }}
          id="faq-section"
        >
          <div className="container">
            <div className="seo-section-title-wrap text-center mb-5">
              <span
                style={{
                  color: "#137c8b",
                  fontWeight: 700,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Common Patient Inquiries
              </span>
              <h2
                className="seo-section-h2"
                style={{ color: "#07242c", marginTop: 8 }}
              >
                Frequently Asked Questions
              </h2>
              <p
                className="seo-section-desc"
                style={{ color: "#64748b", maxWidth: 600, margin: "0 auto" }}
              >
                Clear, honest answers to help you make informed decisions for your vision and care.
              </p>
            </div>

            <div style={{ maxWidth: 840, margin: "0 auto" }}>
              {faqs.map((faq, fIdx) => {
                const isOpen = openFaqIndex === fIdx;
                return (
                  <div
                    key={fIdx}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      marginBottom: 12,
                      overflow: "hidden",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(fIdx)}
                      style={{
                        width: "100%",
                        padding: "18px 22px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                      aria-expanded={isOpen}
                    >
                      <span style={{ paddingRight: 16 }}>{faq.question}</span>
                      <ChevronDown
                        size={18}
                        color="#137c8b"
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                          flexShrink: 0,
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div
                        style={{
                          padding: "0 22px 20px 22px",
                          color: "#475569",
                          fontSize: 14,
                          lineHeight: 1.7,
                          borderTop: "1px solid #f1f5f9",
                          paddingTop: 14,
                        }}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 5. RELATED SERVICES CARDS */}
      {/* ============================================================ */}
      {relatedServices.length > 0 && (
        <section
          className="seo-section"
          style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0" }}
        >
          <div className="container">
            <div className="text-center mb-4">
              <span
                style={{
                  color: "#137c8b",
                  fontWeight: 700,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Comprehensive Eye Care
              </span>
              <h2
                className="seo-section-h2"
                style={{ color: "#07242c", marginTop: 8 }}
              >
                Explore Related Specialities
              </h2>
            </div>

            <div className="row g-4 justify-content-center">
              {relatedServices.map((rel) => (
                <div key={rel.id} className="col-md-6 col-lg-3">
                  <Link
                    href={`/services/${rel.slug}`}
                    style={{
                      display: "block",
                      padding: 20,
                      background: "#ffffff",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "all 0.2s ease",
                      height: "100%",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "#137c8b",
                        marginBottom: 12,
                      }}
                    >
                      <Stethoscope size={22} />
                      <ArrowRight size={16} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#07242c", marginBottom: 6 }}>
                      {rel.h1Title}
                    </h3>
                    <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                      Specialized diagnosis, surgical precision and post-operative recovery at Oracle Eye Hospital.
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
