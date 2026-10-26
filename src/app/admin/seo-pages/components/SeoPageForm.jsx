"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
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
  CheckCircle2,
  ListOrdered,
  CheckSquare,
  AlertCircle,
  Eye,
  Code,
  UserCheck,
  Link2,
  Search,
  X,
  Stethoscope,
} from "lucide-react";
import ImageUpload from "../../components/ImageUpload";
import RichHtmlEditor from "./RichHtmlEditor";
import { toast } from "../../components/Toast";
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

  // Active Tab: "seo" | "hero" | "content" | "doctors" | "related" | "schema"
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
    heroBadge: initialData?.heroBadge ?? (isEditing ? "" : "NABH-Accredited Eye Hospital in Moradabad"),
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
    customSchema: initialData?.customSchema || "",
    relatedIds: Array.isArray(initialData?.relatedIds) ? initialData.relatedIds : [],
  });

  // Local list of doctors (allows adding new doctor dynamically)
  const [localDoctors, setLocalDoctors] = useState(doctorsList || []);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [savingDoctor, setSavingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    role: "Senior Eye Surgeon & Ophthalmologist",
    qualification: "MBBS, MS (Ophthalmology)",
    image: "",
    badgeText: "Senior Consultant",
    profileHref: "",
    bio: "",
    sortOrder: 0,
  });

  // Search query for Related Services & Internal Linking
  const [relatedSearch, setRelatedSearch] = useState("");

  const [slugLocked, setSlugLocked] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Draft persistence for "Add New SEO Page" and "Edit SEO Page" to prevent data loss on refresh
  const DRAFT_KEY = isEditing && initialData?.id
    ? `seo_page_edit_draft_${initialData.id}`
    : "seo_page_new_draft_v1";
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  // 1. Restore draft and active tab on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const { _activeTab, ...savedFormData } = parsed;
          setForm((prev) => ({
            ...prev,
            ...savedFormData,
            heroBadge: savedFormData.heroBadge || (isEditing ? prev.heroBadge : "NABH-Accredited Eye Hospital in Moradabad"),
          }));
          if (savedFormData.slug) setSlugLocked(true);
          if (_activeTab) setActiveTab(_activeTab);
          setHasRestoredDraft(true);
        }
      }
    } catch {
      // ignore JSON parse or storage errors
    }
  }, [DRAFT_KEY, isEditing]);

  // 2. Auto-save form data + current active tab to localStorage whenever form or activeTab changes
  useEffect(() => {
    try {
      const dataToSave = {
        ...form,
        _activeTab: activeTab,
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(dataToSave));
    } catch {
      // ignore storage errors
    }
  }, [form, activeTab, DRAFT_KEY]);

  function handleDiscardDraft() {
    const confirmText = isEditing
      ? "Are you sure you want to discard your unsaved changes and reload original data?"
      : "Are you sure you want to discard this auto-saved draft and reset to default?";
    if (window.confirm(confirmText)) {
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      setHasRestoredDraft(false);
      window.location.reload();
    }
  }

  // Add new doctor via API and automatically select them
  async function handleCreateDoctor(e) {
    if (e) e.preventDefault();
    if (!newDoctor.name.trim()) {
      toast("Doctor name is required.", "error");
      return;
    }

    setSavingDoctor(true);
    try {
      const res = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoctor),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Failed to add doctor.", "error");
      } else {
        toast(`Doctor "${data.name}" added successfully!`, "success");
        setLocalDoctors((prev) => [...prev, data]);
        // Auto-select this newly created doctor
        setForm((prev) => ({
          ...prev,
          doctorIds: prev.doctorIds.includes(data.id) ? prev.doctorIds : [...prev.doctorIds, data.id],
        }));
        // Reset form & close modal
        setNewDoctor({
          name: "",
          role: "Senior Eye Surgeon & Ophthalmologist",
          qualification: "MBBS, MS (Ophthalmology)",
          image: "",
          badgeText: "Senior Consultant",
          profileHref: "",
          bio: "",
          sortOrder: 0,
        });
        setDoctorModalOpen(false);
      }
    } catch {
      toast("Error creating doctor. Please check your connection.", "error");
    } finally {
      setSavingDoctor(false);
    }
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
            prev.canonicalUrl.startsWith("https://www.oracleeyehospital.com/")
            ? `https://www.oracleeyehospital.com/${nextSlug}`
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
          prev.canonicalUrl.startsWith("https://www.oracleeyehospital.com/")
          ? `https://www.oracleeyehospital.com/${clean}`
          : prev.canonicalUrl,
    }));
  }

  // Sync slug with current H1
  function syncSlugWithH1() {
    const generated = slugify(form.h1Title);
    setForm((prev) => ({
      ...prev,
      slug: generated,
      canonicalUrl: `https://www.oracleeyehospital.com/${generated}`,
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
          headingLevel: 2,
          type: "text",
          content: "",
          items: [],
        },
      ],
    }));

    // Auto-scroll to the newly created section
    setTimeout(() => {
      const el = document.getElementById(newId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const headingInput = el.querySelector("input");
        if (headingInput) {
          headingInput.focus();
          headingInput.select();
        }
      }
    }, 120);
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
      toast(`Duplicate slug: "/${form.slug}" is already taken.`, "error");
      return;
    }

    // Validate Custom Schema if provided
    if (form.customSchema && form.customSchema.trim()) {
      let text = form.customSchema.trim();
      if (text.startsWith("<script") && text.endsWith("</script>")) {
        text = text.replace(/<script[^>]*>/, "").replace(/<\/script>$/, "").trim();
      }
      try {
        JSON.parse(text);
      } catch (err) {
        setErrorMsg(`Custom Schema JSON Syntax Error: ${err.message}. Please fix or click "Format & Validate JSON".`);
        setActiveTab("schema");
        toast("Invalid Custom Schema JSON", "error");
        return;
      }
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
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {}
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

  // Tab Order definitions
  const TABS_ORDER = ["seo", "hero", "content", "doctors", "related", "schema"];
  const currentTabIndex = TABS_ORDER.indexOf(activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === TABS_ORDER.length - 1;

  function goToNextTab() {
    if (currentTabIndex < TABS_ORDER.length - 1) {
      setActiveTab(TABS_ORDER[currentTabIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goToPrevTab() {
    if (currentTabIndex > 0) {
      setActiveTab(TABS_ORDER[currentTabIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Filter other pages for related selection (exclude self)
  const availableRelatedPages = allPages.filter((p) => p.id !== initialData?.id);

  // Search filtered pages for internal linking
  const filteredRelatedPages = availableRelatedPages.filter((page) => {
    if (!relatedSearch.trim()) return true;
    const q = relatedSearch.toLowerCase().trim();
    return (
      page.h1Title?.toLowerCase().includes(q) ||
      page.slug?.toLowerCase().includes(q) ||
      page.metaTitle?.toLowerCase().includes(q)
    );
  });

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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 className="adt-header-title" style={{ margin: 0 }}>
                {isEditing ? `Edit: ${form.h1Title || "SEO Page"}` : "Add New SEO Page"}
              </h2>
              {hasRestoredDraft && (
                <span
                  style={{
                    background: "#ecfdf5",
                    color: "#059669",
                    border: "1px solid #a7f3d0",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  ● Auto-saved Draft Restored
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4, display: "flex", alignItems: "center", gap: 10 }}>
              <span>Path: <code>/{form.slug || "[slug]"}</code></span>
              {hasRestoredDraft && (
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "#dc2626",
                    fontSize: 12,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  {isEditing ? "Discard Changes & Reload" : "Discard Draft & Reset"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isEditing && form.slug && (
            <a
              href={`/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#0d9488",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 13,
                padding: "9px 14px",
                borderRadius: 6,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Eye size={16} />
              <span>View Live Page</span>
            </a>
          )}

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

          {(!isEditing && !isLastTab) ? (
            <button
              type="button"
              onClick={goToNextTab}
              className="adt-btn-save"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#0d9488",
              }}
            >
              <span>Next Step</span> <ArrowRight size={16} />
            </button>
          ) : (
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
                  <Save size={16} /> {isEditing ? "Save Page" : "Publish SEO Page"}
                </>
              )}
            </button>
          )}
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
          {
            id: "content",
            label: `3. Content & FAQs (${form.sections.length} Sec, ${form.faqs.length} FAQ)`,
            icon: FileText,
          },
          {
            id: "doctors",
            label: `4. Specialist Doctors (${form.doctorIds.length})`,
            icon: UserCheck,
          },
          {
            id: "related",
            label: `5. Related Links (${form.relatedIds.length})`,
            icon: Link2,
          },
          {
            id: "schema",
            label: `6. Custom Schema ${form.customSchema ? "✓" : ""}`,
            icon: Code,
          },
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
                    className={`adt-badge ${form.status === "published" ? "adt-badge-active" : "adt-badge-inactive"
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
                  <span style={{ fontSize: 13, color: "#6b7280" }}>/</span>
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
                  placeholder={`https://www.oracleeyehospital.com/${form.slug || ""}`}
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
                <span style={{ fontSize: 11, color: "#64748b", display: "block", marginTop: 4 }}>
                  Default: <strong>NABH-Accredited Eye Hospital in Moradabad</strong> (Common across pages, can be edited anytime)
                </span>
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
          {activeTab === "content" && (
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
                    id={sec.id || `section-${idx}`}
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
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <label style={{ margin: 0 }}>
                              Section Heading (H{sec.headingLevel || 2}) *
                            </label>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Tag:</span>
                              <select
                                value={sec.headingLevel || 2}
                                onChange={(e) => updateSection(idx, "headingLevel", parseInt(e.target.value, 10))}
                                style={{
                                  padding: "2px 6px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  borderRadius: 4,
                                  border: "1px solid #cbd5e1",
                                  background: "#f8fafc",
                                  color: "#0f766e",
                                  cursor: "pointer",
                                }}
                                title="Change heading tag level for SEO"
                              >
                                {[1, 2, 3, 4, 5, 6].map((lvl) => (
                                  <option key={lvl} value={lvl}>
                                    H{lvl}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
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
                        <RichHtmlEditor
                          value={sec.content || ""}
                          onChange={(html) => updateSection(idx, "content", html)}
                          placeholder="Section paragraph content..."
                          minHeight={130}
                          onToggleBulletList={() => {
                            if (sec.type === "highlight") {
                              updateSection(idx, "type", "text");
                            } else {
                              const existingItems = Array.isArray(sec.items) && sec.items.length > 0
                                ? sec.items
                                : ["", ""];
                              setForm((prev) => {
                                const next = [...prev.sections];
                                next[idx] = {
                                  ...next[idx],
                                  type: "highlight",
                                  items: existingItems,
                                };
                                return { ...prev, sections: next };
                              });
                            }
                          }}
                          onToggleOrderedList={() => {
                            if (sec.type === "numbered") {
                              updateSection(idx, "type", "text");
                            } else {
                              const existingItems = Array.isArray(sec.items) && sec.items.length > 0
                                ? sec.items
                                : ["", ""];
                              setForm((prev) => {
                                const next = [...prev.sections];
                                next[idx] = {
                                  ...next[idx],
                                  type: "numbered",
                                  items: existingItems,
                                };
                                return { ...prev, sections: next };
                              });
                            }
                          }}
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
                                  <div style={{ flex: 1 }}>
                                    <input
                                      type="text"
                                      value={item || ""}
                                      onChange={(e) => updateSectionItem(idx, itemIdx, e.target.value)}
                                      placeholder={`Item #${itemIdx + 1} (e.g. Carry all reports, scans, and medicines)`}
                                      style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        border: "1px solid #cbd5e1",
                                        borderRadius: 6,
                                        fontSize: 13,
                                        background: "#fff",
                                        outline: "none",
                                        transition: "border-color 0.15s ease",
                                      }}
                                      onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                                      onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                                    />
                                  </div>
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
          {/* TAB 3 (Part 2): FAQS (inside Content tab) */}
          {/* ======================================================== */}
          {activeTab === "content" && (
            <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid #e5e7eb" }}>
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
                    Accordion FAQs displayed on the page and automatically formatted for Google FAQPage schema.
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
                        <RichHtmlEditor
                          value={faq.answer || ""}
                          onChange={(html) => updateFaq(idx, "answer", html)}
                          placeholder="Provide a clear, clinical, patient-friendly answer..."
                          minHeight={100}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: SPECIALIST EYE SURGEONS (OPTIONAL) */}
          {/* ======================================================== */}
          {activeTab === "doctors" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                  paddingBottom: 14,
                  borderBottom: "1px solid #e5e7eb",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 16, color: "#111827", fontWeight: 700 }}>
                      Specialist Eye Surgeons
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        background: "#f1f5f9",
                        color: "#475569",
                        borderRadius: 12,
                        border: "1px solid #cbd5e1",
                      }}
                    >
                      Optional
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#6b7280" }}>
                    Select the doctors featured in the &quot;Meet Our Specialists&quot; section on this page. If none are selected, doctors will be omitted or defaults will show.
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setDoctorModalOpen(true)}
                    className="adt-btn-save"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#0d9488",
                      fontSize: 13,
                      padding: "7px 14px",
                    }}
                  >
                    <Plus size={15} /> Add New Doctor
                  </button>

                  {form.doctorIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, doctorIds: [] }))}
                      style={{
                        background: "transparent",
                        border: "1px solid #cbd5e1",
                        borderRadius: 6,
                        padding: "7px 12px",
                        fontSize: 12,
                        color: "#64748b",
                        cursor: "pointer",
                      }}
                    >
                      Clear Selection ({form.doctorIds.length})
                    </button>
                  )}
                </div>
              </div>

              {localDoctors.length === 0 ? (
                <div
                  style={{
                    padding: 30,
                    background: "#f9fafb",
                    borderRadius: 8,
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: 13,
                  }}
                >
                  <p style={{ marginBottom: 14 }}>No doctors found in the database yet.</p>
                  <button
                    type="button"
                    onClick={() => setDoctorModalOpen(true)}
                    className="adt-btn-save"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <Plus size={15} /> Add First Doctor
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {localDoctors.map((doc) => {
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
                          onChange={() => { }} // handled by parent div
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
                        <div style={{ flex: 1, minWidth: 0 }}>
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
                          {doc.badgeText && (
                            <span
                              style={{
                                display: "inline-block",
                                marginTop: 3,
                                fontSize: 10,
                                background: "#ecfdf5",
                                color: "#047857",
                                padding: "1px 6px",
                                borderRadius: 4,
                                fontWeight: 600,
                              }}
                            >
                              {doc.badgeText}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: RELATED SERVICES & INTERNAL LINKING (OPTIONAL) */}
          {/* ======================================================== */}
          {activeTab === "related" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                  paddingBottom: 14,
                  borderBottom: "1px solid #e5e7eb",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 16, color: "#111827", fontWeight: 700 }}>
                      Related Services &amp; Internal Linking
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        background: "#f1f5f9",
                        color: "#475569",
                        borderRadius: 12,
                        border: "1px solid #cbd5e1",
                      }}
                    >
                      Optional
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#6b7280" }}>
                    Select other published SEO landing pages to showcase in the &quot;Related Specialities&quot; grid at the bottom.
                  </p>
                </div>
                {form.relatedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, relatedIds: [] }))}
                    style={{
                      background: "transparent",
                      border: "1px solid #cbd5e1",
                      borderRadius: 6,
                      padding: "5px 10px",
                      fontSize: 12,
                      color: "#64748b",
                      cursor: "pointer",
                    }}
                  >
                    Clear Selection ({form.relatedIds.length})
                  </button>
                )}
              </div>

              {/* Search Bar for Related Pages */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    position: "relative",
                    maxWidth: 420,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Search
                    size={16}
                    style={{
                      position: "absolute",
                      left: 12,
                      color: "#94a3b8",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="text"
                    value={relatedSearch}
                    onChange={(e) => setRelatedSearch(e.target.value)}
                    placeholder="Search landing pages by title or slug..."
                    style={{
                      width: "100%",
                      padding: "9px 36px 9px 36px",
                      borderRadius: 7,
                      border: "1px solid #cbd5e1",
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {relatedSearch && (
                    <button
                      type="button"
                      onClick={() => setRelatedSearch("")}
                      style={{
                        position: "absolute",
                        right: 8,
                        background: "transparent",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: 4,
                        display: "inline-flex",
                      }}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
                {relatedSearch && (
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                    Showing {filteredRelatedPages.length} matching result(s)
                  </div>
                )}
              </div>

              {availableRelatedPages.length === 0 ? (
                <div
                  style={{
                    padding: 30,
                    background: "#f9fafb",
                    borderRadius: 8,
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: 13,
                  }}
                >
                  No other SEO pages are published yet. As you add more pages (e.g. LASIK, Glaucoma), they will appear here for cross-linking.
                </div>
              ) : filteredRelatedPages.length === 0 ? (
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
                  No SEO pages matched &quot;{relatedSearch}&quot;.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {filteredRelatedPages.map((page) => {
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
                          transition: "all 0.15s ease",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => { }}
                          style={{ width: 18, height: 18 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
                            {page.h1Title}
                          </div>
                          <code style={{ fontSize: 11, color: "#0d9488" }}>
                            /{page.slug}
                          </code>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: CUSTOM SCHEMA & JSON-LD */}
          {/* ======================================================== */}
          {activeTab === "schema" && (
            <div style={{ display: "grid", gap: 20 }}>
              <div>
                <h3 style={{ margin: "0 0 6px 0", fontSize: 16, color: "#111827", fontWeight: 700 }}>
                  Custom JSON-LD Schema
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>
                  Add your own custom Schema.org markup (JSON or &lt;script type=&quot;application/ld+json&quot;&gt; tags).
                  It will be embedded directly into the live page HTML source for search engines and Google Bot.
                </p>
              </div>

              {/* Template Buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    const sample = JSON.stringify(
                      {
                        "@context": "https://schema.org",
                        "@type": "MedicalProcedure",
                        name: form.h1Title || "Procedure Name",
                        description: form.metaDescription || "Procedure Description",
                        procedureType: "SurgicalProcedure",
                        bodyLocation: "Eye",
                        provider: {
                          "@type": "Hospital",
                          name: "Oracle Eye Hospital",
                          url: "https://www.oracleeyehospital.com",
                        },
                      },
                      null,
                      2
                    );
                    setForm((prev) => ({ ...prev, customSchema: sample }));
                  }}
                  style={{
                    padding: "6px 12px",
                    background: "#f0fdfa",
                    border: "1px solid #99f6e4",
                    color: "#0f766e",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  + Load MedicalProcedure Template
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const sample = JSON.stringify(
                      {
                        "@context": "https://schema.org",
                        "@type": "MedicalBusiness",
                        name: "Oracle Eye Hospital",
                        url: `https://www.oracleeyehospital.com/${form.slug || ""}`,
                        telephone: form.ctaPhone || "+91 8006803111",
                        address: {
                          "@type": "PostalAddress",
                          streetAddress: "Kanth Road",
                          addressLocality: "Moradabad",
                          addressRegion: "Uttar Pradesh",
                          postalCode: "244001",
                          addressCountry: "IN",
                        },
                      },
                      null,
                      2
                    );
                    setForm((prev) => ({ ...prev, customSchema: sample }));
                  }}
                  style={{
                    padding: "6px 12px",
                    background: "#f0fdfa",
                    border: "1px solid #99f6e4",
                    color: "#0f766e",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  + Load MedicalBusiness Template
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!form.customSchema.trim()) return;
                    try {
                      let text = form.customSchema.trim();
                      if (text.startsWith("<script") && text.endsWith("</script>")) {
                        const inner = text.replace(/<script[^>]*>/, "").replace(/<\/script>$/, "");
                        const formatted = JSON.stringify(JSON.parse(inner), null, 2);
                        setForm((prev) => ({ ...prev, customSchema: formatted }));
                      } else {
                        const formatted = JSON.stringify(JSON.parse(text), null, 2);
                        setForm((prev) => ({ ...prev, customSchema: formatted }));
                      }
                      toast("JSON Schema is valid and formatted!", "success");
                    } catch (err) {
                      toast("Invalid JSON syntax: " + err.message, "error");
                    }
                  }}
                  style={{
                    padding: "6px 12px",
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    color: "#334155",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Format &amp; Validate JSON
                </button>

                {form.customSchema && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, customSchema: "" }))}
                    style={{
                      padding: "6px 12px",
                      background: "#fee2e2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      marginLeft: "auto",
                    }}
                  >
                    Clear Custom Schema
                  </button>
                )}
              </div>

              {/* Textarea code editor */}
              <div className="adt-field">
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Custom Schema JSON / JSON-LD</span>
                  <span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}>
                    Enter pure JSON (e.g. {`{"@context": "https://schema.org", ...}`})
                  </span>
                </label>
                <textarea
                  rows={14}
                  value={form.customSchema}
                  onChange={(e) => setForm((prev) => ({ ...prev, customSchema: e.target.value }))}
                  placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "MedicalWebPage",\n  "name": "${form.h1Title || "Page Title"}",\n  ...\n}`}
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    fontSize: 13,
                    lineHeight: 1.5,
                    background: "#0f172a",
                    color: "#38bdf8",
                    padding: "14px",
                    borderRadius: 8,
                    border: "1px solid #334155",
                  }}
                />
              </div>

              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 12.5,
                  color: "#166534",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <CheckCircle2 size={16} />
                <span>
                  <strong>Tip:</strong> Default schemas (Breadcrumb, Hospital, Physician, FAQ Accordion) are already auto-generated.
                  Any custom JSON you enter here will be rendered alongside them inside &lt;script type=&quot;application/ld+json&quot;&gt; in the page source.
                </span>
              </div>
            </div>
          )}
          <div
            className="adt-form-actions"
            style={{
              marginTop: 30,
              paddingTop: 20,
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <Link
                href="/admin/seo-pages"
                className="adt-btn-cancel-form"
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
              >
                Cancel
              </Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Previous Tab button for multi-step navigation */}
              {!isFirstTab && (
                <button
                  type="button"
                  onClick={goToPrevTab}
                  className="adt-btn-cancel-form"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 16px",
                    fontWeight: 600,
                  }}
                >
                  <ArrowLeft size={16} /> Previous
                </button>
              )}

              {/* When creating a new page and NOT on the last tab: Show "Next" button */}
              {!isEditing && !isLastTab ? (
                <button
                  type="button"
                  onClick={goToNextTab}
                  className="adt-btn-save"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 20px",
                    background: "#2563eb",
                    border: "1px solid #2563eb",
                    color: "#ffffff",
                    fontWeight: 600,
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  <span>Next</span> <ArrowRight size={16} />
                </button>
              ) : (
                /* When on the last tab (or when editing an existing page): Show Publish/Update button */
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
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Reusable Template Live Preview Modal */}
      {showPreview && (
        <SeoPagePreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          pageData={form}
          doctorsList={localDoctors}
          allPages={allPages}
        />
      )}

      {/* ── Add New Doctor Modal (Complete Fields) ── */}
      {doctorModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setDoctorModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 600,
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              background: "#ffffff",
              borderRadius: 14,
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.35)",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              animation: "modalFadeIn 0.18s ease-out",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 22px",
                borderBottom: "1px solid #f1f5f9",
                background: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: "#ecfdf5",
                    color: "#059669",
                  }}
                >
                  <Stethoscope size={18} />
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                    Add Specialist Doctor
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                    Enter complete profile details. The doctor will be saved and selected automatically.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDoctorModalOpen(false)}
                style={{
                  background: "transparent",
                  border: 0,
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: 4,
                  borderRadius: 6,
                  display: "inline-flex",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form
              onSubmit={handleCreateDoctor}
              style={{
                padding: "20px 22px",
                overflowY: "auto",
                flex: 1,
                display: "grid",
                gap: 16,
              }}
            >
              {/* Name (Required) */}
              <div className="adt-field">
                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                  Doctor Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Dr. A. K. Sharma"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor((prev) => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 7,
                    border: "1px solid #cbd5e1",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Role & Qualification (2 cols) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="adt-field">
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                    Specialty / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Phaco Surgeon"
                    value={newDoctor.role}
                    onChange={(e) => setNewDoctor((prev) => ({ ...prev, role: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 7,
                      border: "1px solid #cbd5e1",
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div className="adt-field">
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                    Qualifications
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, MS, FICO (UK)"
                    value={newDoctor.qualification}
                    onChange={(e) =>
                      setNewDoctor((prev) => ({ ...prev, qualification: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 7,
                      border: "1px solid #cbd5e1",
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Doctor Photo Upload */}
              <div className="adt-field">
                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                  Doctor Photo
                </label>
                <ImageUpload
                  value={newDoctor.image}
                  onChange={(url) => setNewDoctor((prev) => ({ ...prev, image: url }))}
                />
              </div>

              {/* Badge Text & Profile URL (2 cols) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="adt-field">
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                    Badge Text (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15+ Yrs Exp / Chief Surgeon"
                    value={newDoctor.badgeText}
                    onChange={(e) => setNewDoctor((prev) => ({ ...prev, badgeText: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 7,
                      border: "1px solid #cbd5e1",
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div className="adt-field">
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                    Profile Link / Page Href
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /doctors or /about"
                    value={newDoctor.profileHref}
                    onChange={(e) =>
                      setNewDoctor((prev) => ({ ...prev, profileHref: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 7,
                      border: "1px solid #cbd5e1",
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Bio / Description */}
              <div className="adt-field">
                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                  Bio / Clinical Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief clinical background, surgical experience, awards..."
                  value={newDoctor.bio}
                  onChange={(e) => setNewDoctor((prev) => ({ ...prev, bio: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 7,
                    border: "1px solid #cbd5e1",
                    fontSize: 13,
                    fontFamily: "inherit",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Modal Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  paddingTop: 12,
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={() => setDoctorModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 7,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#475569",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDoctor || !newDoctor.name.trim()}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 7,
                    border: "1px solid #0d9488",
                    background: "#0d9488",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: savingDoctor ? "wait" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {savingDoctor ? (
                    <>
                      <Loader2 size={15} className="adt-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Plus size={15} /> Save &amp; Select Doctor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
