"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Eye,
  Save,
  Send,
  Loader2,
  X,
  Download,
  Layers,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { parseBasicText, validateSeoPageData, slugify } from "./parseEngine";
import SeoPagePreviewModal from "./SeoPagePreviewModal";
import { toast } from "../../components/Toast";

export default function DocumentImportModal({
  isOpen,
  onClose,
  onApplyToForm,
  doctorsList = [],
  allPages = [],
}) {
  const router = useRouter();

  // Mode: "upload" | "paste"
  const [inputMode, setInputMode] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState("");
  const fileInputRef = useRef(null);

  // Processing state
  const [processingState, setProcessingState] = useState("idle"); // "idle" | "uploading" | "parsing" | "validating" | "reviewed"
  const [errorMessage, setErrorMessage] = useState("");

  // Extracted data & validation
  const [extractedMeta, setExtractedMeta] = useState(null); // { fileName, fileType, fileSizeBytes }
  const [parsedData, setParsedData] = useState(null);
  const [validationReport, setValidationReport] = useState(null);
  const [slugConflict, setSlugConflict] = useState(null);
  const [unmappedContent, setUnmappedContent] = useState([]);

  // Active Review Tab: "metadata" | "hero" | "sections" | "faqs" | "unmapped"
  const [activeReviewTab, setActiveReviewTab] = useState("metadata");

  // Live Template Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);

  // Submitting state
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  // ── Drag & Drop Handlers ──────────────────────────────────────────
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  function handleFileSelect(file) {
    if (!file) return;
    const name = file.name.toLowerCase();
    const ext = name.split(".").pop();
    if (!["txt", "docx", "doc"].includes(ext)) {
      setErrorMessage(`Unsupported format .${ext}. Please upload a .docx, .txt, or .doc file.`);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(`File exceeds 10 MB maximum limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
      return;
    }
    setSelectedFile(file);
    setErrorMessage("");
  }

  // ── Document Upload & Parse API Call ──────────────────────────────
  async function handleProcessUpload() {
    if (!selectedFile) {
      setErrorMessage("Please select a file to import.");
      return;
    }

    setProcessingState("uploading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setProcessingState("parsing");

      const res = await fetch("/api/admin/seo-pages/import-document", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to process document.");
        setProcessingState("idle");
        return;
      }

      setProcessingState("validating");

      setExtractedMeta({
        fileName: data.fileName,
        fileType: data.fileType,
        fileSizeBytes: data.fileSizeBytes,
      });

      setParsedData(data.parsedData);
      setValidationReport(data.validationReport);
      setSlugConflict(data.slugConflict);
      setUnmappedContent(data.unmappedContent || []);

      setProcessingState("reviewed");
    } catch (err) {
      setErrorMessage("Network error processing document: " + (err?.message || "Check connection"));
      setProcessingState("idle");
    }
  }

  // ── Process Pasted Text Mode ──────────────────────────────────────
  function handleProcessPastedText() {
    if (!pastedText.trim()) {
      setErrorMessage("Please paste SEO content into the text area.");
      return;
    }

    setProcessingState("parsing");
    setErrorMessage("");

    try {
      const parsed = parseBasicText(pastedText, doctorsList, allPages);
      if (!parsed) {
        setErrorMessage("Could not parse content from text.");
        setProcessingState("idle");
        return;
      }

      const existingSlugs = allPages.map((p) => p.slug);
      const report = validateSeoPageData(parsed, existingSlugs);

      setExtractedMeta({
        fileName: "Pasted Text Import",
        fileType: "TXT",
        fileSizeBytes: new Blob([pastedText]).size,
      });

      setParsedData(parsed);
      setValidationReport(report);
      setUnmappedContent(parsed.unmappedContent || []);

      const conflict = allPages.find((p) => p.slug === parsed.slug);
      setSlugConflict(conflict ? { exists: true, existingTitle: conflict.h1Title, existingSlug: conflict.slug, existingId: conflict.id } : null);

      setProcessingState("reviewed");
    } catch (err) {
      setErrorMessage("Failed to parse text: " + (err?.message || err));
      setProcessingState("idle");
    }
  }

  // ── Field Updates from Review Tabs ────────────────────────────────
  function handleFieldChange(field, value) {
    if (!parsedData) return;
    const updated = { ...parsedData, [field]: value };
    if (field === "slug") {
      updated.slug = slugify(value);
      updated.canonicalUrl = `https://www.oracleeyehospital.com/${updated.slug}`;
    }
    setParsedData(updated);

    // Re-run validation
    const existingSlugs = allPages.map((p) => p.slug);
    const report = validateSeoPageData(updated, existingSlugs);
    setValidationReport(report);
  }

  // ── Conflict Resolution Handlers ──────────────────────────────────
  function handleAutoFixSlug() {
    if (!parsedData) return;
    let newSlug = `${parsedData.slug}-new`;
    let counter = 1;
    while (allPages.some((p) => p.slug === newSlug)) {
      counter++;
      newSlug = `${parsedData.slug}-${counter}`;
    }
    handleFieldChange("slug", newSlug);
    setSlugConflict(null);
    toast("Generated unique slug: " + newSlug, "info");
  }

  // ── Save or Publish Workflow ──────────────────────────────────────
  async function handleCommit(targetStatus) {
    if (!parsedData) return;

    // Check blocking errors before publish
    if (targetStatus === "published" && validationReport && !validationReport.isValid) {
      setErrorMessage("Cannot publish: Please fix blocking errors listed in the validation report first.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const payload = {
        ...parsedData,
        status: targetStatus,
      };

      // Check if updating existing page or creating new
      let res;
      if (slugConflict && slugConflict.exists && slugConflict.existingId) {
        res = await fetch(`/api/admin/seo-pages/${slugConflict.existingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/seo-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const text = await res.text();
      let json = {};
      try {
        json = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        const errorDetail = json.error || (text && text.length < 300 && !text.includes("<html") ? text : null) || `Failed to ${targetStatus === "published" ? "publish" : "save"} page. (Status ${res.status})`;
        setErrorMessage(errorDetail);
        setIsSaving(false);
        return;
      }

      toast(
        targetStatus === "published"
          ? "SEO Page successfully published to website!"
          : "SEO Page saved as draft successfully.",
        "success"
      );

      router.refresh();
      onClose();
    } catch (err) {
      setErrorMessage("Network error while saving: " + (err?.message || "Failed"));
      setIsSaving(false);
    }
  }

  // ── Transfer to Manual Form Editor ────────────────────────────────
  function handleApplyToManualForm() {
    if (!parsedData) return;
    if (onApplyToForm) {
      onApplyToForm(parsedData);
    }
    onClose();
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            width: "100%",
            maxWidth: processingState === "reviewed" ? 1100 : 720,
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            transition: "max-width 0.3s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "18px 24px",
              background: "#0f172a",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #1e293b",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#0d9488",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UploadCloud size={20} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#ffffff" }}>
                  Import SEO Page Document
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>
                  Upload .docx, .txt, or .doc file to automatically map content to the SEO template
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Container */}
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {/* Error Banner */}
            {errorMessage && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  color: "#991b1b",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Upload or Paste UI (Shown when idle or processing) */}
            {processingState !== "reviewed" && (
              <div>
                {/* Mode Selector */}
                <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setInputMode("upload");
                      setErrorMessage("");
                    }}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: inputMode === "upload" ? "2px solid #0d9488" : "1px solid #e2e8f0",
                      background: inputMode === "upload" ? "#f0fdfa" : "#ffffff",
                      color: inputMode === "upload" ? "#0f766e" : "#475569",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      fontSize: 14,
                    }}
                  >
                    <UploadCloud size={18} />
                    <span>Upload Word / Text File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInputMode("paste");
                      setErrorMessage("");
                    }}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: inputMode === "paste" ? "2px solid #0d9488" : "1px solid #e2e8f0",
                      background: inputMode === "paste" ? "#f0fdfa" : "#ffffff",
                      color: inputMode === "paste" ? "#0f766e" : "#475569",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      fontSize: 14,
                    }}
                  >
                    <FileText size={18} />
                    <span>Paste Raw Text / Template</span>
                  </button>
                </div>

                {inputMode === "upload" ? (
                  <div>
                    {/* Drag and Drop Box */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: "2px dashed #cbd5e1",
                        borderRadius: 12,
                        padding: "40px 20px",
                        textAlign: "center",
                        background: selectedFile ? "#f8fafc" : "#fafafa",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".docx,.txt,.doc"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                        }}
                        style={{ display: "none" }}
                      />

                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background: "#e0f2fe",
                          color: "#0284c7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 16px",
                        }}
                      >
                        <UploadCloud size={28} />
                      </div>

                      {selectedFile ? (
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
                            {selectedFile.name}
                          </div>
                          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                            {(selectedFile.size / 1024).toFixed(1)} KB &bull; Click or drop another file to replace
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: "#1e293b" }}>
                            Drag &amp; drop your SEO document here, or <span style={{ color: "#0d9488", textDecoration: "underline" }}>browse files</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
                            Supported Formats: <strong>.docx</strong> (Word Document), <strong>.txt</strong> (Plain text), <strong>.doc</strong> (Max: 10 MB)
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Downloadable Sample Templates */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        background: "#f1f5f9",
                        borderRadius: 8,
                        marginTop: 18,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "#475569" }}>
                        Need a reference document format?
                      </span>
                      <div style={{ display: "flex", gap: 10 }}>
                        <a
                          href="/templates/sample-seo-page-template.docx"
                          download
                          style={{
                            color: "#0d9488",
                            fontWeight: 600,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Download size={14} />
                          <span>Sample .DOCX</span>
                        </a>
                        <span style={{ color: "#cbd5e1" }}>|</span>
                        <a
                          href="/templates/sample-seo-page-template.txt"
                          download
                          style={{
                            color: "#0d9488",
                            fontWeight: 600,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Download size={14} />
                          <span>Sample .TXT</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      Paste document text or labelled template:
                    </label>
                    <textarea
                      rows={12}
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Paste your SEO document here (e.g. H1:, Meta Title:, ## Overview, FAQs, etc.)..."
                      style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        fontSize: 13,
                        fontFamily: "monospace",
                        lineHeight: 1.5,
                      }}
                    />
                  </div>
                )}

                {/* Progress Indicator */}
                {processingState !== "idle" && (
                  <div
                    style={{
                      marginTop: 20,
                      padding: 16,
                      background: "#f8fafc",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Loader2 size={20} className="animate-spin text-teal-600" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
                        {processingState === "uploading" && "Uploading document to server..."}
                        {processingState === "parsing" && "Extracting text, headings, tables & FAQs..."}
                        {processingState === "validating" && "Mapping template fields & verifying slugs..."}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        Please wait while the automatic mapping engine processes your file.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Review, Correction & Validation Screen */}
            {processingState === "reviewed" && parsedData && (
              <div>
                {/* Extraction Summary Header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                    padding: 16,
                    background: "#f8fafc",
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                      Document Name
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginTop: 2 }}>
                      {extractedMeta?.fileName || "Uploaded File"}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                      Format / Size
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginTop: 2 }}>
                      {extractedMeta?.fileType} &bull;{" "}
                      {extractedMeta?.fileSizeBytes ? (extractedMeta.fileSizeBytes / 1024).toFixed(1) + " KB" : "—"}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                      Mapped Sections
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0d9488", marginTop: 2 }}>
                      {parsedData.sections?.length || 0} Sections Mapped
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                      FAQs Extracted
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0d9488", marginTop: 2 }}>
                      {parsedData.faqs?.length || 0} Q&amp;A Pairs
                    </div>
                  </div>
                </div>

                {/* Slug Conflict Banner (if exists) */}
                {slugConflict && slugConflict.exists && (
                  <div
                    style={{
                      padding: 16,
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: 8,
                      marginBottom: 18,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <AlertTriangle size={20} color="#b45309" style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#92400e" }}>
                          Slug Collision Detected: <code>/services/{slugConflict.existingSlug}</code>
                        </div>
                        <div style={{ fontSize: 13, color: "#78350f", marginTop: 2 }}>
                          This slug is already used by: <strong>&ldquo;{slugConflict.existingTitle}&rdquo;</strong>.
                          Publishing will safely replace this page after confirmation, or you can auto-generate a new slug.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoFixSlug}
                        style={{
                          padding: "6px 12px",
                          background: "#f59e0b",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Auto-Fix Slug
                      </button>
                    </div>
                  </div>
                )}

                {/* Validation Report Banner */}
                {validationReport && (
                  <div style={{ marginBottom: 20 }}>
                    {validationReport.errors.length > 0 ? (
                      <div
                        style={{
                          padding: 14,
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          borderRadius: 8,
                          color: "#991b1b",
                          fontSize: 13,
                        }}
                      >
                        <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                          <AlertCircle size={18} />
                          <span>{validationReport.errors.length} Blocking Error(s) — Fix to Publish:</span>
                        </div>
                        <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
                          {validationReport.errors.map((err, idx) => (
                            <li key={idx} style={{ marginTop: 4 }}>
                              <strong>{err.reason}</strong> &mdash; <em>{err.action}</em>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: "10px 16px",
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: 8,
                          color: "#166534",
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <CheckCircle2 size={18} color="#16a34a" />
                        <span>
                          <strong>All essential template validations passed!</strong> Ready to preview, save as draft, or publish.
                        </span>
                      </div>
                    )}

                    {/* Warnings Accordion */}
                    {validationReport.warnings.length > 0 && (
                      <div
                        style={{
                          marginTop: 8,
                          padding: "8px 14px",
                          background: "#fffbeb",
                          border: "1px solid #fef08a",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "#854d0e",
                        }}
                      >
                        <strong>{validationReport.warnings.length} Recommended Improvement(s):</strong>
                        <ul style={{ margin: "4px 0 0 0", paddingLeft: 18 }}>
                          {validationReport.warnings.map((w, idx) => (
                            <li key={idx}>{w.reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Tabs for Reviewing Extracted Fields */}
                <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: 16 }}>
                  {[
                    { id: "metadata", label: "SEO & Metadata" },
                    { id: "hero", label: "Hero Banner" },
                    { id: "sections", label: `Sections (${parsedData.sections?.length || 0})` },
                    { id: "faqs", label: `FAQs (${parsedData.faqs?.length || 0})` },
                    { id: "unmapped", label: `Unmapped (${unmappedContent.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveReviewTab(tab.id)}
                      style={{
                        padding: "10px 16px",
                        border: "none",
                        background: "transparent",
                        fontWeight: activeReviewTab === tab.id ? 700 : 500,
                        color: activeReviewTab === tab.id ? "#0d9488" : "#64748b",
                        borderBottom: activeReviewTab === tab.id ? "2px solid #0d9488" : "2px solid transparent",
                        marginBottom: -2,
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1: Metadata Fields */}
                {activeReviewTab === "metadata" && (
                  <div style={{ display: "grid", gap: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        Target URL Slug *
                      </label>
                      <input
                        type="text"
                        value={parsedData.slug || ""}
                        onChange={(e) => handleFieldChange("slug", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "1px solid #cbd5e1",
                          fontSize: 13,
                        }}
                      />
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        Public URL: <code>/{parsedData.slug || "your-slug"}</code>
                      </span>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        Meta Title ({parsedData.metaTitle?.length || 0}/60 chars)
                      </label>
                      <input
                        type="text"
                        value={parsedData.metaTitle || ""}
                        onChange={(e) => handleFieldChange("metaTitle", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "1px solid #cbd5e1",
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        Meta Description ({parsedData.metaDescription?.length || 0}/160 chars)
                      </label>
                      <textarea
                        rows={3}
                        value={parsedData.metaDescription || ""}
                        onChange={(e) => handleFieldChange("metaDescription", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "1px solid #cbd5e1",
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        Target Keywords
                      </label>
                      <input
                        type="text"
                        value={parsedData.keywords || ""}
                        onChange={(e) => handleFieldChange("keywords", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "1px solid #cbd5e1",
                          fontSize: 13,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: Hero Section */}
                {activeReviewTab === "hero" && (
                  <div style={{ display: "grid", gap: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        H1 Main Heading *
                      </label>
                      <input
                        type="text"
                        value={parsedData.h1Title || ""}
                        onChange={(e) => handleFieldChange("h1Title", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "1px solid #cbd5e1",
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        Hero Trust Badge
                      </label>
                      <input
                        type="text"
                        value={parsedData.heroBadge || ""}
                        onChange={(e) => handleFieldChange("heroBadge", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "1px solid #cbd5e1",
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        Clinical Intro / Subtitle
                      </label>
                      <textarea
                        rows={3}
                        value={parsedData.heroSubtitle || ""}
                        onChange={(e) => handleFieldChange("heroSubtitle", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "1px solid #cbd5e1",
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                          Helpline Phone
                        </label>
                        <input
                          type="text"
                          value={parsedData.ctaPhone || ""}
                          onChange={(e) => handleFieldChange("ctaPhone", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 6,
                            border: "1px solid #cbd5e1",
                            fontSize: 13,
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={parsedData.ctaPrimaryText || ""}
                          onChange={(e) => handleFieldChange("ctaPrimaryText", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 6,
                            border: "1px solid #cbd5e1",
                            fontSize: 13,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: Content Sections */}
                {activeReviewTab === "sections" && (
                  <div style={{ display: "grid", gap: 14 }}>
                    {parsedData.sections?.map((sec, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: 14,
                          background: "#f8fafc",
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#0d9488" }}>
                            Section {idx + 1} &bull; Type: <code>{sec.type}</code>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newSecs = parsedData.sections.filter((_, sIdx) => sIdx !== idx);
                              handleFieldChange("sections", newSecs);
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              padding: 2,
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={sec.heading}
                          onChange={(e) => {
                            const newSecs = [...parsedData.sections];
                            newSecs[idx].heading = e.target.value;
                            handleFieldChange("sections", newSecs);
                          }}
                          placeholder="Section Heading"
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "1px solid #cbd5e1",
                            fontSize: 13,
                            fontWeight: 600,
                            marginBottom: 8,
                          }}
                        />

                        <textarea
                          rows={3}
                          value={sec.content}
                          onChange={(e) => {
                            const newSecs = [...parsedData.sections];
                            newSecs[idx].content = e.target.value;
                            handleFieldChange("sections", newSecs);
                          }}
                          placeholder="Section paragraphs / text..."
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "1px solid #cbd5e1",
                            fontSize: 12,
                            lineHeight: 1.5,
                          }}
                        />

                        {Array.isArray(sec.items) && sec.items.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                              List / Step Items ({sec.items.length}):
                            </span>
                            <ul style={{ margin: "4px 0 0 0", paddingLeft: 18, fontSize: 12, color: "#334155" }}>
                              {sec.items.map((it, itIdx) => (
                                <li key={itIdx}>{it}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 4: FAQs */}
                {activeReviewTab === "faqs" && (
                  <div style={{ display: "grid", gap: 12 }}>
                    {parsedData.faqs?.map((faq, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: 12,
                          background: "#f8fafc",
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#0d9488" }}>
                            Question #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newFaqs = parsedData.faqs.filter((_, fIdx) => fIdx !== idx);
                              handleFieldChange("faqs", newFaqs);
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const newFaqs = [...parsedData.faqs];
                            newFaqs[idx].question = e.target.value;
                            handleFieldChange("faqs", newFaqs);
                          }}
                          placeholder="FAQ Question"
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "1px solid #cbd5e1",
                            fontSize: 13,
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                        />

                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const newFaqs = [...parsedData.faqs];
                            newFaqs[idx].answer = e.target.value;
                            handleFieldChange("faqs", newFaqs);
                          }}
                          placeholder="FAQ Answer"
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: 6,
                            border: "1px solid #cbd5e1",
                            fontSize: 12,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 5: Unmapped Content */}
                {activeReviewTab === "unmapped" && (
                  <div>
                    {unmappedContent.length === 0 ? (
                      <div
                        style={{
                          padding: 30,
                          textAlign: "center",
                          color: "#16a34a",
                          background: "#f0fdf4",
                          borderRadius: 8,
                        }}
                      >
                        <CheckCircle2 size={32} style={{ margin: "0 auto 8px" }} />
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Zero Unmapped Content</div>
                        <div style={{ fontSize: 12, color: "#15803d", marginTop: 2 }}>
                          Every section and line from the imported document was mapped to a template field!
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gap: 12 }}>
                        {unmappedContent.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: 12,
                              background: "#fffbeb",
                              border: "1px solid #fef08a",
                              borderRadius: 8,
                            }}
                          >
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e" }}>
                              {item.label || "Unmapped Text Block"}
                            </div>
                            <div style={{ fontSize: 12, color: "#78350f", margin: "4px 0" }}>
                              <em>Reason: {item.reason}</em>
                            </div>
                            <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "#334155" }}>
                              {item.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Toolbar */}
          <div
            style={{
              padding: "16px 24px",
              background: "#f8fafc",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {processingState === "reviewed" ? (
              <>
                <button
                  type="button"
                  onClick={() => setProcessingState("idle")}
                  style={{
                    padding: "8px 14px",
                    background: "#e2e8f0",
                    color: "#334155",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  &larr; Re-Upload File
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Live Template Preview */}
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    style={{
                      padding: "8px 14px",
                      background: "#0284c7",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Eye size={15} />
                    <span>Preview Template</span>
                  </button>

                  {/* Save as Draft */}
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleCommit("draft")}
                    style={{
                      padding: "8px 14px",
                      background: "#334155",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: isSaving ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Save size={15} />
                    <span>Save Draft</span>
                  </button>

                  {/* Publish Page */}
                  <button
                    type="button"
                    disabled={isSaving || (validationReport && !validationReport.isValid)}
                    onClick={() => handleCommit("published")}
                    style={{
                      padding: "8px 18px",
                      background: validationReport && !validationReport.isValid ? "#94a3b8" : "#0d9488",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor:
                        isSaving || (validationReport && !validationReport.isValid)
                          ? "not-allowed"
                          : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      boxShadow: "0 2px 4px rgba(13, 148, 136, 0.3)",
                    }}
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                    <span>Publish Page</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "8px 14px",
                    background: "#e2e8f0",
                    color: "#334155",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    (inputMode === "upload" && !selectedFile) ||
                    (inputMode === "paste" && !pastedText.trim()) ||
                    processingState !== "idle"
                  }
                  onClick={inputMode === "upload" ? handleProcessUpload : handleProcessPastedText}
                  style={{
                    padding: "9px 20px",
                    background:
                      (inputMode === "upload" && !selectedFile) ||
                      (inputMode === "paste" && !pastedText.trim())
                        ? "#94a3b8"
                        : "#0d9488",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor:
                      (inputMode === "upload" && !selectedFile) ||
                      (inputMode === "paste" && !pastedText.trim())
                        ? "not-allowed"
                        : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Sparkles size={16} />
                  <span>Extract &amp; Map Document</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Live Template Preview Modal */}
      {previewOpen && (
        <SeoPagePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          pageData={parsedData}
          doctorsList={doctorsList}
          allPages={allPages}
        />
      )}
    </>
  );
}
