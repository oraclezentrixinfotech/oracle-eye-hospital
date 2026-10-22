"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  RefreshCw,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  FileText,
  UserCheck,
  HelpCircle,
  Link2,
  CheckCircle2,
  ListOrdered,
  CheckSquare,
  AlertCircle,
  Eye,
  UploadCloud,
} from "lucide-react";
import ImageUpload from "../../components/ImageUpload";
import { toast } from "../../components/Toast";
import DocumentImportModal from "./DocumentImportModal";
import SeoPagePreviewModal from "./SeoPagePreviewModal";
import "../../admin.css";
import "../../components/datatable.css";

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export default function SeoPageForm({ initialData = null, doctorsList = [], allPages = [] }) {
  const router = useRouter();
  const isEditing = Boolean(initialData && initialData.id);

  // Active Tab: "seo" | "hero" | "sections" | "doctors" | "faqs" | "related"
  const [activeTab, setActiveTab] = useState("seo");

  // Form State
  const [form, setForm] = useState({
    slug: initialData?.slug || "",
    status: initialData?.status || "published",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    keywords: initialData?.keywords || "",
    canonicalUrl: initialData?.canonicalUrl || "",
    ogImage: initialData?.ogImage || "",
    heroBadge: initialData?.heroBadge || "",
    h1Title: initialData?.h1Title || "",
    heroSubtitle: initialData?.heroSubtitle || "",
    heroImage: initialData?.heroImage || "",
    heroChips: Array.isArray(initialData?.heroChips) && initialData.heroChips.length > 0
      ? initialData.heroChips
      : [
          { label: "Recovery Time", value: "24–48 Hours" },
          { label: "Procedure Time", value: "10–15 Minutes" },
          { label: "Success Rate", value: "99.8% Safety" },
        ],
    ctaPrimaryText: initialData?.ctaPrimaryText || "Book Consultation",
    ctaPhone: initialData?.ctaPhone || "+919458422606",
    sections: Array.isArray(initialData?.sections) && initialData.sections.length > 0
      ? initialData.sections
      : [
          {
            id: "overview",
            heading: "Overview of Treatment",
            type: "highlight",
            content: "Describe the clinical advantages and hygiene standards at Oracle Eye Hospital.",
            items: [
              "NABH-Accredited modern super-specialty eye center",
              "25,000+ surgeries successfully performed",
              "Cashless insurance and TPA facility available",
            ],
          },
        ],
    doctorIds: Array.isArray(initialData?.doctorIds) ? initialData.doctorIds : [],
    faqs: Array.isArray(initialData?.faqs) && initialData.faqs.length > 0
      ? initialData.faqs
      : [
          {
            question: "How long does the recovery take?",
            answer: "Most patients can resume light routine activities within 24 to 48 hours.",
          },
        ],
    relatedIds: Array.isArray(initialData?.relatedIds) ? initialData.relatedIds : [],
  });

  const [slugLocked, setSlugLocked] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showImporter, setShowImporter] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  function handleApplyImported(data, mode = "merge") {
    if (!data) return;

    function isDefaultSection(secs) {
      if (!secs || secs.length === 0) return true;
      if (
        secs.length === 1 &&
        secs[0]?.id === "overview" &&
        secs[0]?.heading === "Overview of Treatment"
      ) {
        return true;
      }
      return false;
    }

    function isDefaultFaq(f) {
      if (!f || f.length === 0) return true;
      if (
        f.length === 1 &&
        f[0]?.question === "How long does the recovery take?"
      ) {
        return true;
      }
      return false;
    }

    function isDefaultChips(c) {
      if (!c || c.length === 0) return true;
      if (c.length === 3 && c[0]?.label === "Recovery Time") return true;
      return false;
    }

    if (mode === "replace") {
      setForm((prev) => ({
        ...prev,
        slug: data.slug || prev.slug,
        status: data.status || prev.status,
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        keywords: data.keywords || "",
        canonicalUrl:
          data.canonicalUrl ||
          (data.slug ? `https://www.oracleeyehospital.com/services/${data.slug}` : ""),
        ogImage: data.ogImage || prev.ogImage,
        heroBadge: data.heroBadge || "",
        h1Title: data.h1Title || "",
        heroSubtitle: data.heroSubtitle || "",
        heroImage: data.heroImage || prev.heroImage,
        heroChips:
          Array.isArray(data.heroChips) && data.heroChips.length > 0
            ? data.heroChips
            : [],
        ctaPrimaryText: data.ctaPrimaryText || "Book Consultation",
        ctaPhone: data.ctaPhone || "+919458422606",
        sections:
          Array.isArray(data.sections) && data.sections.length > 0
            ? data.sections
            : [],
        doctorIds: Array.isArray(data.doctorIds) ? data.doctorIds : [],
        faqs: Array.isArray(data.faqs) && data.faqs.length > 0 ? data.faqs : [],
        relatedIds: Array.isArray(data.relatedIds) ? data.relatedIds : [],
      }));
      toast("Replaced form content with imported data!", "success");
    } else {
      // Merge mode: fill empty fields, merge arrays without overwriting existing entries
      setForm((prev) => {
        const nextSlug = prev.slug.trim() ? prev.slug : (data.slug || "");
        const nextMetaTitle = prev.metaTitle.trim() ? prev.metaTitle : (data.metaTitle || "");
        const nextMetaDesc = prev.metaDescription.trim() ? prev.metaDescription : (data.metaDescription || "");
        const nextKeywords = prev.keywords.trim() ? prev.keywords : (data.keywords || "");
        const nextHeroBadge = prev.heroBadge.trim() ? prev.heroBadge : (data.heroBadge || "");
        const nextH1 = prev.h1Title.trim() ? prev.h1Title : (data.h1Title || "");
        const nextSubtitle = prev.heroSubtitle.trim() ? prev.heroSubtitle : (data.heroSubtitle || "");

        let nextSections = prev.sections;
        if (isDefaultSection(prev.sections)) {
          nextSections =
            Array.isArray(data.sections) && data.sections.length > 0
              ? data.sections
              : prev.sections;
        } else if (Array.isArray(data.sections) && data.sections.length > 0) {
          nextSections = [...prev.sections, ...data.sections];
        }

        let nextFaqs = prev.faqs;
        if (isDefaultFaq(prev.faqs)) {
          nextFaqs =
            Array.isArray(data.faqs) && data.faqs.length > 0 ? data.faqs : prev.faqs;
        } else if (Array.isArray(data.faqs) && data.faqs.length > 0) {
          nextFaqs = [...prev.faqs, ...data.faqs];
        }

        let nextChips = prev.heroChips;
        if (isDefaultChips(prev.heroChips)) {
          nextChips =
            Array.isArray(data.heroChips) && data.heroChips.length > 0
              ? data.heroChips
              : prev.heroChips;
        } else if (Array.isArray(data.heroChips) && data.heroChips.length > 0) {
          nextChips = [...prev.heroChips, ...data.heroChips];
        }

        const mergedDoctorIds = Array.from(
          new Set([...(prev.doctorIds || []), ...(data.doctorIds || [])])
        );
        const mergedRelatedIds = Array.from(
          new Set([...(prev.relatedIds || []), ...(data.relatedIds || [])])
        );

        return {
          ...prev,
          slug: nextSlug,
          metaTitle: nextMetaTitle,
          metaDescription: nextMetaDesc,
          keywords: nextKeywords,
          heroBadge: nextHeroBadge,
          h1Title: nextH1,
          heroSubtitle: nextSubtitle,
          heroChips: nextChips,
          sections: nextSections,
          doctorIds: mergedDoctorIds,
          faqs: nextFaqs,
          relatedIds: mergedRelatedIds,
          canonicalUrl:
            prev.canonicalUrl ||
            data.canonicalUrl ||
            (nextSlug ? `https://www.oracleeyehospital.com/services/${nextSlug}` : ""),
        };
      });
      toast("Imported content merged into form!", "success");
    }

    setSlugLocked(true);
    setActiveTab("sections");
  }

  // Handle H1 title change (auto-update slug if not locked)
  function handleH1Change(e) {
    const title = e.target.value;
    const generatedSlug = slugify(title);
    setForm((prev) => {
      const nextSlug = !slugLocked ? generatedSlug : prev.slug;
      return {
        ...prev,
        h1Title: title,
        slug: nextSlug,
        metaTitle: !prev.metaTitle ? `${title} | Oracle Eye Hospital` : prev.metaTitle,
        canonicalUrl:
          !prev.canonicalUrl ||
          prev.canonicalUrl.startsWith("https://www.oracleeyehospital.com/services/")
            ? `https://www.oracleeyehospital.com/services/${nextSlug}`
            : prev.canonicalUrl,
      };
    });
  }

  // Handle manual slug input
  function handleSlugChange(e) {
    const clean = slugify(e.target.value);
    setSlugLocked(true);
    setForm((prev) => ({
      ...prev,
      slug: clean,
      canonicalUrl:
        !prev.canonicalUrl ||
        prev.canonicalUrl.startsWith("https://www.oracleeyehospital.com/services/")
          ? `https://www.oracleeyehospital.com/services/${clean}`
          : prev.canonicalUrl,
    }));
  }

  // Sync slug with current H1
  function syncSlugWithH1() {
    const generated = slugify(form.h1Title);
    setForm((prev) => ({
      ...prev,
      slug: generated,
      canonicalUrl: `https://www.oracleeyehospital.com/services/${generated}`,
    }));
    setSlugLocked(false);
  }

  // ── Stat Chips Helpers ─────────────────────────────────────────
  function addChip() {
    setForm((prev) => ({
      ...prev,
      heroChips: [...prev.heroChips, { label: "", value: "" }],
    }));
  }

  function updateChip(index, field, val) {
    setForm((prev) => {
      const next = [...prev.heroChips];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, heroChips: next };
    });
  }

  function removeChip(index) {
    setForm((prev) => ({
      ...prev,
      heroChips: prev.heroChips.filter((_, i) => i !== index),
    }));
  }

  // ── Content Sections Helpers ────────────────────────────────────
  function addSection() {
    const newId = `section-${Date.now()}`;
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: newId,
          heading: "New Section Heading",
          type: "text",
          content: "",
          items: [],
        },
      ],
    }));
  }

  function updateSection(index, field, val) {
    setForm((prev) => {
      const next = [...prev.sections];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, sections: next };
    });
  }

  function moveSection(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= form.sections.length) return;
    setForm((prev) => {
      const next = [...prev.sections];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return { ...prev, sections: next };
    });
  }

  function removeSection(index) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  }

  // Section Items (checklist / numbered steps / highlight bullets)
  function addSectionItem(sectionIndex) {
    setForm((prev) => {
      const next = [...prev.sections];
      const curItems = Array.isArray(next[sectionIndex].items) ? next[sectionIndex].items : [];
      next[sectionIndex] = {
        ...next[sectionIndex],
        items: [...curItems, ""],
      };
      return { ...prev, sections: next };
    });
  }

  function updateSectionItem(sectionIndex, itemIndex, text) {
    setForm((prev) => {
      const next = [...prev.sections];
      const nextItems = [...(next[sectionIndex].items || [])];
      nextItems[itemIndex] = text;
      next[sectionIndex] = { ...next[sectionIndex], items: nextItems };
      return { ...prev, sections: next };
    });
  }

  function removeSectionItem(sectionIndex, itemIndex) {
    setForm((prev) => {
      const next = [...prev.sections];
      next[sectionIndex] = {
        ...next[sectionIndex],
        items: next[sectionIndex].items.filter((_, i) => i !== itemIndex),
      };
      return { ...prev, sections: next };
    });
  }

  // ── Doctors Multi-select ────────────────────────────────────────
  function toggleDoctor(docId) {
    setForm((prev) => {
      const has = prev.doctorIds.includes(docId);
      const next = has
        ? prev.doctorIds.filter((id) => id !== docId)
        : [...prev.doctorIds, docId];
      return { ...prev, doctorIds: next };
    });
  }

  // ── FAQs Helpers ────────────────────────────────────────────────
  function addFaq() {
    setForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  }

  function updateFaq(index, field, val) {
    setForm((prev) => {
      const next = [...prev.faqs];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, faqs: next };
    });
  }

  function moveFaq(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= form.faqs.length) return;
    setForm((prev) => {
      const next = [...prev.faqs];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return { ...prev, faqs: next };
    });
  }

  function removeFaq(index) {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  }

  // ── Related Services Multi-select ───────────────────────────────
  function toggleRelated(pageId) {
    setForm((prev) => {
      const has = prev.relatedIds.includes(pageId);
      const next = has
        ? prev.relatedIds.filter((id) => id !== pageId)
        : [...prev.relatedIds, pageId];
      return { ...prev, relatedIds: next };
    });
  }

  // ── Form Submit ─────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!form.h1Title.trim()) {
      setErrorMsg("H1 Title is required.");
      setActiveTab("hero");
      return;
    }

    if (!form.slug.trim()) {
      setErrorMsg("URL slug is required.");
      setActiveTab("seo");
      return;
    }

    if (isSlugDuplicate) {
      setErrorMsg(`The URL slug "${form.slug}" is already in use by another page. Please choose a unique slug.`);
      setActiveTab("seo");
      toast(`Duplicate slug: "/services/${form.slug}" is already taken.`, "error");
      return;
    }

    setSaving(true);
    const endpoint = isEditing ? `/api/admin/seo-pages/${initialData.id}` : "/api/admin/seo-pages";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to save SEO page.");
        toast(data.error || "Failed to save SEO page.", "error");
      } else {
        toast(isEditing ? "SEO page updated!" : "SEO page created successfully!", "success");
        router.push("/admin/seo-pages");
        router.refresh();
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      toast("Network error. Could not connect to server.", "error");
    } finally {
      setSaving(false);
    }
  }

  // Filter other pages for related selection (exclude self)
  const availableRelatedPages = allPages.filter((p) => p.id !== initialData?.id);

  // Check if current slug is already taken by another page
  const isSlugDuplicate = Boolean(
    form.slug.trim() &&
    allPages.some(
      (p) =>
        p.slug?.toLowerCase().trim() === form.slug.toLowerCase().trim() &&
        p.id !== initialData?.id
    )
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", paddingBottom: 60 }}>
      {/* Top Header Card */}
      <div className="adt-header-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/admin/seo-pages"
            className="adt-btn-action"
            style={{
              padding: "6px 12px",
              background: "#f3f4f6",
              color: "#374151",
              textDecoration: "none",
              borderRadius: 6,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            <ArrowLeft size={16} /> Back to List
          </Link>
          <div>
            <h2 className="adt-header-title">
              {isEditing ? `Edit: ${form.h1Title || "SEO Page"}` : "Add New SEO Page"}
            </h2>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
              Path: <code>/services/{form.slug || "[slug]"}</code>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={() => setShowImporter(true)}
            style={{
              background: "linear-gradient(135deg, #137c8b 0%, #0d9488 100%)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 13,
              padding: "9px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 2px 8px rgba(19, 124, 139, 0.25)",
            }}
          >
            <UploadCloud size={16} />
            <span>⚡ Import Word / TXT File</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPreview(true)}
            style={{
              background: "#0284c7",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: 13,
              padding: "9px 14px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Eye size={16} />
            <span>Preview Page</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="adt-btn-save"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="adt-spin" /> Saving…
              </>
            ) : (
              <>
                <Save size={16} /> Save Page
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            padding: "12px 16px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            borderRadius: 8,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div
        style={{
          display: "flex",
          gap: 6,
          background: "#ffffff",
          padding: "8px 12px",
          borderRadius: "8px 8px 0 0",
          border: "1px solid #e5e7eb",
          borderBottom: "none",
          overflowX: "auto",
        }}
      >
        {[
          { id: "seo", label: "1. SEO & Metadata", icon: Sparkles },
          { id: "hero", label: "2. Hero Banner", icon: Layers },
          { id: "sections", label: `3. Content Sections (${form.sections.length})`, icon: FileText },
          { id: "doctors", label: `4. Specialists (${form.doctorIds.length})`, icon: UserCheck },
          { id: "faqs", label: `5. FAQs (${form.faqs.length})`, icon: HelpCircle },
          { id: "related", label: `6. Related Services (${form.relatedIds.length})`, icon: Link2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: isActive ? "#0d9488" : "transparent",
                color: isActive ? "#ffffff" : "#4b5563",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Area */}
      <div
        className="adt-content-card"
        style={{
          borderRadius: "0 0 8px 8px",
          borderTop: "1px solid #e5e7eb",
          padding: 24,
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* ======================================================== */}
          {/* TAB 1: SEO & METADATA */}
          {/* ======================================================== */}
          {activeTab === "seo" && (
            <div style={{ display: "grid", gap: 20 }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: 16, color: "#111827", fontWeight: 700 }}>
                Search Engine Optimization &amp; Indexing
              </h3>

              {/* Status Toggle */}
              <div
                style={{
                  padding: 16,
                  background: "#f9fafb",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
                    Publication Status
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    Draft pages return 404 to public visitors; published pages are live and indexed.
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        status: prev.status === "published" ? "draft" : "published",
                      }))
                    }
                    className={`adt-badge ${
                      form.status === "published" ? "adt-badge-active" : "adt-badge-inactive"
                    }`}
                    style={{ fontSize: 13, padding: "6px 14px", cursor: "pointer", border: "none" }}
                  >
                    {form.status === "published" ? "✓ Published" : "✕ Draft"}
                  </button>
                </div>
              </div>

              {/* URL Slug */}
              <div className="adt-field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label>
                    URL Slug * <span style={{ color: "#6b7280", fontWeight: 400 }}>(e.g. cataract-surgery-in-moradabad)</span>
                  </label>
                  {slugLocked && (
                    <button
                      type="button"
                      onClick={syncSlugWithH1}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#0d9488",
                        cursor: "pointer",
                        fontSize: 12,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <RefreshCw size={12} /> Auto-generate from H1
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>/services/</span>
                  <input
                    type="text"
                    required
                    placeholder="cataract-surgery-in-moradabad"
                    value={form.slug}
                    onChange={handleSlugChange}
                    style={{
                      flex: 1,
                      borderColor: isSlugDuplicate ? "#dc2626" : undefined,
                    }}
                  />
                </div>
                {isSlugDuplicate && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#dc2626",
                      marginTop: 5,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontWeight: 600,
                    }}
                  >
                    <AlertCircle size={14} />
                    <span>The slug &quot;{form.slug}&quot; is already in use by another page. Please choose a unique slug.</span>
                  </div>
                )}
              </div>

              {/* Meta Title */}
              <div className="adt-field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label>Meta Title</label>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color:
                        (form.metaTitle || "").length > 60
                          ? "#d97706"
                          : (form.metaTitle || "").length >= 50
                          ? "#0d9488"
                          : "#6b7280",
                    }}
                  >
                    {(form.metaTitle || "").length}/60 characters
                    {(form.metaTitle || "").length === 0
                      ? " (empty)"
                      : (form.metaTitle || "").length > 60
                      ? " (too long)"
                      : " (50–60 recommended)"}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Cataract Surgery in Moradabad | Oracle Eye Hospital"
                  value={form.metaTitle || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
                />
              </div>

              {/* Meta Description */}
              <div className="adt-field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label>Meta Description</label>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color:
                        (form.metaDescription || "").length > 160
                          ? "#d97706"
                          : (form.metaDescription || "").length >= 140
                          ? "#0d9488"
                          : "#6b7280",
                    }}
                  >
                    {(form.metaDescription || "").length}/160 characters
                    {(form.metaDescription || "").length === 0
                      ? " (empty)"
                      : (form.metaDescription || "").length > 160
                      ? " (too long)"
                      : " (140–160 recommended)"}
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="e.g. Looking for advanced cataract surgery in Moradabad? Oracle Eye Hospital offers stitchless phacoemulsification, robotic precision & premium IOLs. Book today!"
                  value={form.metaDescription || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, metaDescription: e.target.value }))
                  }
                />
              </div>

              {/* Keywords */}
              <div className="adt-field">
                <label>Keywords (comma-separated)</label>
                <input
                  type="text"
                  placeholder="cataract surgery in moradabad, best eye doctor moradabad, phaco surgery"
                  value={form.keywords}
                  onChange={(e) => setForm((prev) => ({ ...prev, keywords: e.target.value }))}
                />
              </div>

              {/* Canonical URL */}
              <div className="adt-field">
                <label>Canonical URL</label>
                <input
                  type="url"
                  placeholder={`https://www.oracleeyehospital.com/services/${form.slug || ""}`}
                  value={form.canonicalUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
                />
              </div>

              {/* Open Graph Image */}
              <div className="adt-field">
                <label>Open Graph Share Image</label>
                <ImageUpload
                  currentUrl={form.ogImage}
                  onUpload={(url) => setForm((prev) => ({ ...prev, ogImage: url }))}
                  label="OG Image"
                />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: HERO BANNER */}
          {/* ======================================================== */}
          {activeTab === "hero" && (
            <div style={{ display: "grid", gap: 20 }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: 16, color: "#111827", fontWeight: 700 }}>
                Hero Banner &amp; Primary Call to Action
              </h3>

              {/* Hero Badge */}
              <div className="adt-field">
                <label>Hero Badge Pill Text</label>
                <input
                  type="text"
                  placeholder="e.g. NABH-Accredited Eye Hospital in Moradabad"
                  value={form.heroBadge}
                  onChange={(e) => setForm((prev) => ({ ...prev, heroBadge: e.target.value }))}
                />
              </div>

              {/* H1 Title */}
              <div className="adt-field">
                <label>H1 Page Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Cataract Surgery in Moradabad"
                  value={form.h1Title}
                  onChange={handleH1Change}
                  style={{ fontSize: 16, fontWeight: 600 }}
                />
              </div>

              {/* Hero Subtitle */}
              <div className="adt-field">
                <label>Hero Subtitle / Clinical Synopsis</label>
                <textarea
                  rows={3}
                  placeholder="Restore crystal-clear vision with 10-minute micro-incision phacoemulsification surgery. 100% stitchless, painless, injection-free with premium foldable IOLs."
                  value={form.heroSubtitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                />
              </div>

              {/* Hero Image */}
              <div className="adt-field">
                <label>Hero Image</label>
                <ImageUpload
                  currentUrl={form.heroImage}
                  onUpload={(url) => setForm((prev) => ({ ...prev, heroImage: url }))}
                  label="Hero Image"
                />
              </div>

              {/* CTAs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="adt-field">
                  <label>Primary Button Text</label>
                  <input
                    type="text"
                    value={form.ctaPrimaryText}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, ctaPrimaryText: e.target.value }))
                    }
                  />
                </div>
                <div className="adt-field">
                  <label>Helpline / WhatsApp Phone</label>
                  <input
                    type="text"
                    value={form.ctaPhone}
                    onChange={(e) => setForm((prev) => ({ ...prev, ctaPhone: e.target.value }))}
                  />
                </div>
              </div>

              {/* Stat Chips */}
              <div style={{ marginTop: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <label style={{ fontWeight: 600, fontSize: 14 }}>
                    Hero Stat Chips (Badge Highlights)
                  </label>
                  <button
                    type="button"
                    onClick={addChip}
                    className="adt-btn-save"
                    style={{ fontSize: 12, padding: "4px 10px" }}
                  >
                    <Plus size={13} /> Add Stat Chip
                  </button>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  {form.heroChips.map((chip, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "#f9fafb",
                        padding: 10,
                        borderRadius: 6,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Label (e.g. Recovery Time)"
                        value={chip.label}
                        onChange={(e) => updateChip(idx, "label", e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 24–48 Hours)"
                        value={chip.value}
                        onChange={(e) => updateChip(idx, "value", e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => removeChip(idx)}
                        style={{
                          background: "#fee2e2",
                          border: "none",
                          color: "#dc2626",
                          padding: 6,
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: CONTENT SECTIONS */}
          {/* ======================================================== */}
          {activeTab === "sections" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, color: "#111827", fontWeight: 700 }}>
                    Content Sections
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#6b7280" }}>
                    Each section automatically creates an anchor item in the Table of Contents.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addSection}
                  className="adt-btn-save"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <Plus size={15} /> Add Content Section
                </button>
              </div>

              <div style={{ display: "grid", gap: 20 }}>
                {form.sections.map((sec, idx) => (
                  <div
                    key={sec.id || idx}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      background: "#ffffff",
                      overflow: "hidden",
                    }}
                  >
                    {/* Section Header Toolbar */}
                    <div
                      style={{
                        padding: "10px 16px",
                        background: "#f8fafc",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          style={{
                            background: "#0d9488",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 12,
                          }}
                        >
                          #{idx + 1}
                        </span>
                        <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>
                          {sec.heading || "Untitled Section"}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            background: "#e2e8f0",
                            color: "#475569",
                            padding: "2px 6px",
                            borderRadius: 4,
                            textTransform: "uppercase",
                          }}
                        >
                          {sec.type}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => moveSection(idx, -1)}
                          disabled={idx === 0}
                          title="Move section up"
                          style={{
                            background: "none",
                            border: "1px solid #cbd5e1",
                            borderRadius: 4,
                            padding: 4,
                            cursor: idx === 0 ? "not-allowed" : "pointer",
                            opacity: idx === 0 ? 0.4 : 1,
                          }}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(idx, 1)}
                          disabled={idx === form.sections.length - 1}
                          title="Move section down"
                          style={{
                            background: "none",
                            border: "1px solid #cbd5e1",
                            borderRadius: 4,
                            padding: 4,
                            cursor: idx === form.sections.length - 1 ? "not-allowed" : "pointer",
                            opacity: idx === form.sections.length - 1 ? 0.4 : 1,
                          }}
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSection(idx)}
                          title="Remove section"
                          style={{
                            background: "#fee2e2",
                            border: "none",
                            color: "#dc2626",
                            borderRadius: 4,
                            padding: 4,
                            cursor: "pointer",
                            marginLeft: 6,
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Section Body */}
                    <div style={{ padding: 16, display: "grid", gap: 14 }}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2fr 1fr",
                          gap: 12,
                        }}
                      >
                        <div className="adt-field">
                          <label>Section Heading (H2) *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Modern Treatment Options"
                            value={sec.heading}
                            onChange={(e) => updateSection(idx, "heading", e.target.value)}
                          />
                        </div>

                        <div className="adt-field">
                          <label>Section Display Layout Type</label>
                          <select
                            value={sec.type}
                            onChange={(e) => updateSection(idx, "type", e.target.value)}
                            style={{
                              padding: "9px 12px",
                              border: "1px solid #d1d5db",
                              borderRadius: 6,
                              fontSize: 13,
                              background: "#fff",
                            }}
                          >
                            <option value="text">Standard Text (Paragraphs)</option>
                            <option value="checklist">Checklist (Green Check Icons)</option>
                            <option value="numbered">Numbered Steps (1, 2, 3 Pathway)</option>
                            <option value="highlight">Highlight Callout Box</option>
                          </select>
                        </div>
                      </div>

                      {/* Content / Intro Body */}
                      <div className="adt-field">
                        <label>
                          Body Text / Explanation{" "}
                          <span style={{ fontWeight: 400, color: "#6b7280" }}>
                            (Blank lines represent paragraph breaks)
                          </span>
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Section paragraph content..."
                          value={sec.content}
                          onChange={(e) => updateSection(idx, "content", e.target.value)}
                        />
                      </div>

                      {/* Repeatable Items List (for checklist, numbered, highlight) */}
                      {(sec.type === "checklist" ||
                        sec.type === "numbered" ||
                        sec.type === "highlight") && (
                        <div
                          style={{
                            background: "#f8fafc",
                            padding: 12,
                            borderRadius: 6,
                            border: "1px dashed #cbd5e1",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 8,
                            }}
                          >
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                              {sec.type === "numbered"
                                ? "Numbered Step Items"
                                : sec.type === "checklist"
                                ? "Checklist Items"
                                : "Highlight Bullet Points"}
                            </label>
                            <button
                              type="button"
                              onClick={() => addSectionItem(idx)}
                              style={{
                                background: "#0d9488",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                padding: "3px 8px",
                                fontSize: 11,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Plus size={11} /> Add Item
                            </button>
                          </div>

                          <div style={{ display: "grid", gap: 6 }}>
                            {(sec.items || []).map((item, itemIdx) => (
                              <div
                                key={itemIdx}
                                style={{ display: "flex", alignItems: "center", gap: 8 }}
                              >
                                <span style={{ fontSize: 12, color: "#64748b", width: 20 }}>
                                  {sec.type === "numbered" ? `${itemIdx + 1}.` : "•"}
                                </span>
                                <input
                                  type="text"
                                  placeholder={`Item #${itemIdx + 1}`}
                                  value={item}
                                  onChange={(e) =>
                                    updateSectionItem(idx, itemIdx, e.target.value)
                                  }
                                  style={{ flex: 1 }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeSectionItem(idx, itemIdx)}
                                  style={{
                                    background: "#fee2e2",
                                    border: "none",
                                    color: "#dc2626",
                                    padding: "6px",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                  }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                            {(!sec.items || sec.items.length === 0) && (
                              <div style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>
                                No items added yet. Click &quot;Add Item&quot; to add bullet points or steps.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: DOCTORS */}
          {/* ======================================================== */}
          {activeTab === "doctors" && (
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: 16, color: "#111827", fontWeight: 700 }}>
                Specialist Eye Surgeons
              </h3>
              <p style={{ margin: "0 0 16px 0", fontSize: 13, color: "#6b7280" }}>
                Select the senior doctors featured in the &quot;Meet Our Specialists&quot; section on this page.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {doctorsList.map((doc) => {
                  const isChecked = form.doctorIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDoctor(doc.id)}
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        border: isChecked ? "2px solid #0d9488" : "1px solid #e5e7eb",
                        background: isChecked ? "#f0fdfa" : "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        transition: "all 0.15s ease",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent div
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                      />
                      {doc.image ? (
                        <img
                          src={doc.image}
                          alt={doc.name || "Doctor"}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/Assets/img/team/1.png";
                          }}
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "1px solid #cbd5e1",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: "#e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#475569",
                          }}
                        >
                          DR
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#0d9488", fontWeight: 500 }}>
                          {doc.role || "Ophthalmologist"}
                        </div>
                        {doc.qualification && (
                          <div style={{ fontSize: 11, color: "#64748b" }}>
                            {doc.qualification}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: FAQS */}
          {/* ======================================================== */}
          {activeTab === "faqs" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, color: "#111827", fontWeight: 700 }}>
                    Frequently Asked Questions (FAQs)
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#6b7280" }}>
                    These questions are automatically rendered in the FAQ Accordion and encoded into FAQPage JSON-LD schema.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addFaq}
                  className="adt-btn-save"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <Plus size={15} /> Add FAQ
                </button>
              </div>

              <div style={{ display: "grid", gap: 14 }}>
                {form.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      background: "#ffffff",
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 12,
                          color: "#0d9488",
                          background: "#f0fdfa",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        Q#{idx + 1}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => moveFaq(idx, -1)}
                          disabled={idx === 0}
                          style={{
                            background: "none",
                            border: "1px solid #cbd5e1",
                            borderRadius: 4,
                            padding: 3,
                            cursor: idx === 0 ? "not-allowed" : "pointer",
                            opacity: idx === 0 ? 0.4 : 1,
                          }}
                        >
                          <ChevronUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveFaq(idx, 1)}
                          disabled={idx === form.faqs.length - 1}
                          style={{
                            background: "none",
                            border: "1px solid #cbd5e1",
                            borderRadius: 4,
                            padding: 3,
                            cursor: idx === form.faqs.length - 1 ? "not-allowed" : "pointer",
                            opacity: idx === form.faqs.length - 1 ? 0.4 : 1,
                          }}
                        >
                          <ChevronDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
                          style={{
                            background: "#fee2e2",
                            border: "none",
                            color: "#dc2626",
                            padding: 4,
                            borderRadius: 4,
                            cursor: "pointer",
                            marginLeft: 4,
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 10 }}>
                      <div className="adt-field">
                        <label>Question</label>
                        <input
                          type="text"
                          placeholder="e.g. Is cataract surgery covered under health insurance in Moradabad?"
                          value={faq.question}
                          onChange={(e) => updateFaq(idx, "question", e.target.value)}
                        />
                      </div>
                      <div className="adt-field">
                        <label>Answer</label>
                        <textarea
                          rows={3}
                          placeholder="Provide a clear, clinical, patient-friendly answer..."
                          value={faq.answer}
                          onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: RELATED SERVICES */}
          {/* ======================================================== */}
          {activeTab === "related" && (
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: 16, color: "#111827", fontWeight: 700 }}>
                Related Services &amp; Internal Linking
              </h3>
              <p style={{ margin: "0 0 16px 0", fontSize: 13, color: "#6b7280" }}>
                Select other published SEO landing pages to showcase in the &quot;Related Specialities&quot; grid at the bottom.
              </p>

              {availableRelatedPages.length === 0 ? (
                <div
                  style={{
                    padding: 24,
                    background: "#f9fafb",
                    borderRadius: 8,
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: 13,
                  }}
                >
                  No other SEO pages are published yet. As you add more pages (e.g. LASIK, Glaucoma), they will appear here for cross-linking.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {availableRelatedPages.map((page) => {
                    const isChecked = form.relatedIds.includes(page.id);
                    return (
                      <div
                        key={page.id}
                        onClick={() => toggleRelated(page.id)}
                        style={{
                          padding: 12,
                          borderRadius: 8,
                          border: isChecked ? "2px solid #0d9488" : "1px solid #e5e7eb",
                          background: isChecked ? "#f0fdfa" : "#ffffff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          style={{ width: 18, height: 18 }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
                            {page.h1Title}
                          </div>
                          <code style={{ fontSize: 11, color: "#64748b" }}>
                            /services/{page.slug}
                          </code>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Form Actions Footer */}
          <div
            className="adt-form-actions"
            style={{
              marginTop: 30,
              paddingTop: 20,
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            <Link
              href="/admin/seo-pages"
              className="adt-btn-cancel-form"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="adt-btn-save"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="adt-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save size={16} /> {isEditing ? "Update SEO Page" : "Publish SEO Page"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Reusable Template Live Preview Modal */}
      {showPreview && (
        <SeoPagePreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          pageData={form}
          doctorsList={doctorsList}
          allPages={allPages}
        />
      )}

      {/* Document Importer Modal */}
      {showImporter && (
        <DocumentImportModal
          isOpen={showImporter}
          onClose={() => setShowImporter(false)}
          onApplyToForm={(data) => handleApplyImported(data, "replace")}
          doctorsList={doctorsList}
          allPages={allPages}
        />
      )}
    </div>
  );
}
