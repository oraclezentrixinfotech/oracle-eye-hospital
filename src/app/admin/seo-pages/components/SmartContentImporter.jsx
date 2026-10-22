"use client";

import { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  X,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Layers,
  HelpCircle,
  UserCheck,
  Wand2,
  ChevronDown,
  ChevronRight,
  Bot,
  Zap,
  ArrowLeft,
  RefreshCw,
  Link2,
} from "lucide-react";
import { parseBasicText } from "./parseEngine";

export const FORMAT_A_TEMPLATE = `URL: cataract-surgery-in-moradabad
META TITLE: Cataract Surgery in Moradabad | Oracle Eye Hospital
META DESCRIPTION: Advanced cataract surgery in Moradabad with stitchless phacoemulsification and premium IOLs. Book consultation today!
KEYWORDS: cataract surgery moradabad, phaco surgery, eye hospital
BADGE: NABH-Aligned Centre • 25,000+ Surgeries
H1: Cataract Surgery in Moradabad
SUBTITLE: Restore crystal-clear vision with micro-incision phacoemulsification at Oracle Eye Hospital.
CHIPS: Procedure Duration | 15-Min Walk-In ; Surgical Technique | Stitchless & Painless ; Payment & TPA | Cashless Insurance
## Overview
If you are noticing blurred vision, safe micro-incision cataract surgery can restore clear vision.
- NABH-Accredited modern super-specialty eye center
- 25,000+ surgeries successfully performed
### Step 1: Diagnostic Evaluation
Detailed optical biometry and corneal scans measure your eye with micron accuracy.
### Step 2: Micro-Incision Phacoemulsification
Ultrasound energy gently removes the clouded lens through a 2mm incision.
> Why Choose Oracle Eye Hospital: State of the art tech and zero stitches.
FAQ
Q: What is the recovery time?
A: Most patients resume light routine activities within 24 to 48 hours.
Q: Is cataract surgery painful?
A: No, topical eye drops ensure complete comfort with no needle injections.
DOCTORS: Dr. Girjesh Kain, Dr. Rachana
RELATED: lasik-eye-surgery-in-moradabad, retina-specialist-in-moradabad`;

export default function SmartContentImporter({
  isOpen,
  onClose,
  onApply,
  doctorsList = [],
  allPages = [],
}) {
  const [inputText, setInputText] = useState("");
  const [parseMode, setParseMode] = useState("ai"); // "ai" | "basic"
  const [isParsing, setIsParsing] = useState(false);
  const [parseNotice, setParseNotice] = useState(null); // notice if AI fell back
  const [parsedData, setParsedData] = useState(null);
  const [viewStep, setViewStep] = useState("input"); // "input" | "preview"
  const [previewTab, setPreviewTab] = useState("sections"); // "seo" | "hero" | "sections" | "doctors" | "faqs"

  // Collapsible help state
  const [showHelp, setShowHelp] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  function handleReset() {
    setInputText("");
    setParsedData(null);
    setParseNotice(null);
    setViewStep("input");
  }

  function handleLoadTemplate() {
    setInputText(FORMAT_A_TEMPLATE);
  }

  function handleCopyTemplate() {
    navigator.clipboard.writeText(FORMAT_A_TEMPLATE);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  }

  async function handleStartParse() {
    if (!inputText.trim()) return;
    setIsParsing(true);
    setParseNotice(null);

    // AI-Assisted Mode
    if (parseMode === "ai") {
      try {
        const res = await fetch("/api/admin/seo-pages/parse-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputText }),
        });

        const json = await res.json().catch(() => ({}));

        if (res.ok && json.success && json.data) {
          // AI succeeded, format via sanitization engine
          const structured = parseBasicText(JSON.stringify(json.data), doctorsList, allPages);
          setParsedData(structured);
          setViewStep("preview");
          setIsParsing(false);
          return;
        } else {
          // Fallback to basic parse
          console.warn("AI parse failed or unavailable, falling back to basic:", json.error);
          setParseNotice(
            json.error?.includes("ANTHROPIC_API_KEY")
              ? "Notice: ANTHROPIC_API_KEY not configured. Used Basic (offline) parser."
              : `Notice: AI parse unavailable (${json.error || "error"}). Used Basic (offline) parser.`
          );
        }
      } catch (err) {
        console.warn("AI parse network error, falling back to basic:", err);
        setParseNotice("Notice: Network error with AI endpoint. Used Basic (offline) parser.");
      }
    }

    // Basic (Rule-based) Mode or Fallback
    try {
      const basicResult = parseBasicText(inputText, doctorsList, allPages);
      setParsedData(basicResult);
      setViewStep("preview");
    } catch (err) {
      alert("Failed to parse content: " + (err?.message || err));
    } finally {
      setIsParsing(false);
    }
  }

  // Compute Validation Warnings for Preview
  const warnings = [];
  if (parsedData) {
    if (!parsedData.metaDescription) {
      warnings.push("Missing Meta Description. Search engines will generate a fallback snippet.");
    } else if (parsedData.metaDescription.length > 160) {
      warnings.push(
        `Meta Description exceeds 160 characters (${parsedData.metaDescription.length}/160). Recommended 140–160.`
      );
    }
    if (parsedData.metaTitle && parsedData.metaTitle.length > 60) {
      warnings.push(
        `Meta Title exceeds 60 characters (${parsedData.metaTitle.length}/60). May be truncated in Google search results.`
      );
    }
    if (!parsedData.faqs || parsedData.faqs.length === 0) {
      warnings.push("No FAQs detected. Adding FAQs enables Google FAQ rich snippets.");
    }
    if (Array.isArray(parsedData.unmatchedDoctors) && parsedData.unmatchedDoctors.length > 0) {
      warnings.push(
        `Unmatched doctor name(s): "${parsedData.unmatchedDoctors.join(", ")}" not in current doctors list.`
      );
    }
    if (Array.isArray(parsedData.unmatchedRelated) && parsedData.unmatchedRelated.length > 0) {
      warnings.push(
        `Unmatched related service(s): "${parsedData.unmatchedRelated.join(", ")}" not found in existing pages.`
      );
    }
  }

  function handleApplyAction(mode) {
    if (!parsedData) return;
    onApply(parsedData, mode);
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(10, 25, 30, 0.75)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isParsing) onClose();
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
          width: "100%",
          maxWidth: 980,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #cbd5e1",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #07242c 0%, #0d3b45 100%)",
            color: "#ffffff",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg, #e8a33d 0%, #c98618 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(232, 163, 61, 0.35)",
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fff" }}>
                Import Content &amp; Auto-Fill SEO Page
              </h3>
              <p style={{ margin: "2px 0 0 0", fontSize: 12.5, color: "rgba(255, 255, 255, 0.8)" }}>
                {viewStep === "input"
                  ? "Paste your content in any format. Normalizes text, matches doctors & maps all 6 tabs."
                  : "Review structured preview before applying to the form."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isParsing}
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              border: "none",
              color: "#fff",
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isParsing ? "not-allowed" : "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Notice Banner (if fallback occurred) */}
        {parseNotice && (
          <div
            style={{
              background: "#fffbeb",
              color: "#92400e",
              padding: "8px 24px",
              fontSize: 12.5,
              borderBottom: "1px solid #fde68a",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <AlertTriangle size={15} color="#d97706" />
            <span>{parseNotice}</span>
          </div>
        )}

        {/* STEP 1: INPUT VIEW */}
        {viewStep === "input" && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            {/* Top Toolbar */}
            <div
              style={{
                background: "#f8fafc",
                padding: "10px 24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Parse Mode Toggle */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#e2e8f0",
                  padding: 3,
                  borderRadius: 8,
                  gap: 3,
                }}
              >
                <button
                  type="button"
                  onClick={() => setParseMode("ai")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background: parseMode === "ai" ? "#0d9488" : "transparent",
                    color: parseMode === "ai" ? "#ffffff" : "#475569",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    transition: "all 0.15s ease",
                  }}
                >
                  <Bot size={14} />
                  <span>Smart parse with AI (Recommended)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setParseMode("basic")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background: parseMode === "basic" ? "#0d9488" : "transparent",
                    color: parseMode === "basic" ? "#ffffff" : "#475569",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    transition: "all 0.15s ease",
                  }}
                >
                  <Zap size={14} />
                  <span>Basic parse (Offline rule-based)</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  type="button"
                  onClick={handleLoadTemplate}
                  style={{
                    background: "#ffffff",
                    color: "#0f766e",
                    border: "1px solid #99f6e4",
                    padding: "5px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Wand2 size={13} />
                  <span>Load Template Sample</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  style={{
                    background: "#ffffff",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                    padding: "5px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {showHelp ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>Supported Formats Help</span>
                </button>

                {inputText && (
                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      background: "transparent",
                      color: "#dc2626",
                      border: "none",
                      fontSize: 12,
                      cursor: "pointer",
                      textDecoration: "underline",
                      marginLeft: 4,
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Collapsible Supported Formats Help */}
            {showHelp && (
              <div
                style={{
                  background: "#f0fdfa",
                  padding: "14px 24px",
                  borderBottom: "1px solid #ccfbf1",
                  fontSize: 12.5,
                  color: "#134e4a",
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <strong>Supported Formats:</strong>
                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    style={{
                      background: "#0d9488",
                      color: "#fff",
                      border: "none",
                      padding: "3px 8px",
                      borderRadius: 4,
                      fontSize: 11,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {copiedTemplate ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedTemplate ? "Copied!" : "Copy Format A Template"}</span>
                  </button>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                  <li>
                    <strong>Format A (Labelled Template):</strong> Keys like <code>URL:</code>, <code>META TITLE:</code>, <code>H1:</code>, <code>CHIPS:</code>, <code>## Section</code>, <code>FAQ</code>, <code>DOCTORS:</code>, <code>RELATED:</code>
                  </li>
                  <li>
                    <strong>Format B (Plain Markdown / Word):</strong> First line = H1, title lines = sections, bullet points = checklist items, <code>Step N:</code> = numbered steps, <code>Q: / ?</code> = FAQs.
                  </li>
                  <li>
                    <strong>Format C (Messy Pasted Text):</strong> Smart quotes, bold markers <code>**</code>, and excessive blank lines are automatically cleaned and normalized.
                  </li>
                </ul>
              </div>
            )}

            {/* Main Textarea */}
            <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#334155",
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FileText size={16} color="#0d9488" />
                <span>Paste Your Page Content Here:</span>
              </label>
              <textarea
                rows={16}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your page content or click 'Load Template Sample' above..."
                style={{
                  width: "100%",
                  flex: 1,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: 12.5,
                  lineHeight: 1.6,
                  padding: 14,
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  background: "#fcfdfe",
                  color: "#0f172a",
                  resize: "none",
                }}
              />
            </div>

            {/* Input Footer */}
            <div
              style={{
                background: "#ffffff",
                padding: "14px 24px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 12.5, color: "#64748b" }}>
                Mode: <strong>{parseMode === "ai" ? "Smart AI (Claude Sonnet 4.6)" : "Basic Rule-Based (Offline)"}</strong>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    padding: "8px 16px",
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
                  onClick={handleStartParse}
                  disabled={!inputText.trim() || isParsing}
                  style={{
                    background: inputText.trim() && !isParsing
                      ? "linear-gradient(135deg, #0d9488 0%, #137c8b 100%)"
                      : "#cbd5e1",
                    color: "#ffffff",
                    border: "none",
                    padding: "9px 20px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: inputText.trim() && !isParsing ? "pointer" : "not-allowed",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: inputText.trim() && !isParsing ? "0 4px 12px rgba(13, 148, 136, 0.3)" : "none",
                  }}
                >
                  {isParsing ? (
                    <>
                      <RefreshCw size={15} className="adt-spin" />
                      <span>Parsing Content…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>Parse &amp; Preview Structure →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW VIEW */}
        {viewStep === "preview" && parsedData && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            {/* Summary Metrics Bar */}
            <div
              style={{
                background: "#f8fafc",
                padding: "12px 24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "3px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                  Sections: {parsedData.sections.length}
                </span>
                <span style={{ background: "#fef3c7", color: "#b45309", padding: "3px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                  FAQs: {parsedData.faqs.length}
                </span>
                <span style={{ background: "#dcfce7", color: "#15803d", padding: "3px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                  Chips: {parsedData.heroChips.length}
                </span>
                <span style={{ background: "#f3e8ff", color: "#7e22ce", padding: "3px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                  Doctors: {parsedData.doctorIds.length}
                </span>
                <span style={{ background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                  Related: {parsedData.relatedIds.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setViewStep("input")}
                style={{
                  background: "transparent",
                  color: "#0d9488",
                  border: "none",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <ArrowLeft size={14} /> Back to Edit Text
              </button>
            </div>

            {/* Validation Warnings (if any) */}
            {warnings.length > 0 && (
              <div
                style={{
                  background: "#fffbeb",
                  borderBottom: "1px solid #fde68a",
                  padding: "10px 24px",
                  maxHeight: 120,
                  overflowY: "auto",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 12, color: "#92400e", marginBottom: 4 }}>
                  <AlertTriangle size={14} /> Warnings:
                </div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#b45309", lineHeight: 1.5 }}>
                  {warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview Navigation Tabs */}
            <div
              style={{
                display: "flex",
                gap: 4,
                padding: "8px 24px",
                borderBottom: "1px solid #e2e8f0",
                background: "#ffffff",
                overflowX: "auto",
              }}
            >
              {[
                { id: "sections", label: `Sections (${parsedData.sections.length})`, icon: Layers },
                { id: "faqs", label: `FAQs (${parsedData.faqs.length})`, icon: HelpCircle },
                { id: "seo", label: "SEO & Metadata", icon: Sparkles },
                { id: "hero", label: "Hero Banner & Chips", icon: FileText },
                { id: "doctors", label: `Specialists (${parsedData.doctorIds.length})`, icon: UserCheck },
                { id: "related", label: `Related Pages (${parsedData.relatedIds.length})`, icon: Link2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = previewTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPreviewTab(tab.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      background: active ? "#0d9488" : "transparent",
                      color: active ? "#fff" : "#475569",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Preview Tab Content Area */}
            <div style={{ padding: 20, flex: 1, overflowY: "auto", background: "#fcfdfe" }}>
              {/* TAB: SECTIONS */}
              {previewTab === "sections" && (
                <div style={{ display: "grid", gap: 12 }}>
                  {parsedData.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: 14,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                          #{idx + 1} {sec.heading}
                        </h4>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 4,
                            textTransform: "uppercase",
                            background:
                              sec.type === "highlight"
                                ? "#e0f2fe"
                                : sec.type === "numbered"
                                ? "#fef3c7"
                                : sec.type === "checklist"
                                ? "#dcfce7"
                                : "#f1f5f9",
                            color:
                              sec.type === "highlight"
                                ? "#0369a1"
                                : sec.type === "numbered"
                                ? "#b45309"
                                : sec.type === "checklist"
                                ? "#15803d"
                                : "#475569",
                          }}
                        >
                          {sec.type}
                        </span>
                      </div>
                      {sec.content && (
                        <p style={{ margin: "0 0 8px 0", fontSize: 12.5, color: "#334155", lineHeight: 1.5 }}>
                          {sec.content.slice(0, 220)}
                          {sec.content.length > 220 ? "…" : ""}
                        </p>
                      )}
                      {sec.items && sec.items.length > 0 && (
                        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#64748b" }}>
                          {sec.items.slice(0, 4).map((it, iIdx) => (
                            <li key={iIdx}>{it}</li>
                          ))}
                          {sec.items.length > 4 && <li>…+{sec.items.length - 4} more items</li>}
                        </ul>
                      )}
                    </div>
                  ))}
                  {parsedData.sections.length === 0 && (
                    <div style={{ textAlign: "center", padding: 30, color: "#94a3b8" }}>
                      No content sections were detected.
                    </div>
                  )}
                </div>
              )}

              {/* TAB: FAQS */}
              {previewTab === "faqs" && (
                <div style={{ display: "grid", gap: 10 }}>
                  {parsedData.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: 12,
                      }}
                    >
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 13, marginBottom: 4 }}>
                        Q{idx + 1}: {faq.question}
                      </div>
                      <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.5 }}>
                        {faq.answer}
                      </div>
                    </div>
                  ))}
                  {parsedData.faqs.length === 0 && (
                    <div style={{ textAlign: "center", padding: 30, color: "#94a3b8" }}>
                      No FAQs detected.
                    </div>
                  )}
                </div>
              )}

              {/* TAB: SEO & METADATA */}
              {previewTab === "seo" && (
                <div style={{ display: "grid", gap: 12, fontSize: 13 }}>
                  <div style={{ background: "#ffffff", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ color: "#64748b", fontWeight: 600, fontSize: 11 }}>H1 TITLE</div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{parsedData.h1Title}</div>
                  </div>
                  <div style={{ background: "#ffffff", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ color: "#64748b", fontWeight: 600, fontSize: 11 }}>URL SLUG</div>
                    <code>/services/{parsedData.slug}</code>
                  </div>
                  <div style={{ background: "#ffffff", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ color: "#64748b", fontWeight: 600, fontSize: 11 }}>
                      META TITLE ({parsedData.metaTitle.length}/60 chars)
                    </div>
                    <div style={{ color: "#0f172a" }}>{parsedData.metaTitle}</div>
                  </div>
                  <div style={{ background: "#ffffff", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ color: "#64748b", fontWeight: 600, fontSize: 11 }}>
                      META DESCRIPTION ({parsedData.metaDescription.length}/160 chars)
                    </div>
                    <div style={{ color: "#0f172a" }}>{parsedData.metaDescription}</div>
                  </div>
                  <div style={{ background: "#ffffff", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ color: "#64748b", fontWeight: 600, fontSize: 11 }}>KEYWORDS</div>
                    <div style={{ color: "#0f172a" }}>{parsedData.keywords}</div>
                  </div>
                </div>
              )}

              {/* TAB: HERO BANNER & CHIPS */}
              {previewTab === "hero" && (
                <div style={{ display: "grid", gap: 12, fontSize: 13 }}>
                  <div style={{ background: "#ffffff", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ color: "#64748b", fontWeight: 600, fontSize: 11 }}>HERO BADGE PILL</div>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{parsedData.heroBadge}</div>
                  </div>
                  <div style={{ background: "#ffffff", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ color: "#64748b", fontWeight: 600, fontSize: 11 }}>HERO SUBTITLE</div>
                    <div style={{ color: "#0f172a" }}>{parsedData.heroSubtitle}</div>
                  </div>
                  <div style={{ background: "#ffffff", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ color: "#64748b", fontWeight: 600, fontSize: 11, marginBottom: 6 }}>
                      HERO STAT CHIPS ({parsedData.heroChips.length})
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {parsedData.heroChips.map((c, i) => (
                        <span key={i} style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: 4, fontSize: 12 }}>
                          <strong>{c.label}:</strong> {c.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SPECIALISTS */}
              {previewTab === "doctors" && (
                <div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>
                    Doctors matched from text to hospital database ({parsedData.doctorIds.length} selected):
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {doctorsList
                      .filter((d) => parsedData.doctorIds.includes(d.id))
                      .map((doc) => (
                        <div
                          key={doc.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: 10,
                            borderRadius: 8,
                            background: "#f0fdfa",
                            border: "1px solid #99f6e4",
                          }}
                        >
                          <img
                            src={doc.image || "/Assets/img/team/1.png"}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/Assets/img/team/1.png";
                            }}
                            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#0f766e" }}>{doc.name}</div>
                            <div style={{ fontSize: 11, color: "#64748b" }}>{doc.role}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB: RELATED PAGES */}
              {previewTab === "related" && (
                <div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>
                    Related service pages matched ({parsedData.relatedIds.length} linked):
                  </div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {allPages
                      .filter((p) => parsedData.relatedIds.includes(p.id))
                      .map((p) => (
                        <div
                          key={p.id}
                          style={{
                            padding: 10,
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: 6,
                            fontSize: 13,
                          }}
                        >
                          <strong>{p.h1Title}</strong> — <code>/services/{p.slug}</code>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview Footer Actions */}
            <div
              style={{
                background: "#ffffff",
                padding: "14px 24px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setViewStep("input")}
                style={{
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <ArrowLeft size={14} />
                <span>Back to Edit Text</span>
              </button>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => handleApplyAction("merge")}
                  style={{
                    background: "#0f766e",
                    color: "#ffffff",
                    border: "none",
                    padding: "9px 18px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  title="Fills empty fields without overwriting what you already typed"
                >
                  <CheckCircle2 size={16} />
                  <span>Apply to Form (Merge)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyAction("replace")}
                  style={{
                    background: "linear-gradient(135deg, #0d9488 0%, #137c8b 100%)",
                    color: "#ffffff",
                    border: "none",
                    padding: "9px 20px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)",
                  }}
                  title="Overwrites all tabs with the newly parsed content"
                >
                  <Sparkles size={16} />
                  <span>Replace Everything</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
