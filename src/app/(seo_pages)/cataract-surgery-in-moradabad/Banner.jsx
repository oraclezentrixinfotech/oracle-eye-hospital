"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Calendar, ShieldCheck, Award, Clock } from "lucide-react";
import { SITE } from "@/lib/content";
import "../_components/seo-landing.css";

export default function Banner() {
  const helpline = SITE.helpline || "+91 8006803111";
  const cleanPhone = helpline.replace(/\s+/g, "");

  return (
    <section className="seo-hero-section">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="seo-breadcrumb">
          <Link href="/">Home</Link>
          <span className="mx-2 text-white-50">/</span>
          <Link href="/services">Services</Link>
          <span className="mx-2 text-white-50">/</span>
          <span className="active">Cataract Surgery in Moradabad</span>
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
                  alt="Advanced Cataract Surgery in Moradabad at Oracle Eye Hospital"
                  width={640}
                  height={360}
                  priority
                  className="img-fluid"
                  style={{ width: "100%", height: "200px", objectFit: "cover", objectPosition: "center" }}
                />
                <div className="seo-hero-media-badge">
                  <strong className="text-white">Centurion&reg; Vision Phaco System</strong>
                  <span className="badge bg-warning text-dark">Alcon US-FDA Approved</span>
                </div>
              </div>
            </div>

            {/* Exactly One H1 with Target Keyword */}
            <h1 className="seo-hero-h1">Cataract Surgery in Moradabad</h1>

            {/* Concise Clinical Intro */}
            <p className="seo-hero-intro">
              Restore crystal-clear vision with micro-incision phacoemulsification, robotic precision, and premium intraocular lenses at Oracle Eye Hospital, Moradabad&apos;s trusted center for advanced ophthalmology.
            </p>

            {/* Primary Action Buttons */}
            <div className="seo-hero-actions">
              <a href="#sidebar-appointment" className="seo-btn-appointment">
                <Calendar size={16} />
                <span>Book Appointment</span>
              </a>

              <a href={`tel:${cleanPhone}`} className="seo-btn-call">
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
                alt="Advanced Cataract Surgery in Moradabad at Oracle Eye Hospital"
                width={640}
                height={360}
                priority
                className="img-fluid"
                style={{ width: "100%", height: "240px", objectFit: "cover", objectPosition: "center" }}
              />
              <div className="seo-hero-media-badge">
                <strong className="text-white">Centurion&reg; Vision Phaco System</strong>
                <span className="badge bg-warning text-dark">Alcon US-FDA Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
