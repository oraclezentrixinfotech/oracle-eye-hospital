"use client";

import { useState } from "react";
import { X, Monitor, Smartphone, Tablet, ExternalLink } from "lucide-react";
import ServiceContentClient from "@/app/services/[slug]/ServiceContentClient";

export default function SeoPagePreviewModal({
  isOpen,
  onClose,
  pageData,
  doctorsList = [],
  allPages = [],
}) {
  const [deviceMode, setDeviceMode] = useState("desktop"); // "desktop" | "tablet" | "mobile"

  if (!isOpen || !pageData) return null;

  // Resolve doctors
  const doctors = Array.isArray(pageData.doctorIds)
    ? doctorsList.filter((d) => pageData.doctorIds.includes(d.id))
    : [];

  // Fallback to first 2 if none selected
  const displayDoctors =
    doctors.length > 0 ? doctors : doctorsList.slice(0, 2);

  // Resolve related services
  const relatedServices = Array.isArray(pageData.relatedIds)
    ? allPages.filter((p) => pageData.relatedIds.includes(p.id))
    : allPages.slice(0, 4);

  const containerWidth =
    deviceMode === "mobile"
      ? "420px"
      : deviceMode === "tablet"
      ? "768px"
      : "100%";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(4px)",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Controls Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          background: "#0f172a",
          borderBottom: "1px solid #1e293b",
          color: "#ffffff",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              padding: "4px 10px",
              background: "#0d9488",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 4,
              letterSpacing: "0.5px",
            }}
          >
            LIVE REUSABLE TEMPLATE PREVIEW
          </span>
          <span style={{ fontSize: 14, color: "#94a3b8" }}>
            Target URL:{" "}
            <code style={{ color: "#38bdf8", background: "#1e293b", padding: "2px 6px", borderRadius: 4 }}>
              /services/{pageData.slug || "page-slug"}
            </code>
          </span>
        </div>

        {/* Device Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e293b", padding: 4, borderRadius: 6 }}>
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            style={{
              padding: "6px 12px",
              background: deviceMode === "desktop" ? "#0d9488" : "transparent",
              color: "#ffffff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            <Monitor size={15} />
            <span>Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode("tablet")}
            style={{
              padding: "6px 12px",
              background: deviceMode === "tablet" ? "#0d9488" : "transparent",
              color: "#ffffff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            <Tablet size={15} />
            <span>Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            style={{
              padding: "6px 12px",
              background: deviceMode === "mobile" ? "#0d9488" : "transparent",
              color: "#ffffff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            <Smartphone size={15} />
            <span>Mobile</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "#334155",
            color: "#ffffff",
            border: "none",
            borderRadius: 6,
            padding: "8px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <X size={16} />
          <span>Exit Preview</span>
        </button>
      </div>

      {/* Preview Viewport */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#090d16",
          display: "flex",
          justifyContent: "center",
          padding: deviceMode === "desktop" ? 0 : "24px 0",
        }}
      >
        <div
          style={{
            width: containerWidth,
            minHeight: "100%",
            background: "#ffffff",
            boxShadow: deviceMode === "desktop" ? "none" : "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
            borderRadius: deviceMode === "desktop" ? 0 : 12,
            overflow: "hidden",
            transition: "width 0.3s ease",
          }}
        >
          {/* Render Actual Reusable Template */}
          <ServiceContentClient
            page={{
              id: pageData.id || 0,
              slug: pageData.slug || "preview-slug",
              h1Title: pageData.h1Title || "Untitled Page",
              heroBadge: pageData.heroBadge || "NABH-Aligned Centre • 25,000+ Surgeries",
              heroSubtitle: pageData.heroSubtitle || "",
              heroImage: pageData.heroImage || "/Assets/img/services/Cataract-Service.png",
              heroChips: pageData.heroChips || [],
              ctaPrimaryText: pageData.ctaPrimaryText || "Book Appointment",
              ctaPhone: pageData.ctaPhone || "+91 8006803111",
              canonicalUrl: pageData.canonicalUrl || `https://www.oracleeyehospital.com/services/${pageData.slug}`,
            }}
            sections={pageData.sections || []}
            doctors={displayDoctors}
            faqs={pageData.faqs || []}
            relatedServices={relatedServices}
          />
        </div>
      </div>
    </div>
  );
}
