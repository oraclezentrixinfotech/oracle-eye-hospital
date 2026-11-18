"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading,
  List,
  ListOrdered,
  Quote,
  Code,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RemoveFormatting,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  ChevronLeft,
  ChevronRight,
  X,
  Rows,
  Grid,
  Sparkles,
} from "lucide-react";

export default function FloatingVerticalToolbar({
  activeEditor = null,
  onToggleExternalBullets,
  onToggleExternalNumbered,
  visible = true,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [headingFlyoutOpen, setHeadingFlyoutOpen] = useState(false);
  const [bulletFlyoutOpen, setBulletFlyoutOpen] = useState(false);
  const [orderedFlyoutOpen, setOrderedFlyoutOpen] = useState(false);
  const [alignFlyoutOpen, setAlignFlyoutOpen] = useState(false);

  // Modals for Link, Image, Table
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://www.oracleeyehospital.com/");
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(true);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableWithHeader, setTableWithHeader] = useState(true);

  // Close flyouts when clicking outside
  const toolbarRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setHeadingFlyoutOpen(false);
        setBulletFlyoutOpen(false);
        setOrderedFlyoutOpen(false);
        setAlignFlyoutOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!visible) return null;

  // Prevent button mousedown from blurring the active editor so text selection stays intact
  function preventBlur(e) {
    e.preventDefault();
  }

  // Active check helper
  const isBold = activeEditor?.isActive("bold");
  const isItalic = activeEditor?.isActive("italic");
  const isUnderline = activeEditor?.isActive("underline");
  const isStrike = activeEditor?.isActive("strike");
  const isBulletList = activeEditor?.isActive("bulletList");
  const isOrderedList = activeEditor?.isActive("orderedList");
  const isBlockquote = activeEditor?.isActive("blockquote");
  const isCodeBlock = activeEditor?.isActive("codeBlock");
  const isTable = activeEditor?.isActive("table");

  let activeHeadingLevel = null;
  for (const lvl of [2, 3, 4, 5, 6]) {
    if (activeEditor?.isActive("heading", { level: lvl })) {
      activeHeadingLevel = lvl;
      break;
    }
  }

  // Action Handlers
  function handleLinkSubmit(e) {
    if (e) e.preventDefault();
    if (!activeEditor) return;
    const trimmed = (linkUrl || "").trim();
    if (!trimmed || /^(javascript|data|vbscript):/i.test(trimmed)) {
      activeEditor.chain().focus().unsetLink().run();
      setLinkModalOpen(false);
      return;
    }
    const attrs = {
      href: trimmed,
      rel: "noopener noreferrer",
      ...(linkOpenNewTab ? { target: "_blank" } : { target: "_self" }),
    };
    activeEditor.chain().focus().extendMarkRange("link").setLink(attrs).run();
    setLinkModalOpen(false);
  }

  function handleImageSubmit(e) {
    if (e) e.preventDefault();
    if (!activeEditor) return;
    const trimmed = (imageUrl || "").trim();
    if (!trimmed || /^(javascript|data|vbscript):/i.test(trimmed)) {
      setImageModalOpen(false);
      return;
    }
    activeEditor
      .chain()
      .focus()
      .setImage({
        src: trimmed,
        alt: (imageAlt || "").trim(),
        align: "center",
        class: "content-img",
      })
      .run();
    setImageModalOpen(false);
  }

  function handleTableSubmit(e) {
    if (e) e.preventDefault();
    if (!activeEditor) return;
    const r = Math.max(1, Math.min(20, parseInt(tableRows, 10) || 3));
    const c = Math.max(1, Math.min(10, parseInt(tableCols, 10) || 3));
    activeEditor
      .chain()
      .focus()
      .insertTable({ rows: r, cols: c, withHeaderRow: Boolean(tableWithHeader) })
      .run();
    setTableModalOpen(false);
  }

  const btnStyle = (active = false) => ({
    width: 32,
    height: 32,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: active ? "#0d9488" : "transparent",
    color: active ? "#ffffff" : "#334155",
    cursor: "pointer",
    transition: "all 0.15s ease",
    padding: 0,
    outline: "none",
  });

  const dividerStyle = {
    width: 24,
    height: 1,
    background: "#e2e8f0",
    margin: "3px 0",
  };

  const flyoutStyle = {
    position: "absolute",
    right: "100%",
    top: 0,
    marginRight: 8,
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1)",
    zIndex: 1100,
    padding: 6,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 190,
  };

  const flyoutItemStyle = (active = false) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 5,
    border: "none",
    background: active ? "#f0fdfa" : "transparent",
    color: active ? "#0f766e" : "#1e293b",
    fontSize: 12.5,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    transition: "all 0.12s ease",
  });

  return (
    <>
      {/* Pinned Vertical Floating Tool Palette */}
      <aside
        ref={toolbarRef}
        aria-label="Rich Text Formatting Toolbar"
        style={{
          position: "fixed",
          right: collapsed ? 0 : 16,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1050,
          background: "#ffffff",
          border: "1px solid #cbd5e1",
          borderRadius: collapsed ? "8px 0 0 8px" : 12,
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.16), 0 4px 12px rgba(0,0,0,0.06)",
          padding: collapsed ? "8px 4px" : "8px 5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          maxHeight: "88vh",
          overflowY: "visible",
          transition: "right 0.2s ease, border-radius 0.2s ease",
          userSelect: "none",
        }}
      >
        {/* Collapse / Expand Toggle Button */}
        <button
          type="button"
          onMouseDown={preventBlur}
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Formatting Tools" : "Minimize Toolbar"}
          style={{
            width: 28,
            height: 24,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            background: "#f1f5f9",
            color: "#64748b",
            cursor: "pointer",
            marginBottom: collapsed ? 0 : 4,
          }}
        >
          {collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {collapsed ? (
          /* Collapsed Pill Indicator */
          <div
            onClick={() => setCollapsed(false)}
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontSize: 11,
              fontWeight: 700,
              color: "#0d9488",
              cursor: "pointer",
              padding: "8px 2px",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Sparkles size={12} />
            <span>TOOLS</span>
          </div>
        ) : (
          /* Full Vertical Toolbar */
          <>
            {/* Header Badge */}
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: "#0d9488",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 2,
              }}
              title="Formatting Tools for Selected Text"
            >
              EDIT
            </div>

            {/* 1. Basic Inline Formatting */}
            <button
              type="button"
              title="Bold (Ctrl+B)"
              onMouseDown={preventBlur}
              onClick={() => activeEditor?.chain().focus().toggleBold().run()}
              style={btnStyle(isBold)}
              className="vertical-tb-btn"
            >
              <Bold size={15} />
            </button>

            <button
              type="button"
              title="Italic (Ctrl+I)"
              onMouseDown={preventBlur}
              onClick={() => activeEditor?.chain().focus().toggleItalic().run()}
              style={btnStyle(isItalic)}
              className="vertical-tb-btn"
            >
              <Italic size={15} />
            </button>

            <button
              type="button"
              title="Underline (Ctrl+U)"
              onMouseDown={preventBlur}
              onClick={() => activeEditor?.chain().focus().toggleUnderline().run()}
              style={btnStyle(isUnderline)}
              className="vertical-tb-btn"
            >
              <UnderlineIcon size={15} />
            </button>

            <button
              type="button"
              title="Strikethrough"
              onMouseDown={preventBlur}
              onClick={() => activeEditor?.chain().focus().toggleStrike().run()}
              style={btnStyle(isStrike)}
              className="vertical-tb-btn"
            >
              <Strikethrough size={15} />
            </button>

            <div style={dividerStyle} />

            {/* 2. Headings Flyout */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                title="Headings (H2, H3, H4, Paragraph)"
                onMouseDown={preventBlur}
                onClick={() => {
                  setHeadingFlyoutOpen(!headingFlyoutOpen);
                  setBulletFlyoutOpen(false);
                  setOrderedFlyoutOpen(false);
                  setAlignFlyoutOpen(false);
                }}
                style={btnStyle(Boolean(activeHeadingLevel) || headingFlyoutOpen)}
                className="vertical-tb-btn"
              >
                <Heading size={15} />
              </button>

              {headingFlyoutOpen && (
                <div style={flyoutStyle}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", padding: "2px 8px" }}>
                    Select Heading
                  </div>
                  <button
                    type="button"
                    onMouseDown={preventBlur}
                    onClick={() => {
                      activeEditor?.chain().focus().setParagraph().run();
                      setHeadingFlyoutOpen(false);
                    }}
                    style={flyoutItemStyle(!activeHeadingLevel && activeEditor?.isActive("paragraph"))}
                  >
                    Normal Text (Paragraph)
                  </button>
                  {[2, 3, 4, 5, 6].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onMouseDown={preventBlur}
                      onClick={() => {
                        activeEditor?.chain().focus().toggleHeading({ level: lvl }).run();
                        setHeadingFlyoutOpen(false);
                      }}
                      style={flyoutItemStyle(activeEditor?.isActive("heading", { level: lvl }))}
                    >
                      Heading {lvl} (H{lvl})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Bullet List Flyout */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                title="Bullet Points (Internal or External Highlight)"
                onMouseDown={preventBlur}
                onClick={() => {
                  setBulletFlyoutOpen(!bulletFlyoutOpen);
                  setHeadingFlyoutOpen(false);
                  setOrderedFlyoutOpen(false);
                  setAlignFlyoutOpen(false);
                }}
                style={btnStyle(isBulletList || bulletFlyoutOpen)}
                className="vertical-tb-btn"
              >
                <List size={15} />
              </button>

              {bulletFlyoutOpen && (
                <div style={flyoutStyle}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", padding: "2px 8px" }}>
                    Bullet List Option
                  </div>
                  <button
                    type="button"
                    onMouseDown={preventBlur}
                    onClick={() => {
                      activeEditor?.chain().focus().toggleBulletList().run();
                      setBulletFlyoutOpen(false);
                    }}
                    style={flyoutItemStyle(isBulletList)}
                  >
                    <List size={14} color="#0d9488" />
                    <div>
                      <div>Internal (Inside Content)</div>
                      <div style={{ fontSize: 10, color: "#64748b", fontWeight: 400 }}>Bullet points inside paragraph</div>
                    </div>
                  </button>
                  {onToggleExternalBullets && (
                    <button
                      type="button"
                      onMouseDown={preventBlur}
                      onClick={() => {
                        onToggleExternalBullets();
                        setBulletFlyoutOpen(false);
                      }}
                      style={flyoutItemStyle(false)}
                    >
                      <Grid size={14} color="#e8a33d" />
                      <div>
                        <div>External (Highlight Box)</div>
                        <div style={{ fontSize: 10, color: "#64748b", fontWeight: 400 }}>Dedicated callout box below section</div>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 4. Numbered List Flyout */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                title="Numbered List (Internal or External Steps)"
                onMouseDown={preventBlur}
                onClick={() => {
                  setOrderedFlyoutOpen(!orderedFlyoutOpen);
                  setHeadingFlyoutOpen(false);
                  setBulletFlyoutOpen(false);
                  setAlignFlyoutOpen(false);
                }}
                style={btnStyle(isOrderedList || orderedFlyoutOpen)}
                className="vertical-tb-btn"
              >
                <ListOrdered size={15} />
              </button>

              {orderedFlyoutOpen && (
                <div style={flyoutStyle}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", padding: "2px 8px" }}>
                    Numbered List Option
                  </div>
                  <button
                    type="button"
                    onMouseDown={preventBlur}
                    onClick={() => {
                      activeEditor?.chain().focus().toggleOrderedList().run();
                      setOrderedFlyoutOpen(false);
                    }}
                    style={flyoutItemStyle(isOrderedList)}
                  >
                    <ListOrdered size={14} color="#0d9488" />
                    <div>
                      <div>Internal (Inside Content)</div>
                      <div style={{ fontSize: 10, color: "#64748b", fontWeight: 400 }}>1, 2, 3 list inside paragraph</div>
                    </div>
                  </button>
                  {onToggleExternalNumbered && (
                    <button
                      type="button"
                      onMouseDown={preventBlur}
                      onClick={() => {
                        onToggleExternalNumbered();
                        setOrderedFlyoutOpen(false);
                      }}
                      style={flyoutItemStyle(false)}
                    >
                      <Rows size={14} color="#e8a33d" />
                      <div>
                        <div>External (Numbered Steps)</div>
                        <div style={{ fontSize: 10, color: "#64748b", fontWeight: 400 }}>Step cards below section</div>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 5. Blockquote */}
            <button
              type="button"
              title="Blockquote"
              onMouseDown={preventBlur}
              onClick={() => activeEditor?.chain().focus().toggleBlockquote().run()}
              style={btnStyle(isBlockquote)}
              className="vertical-tb-btn"
            >
              <Quote size={15} />
            </button>

            {/* 6. Code Block */}
            <button
              type="button"
              title="Code Block"
              onMouseDown={preventBlur}
              onClick={() => activeEditor?.chain().focus().toggleCodeBlock().run()}
              style={btnStyle(isCodeBlock)}
              className="vertical-tb-btn"
            >
              <Code size={15} />
            </button>

            {/* 7. Dynamic Table */}
            <button
              type="button"
              title="Insert Dynamic Table"
              onMouseDown={preventBlur}
              onClick={() => setTableModalOpen(true)}
              style={btnStyle(isTable)}
              className="vertical-tb-btn"
            >
              <TableIcon size={15} />
            </button>

            <div style={dividerStyle} />

            {/* 8. Text Alignment Flyout */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                title="Align Text (Left, Center, Right)"
                onMouseDown={preventBlur}
                onClick={() => {
                  setAlignFlyoutOpen(!alignFlyoutOpen);
                  setHeadingFlyoutOpen(false);
                  setBulletFlyoutOpen(false);
                  setOrderedFlyoutOpen(false);
                }}
                style={btnStyle(alignFlyoutOpen)}
                className="vertical-tb-btn"
              >
                <AlignLeft size={15} />
              </button>

              {alignFlyoutOpen && (
                <div style={{ ...flyoutStyle, minWidth: 140 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", padding: "2px 8px" }}>
                    Alignment
                  </div>
                  <button
                    type="button"
                    onMouseDown={preventBlur}
                    onClick={() => {
                      activeEditor?.chain().focus().setTextAlign("left").run();
                      setAlignFlyoutOpen(false);
                    }}
                    style={flyoutItemStyle(activeEditor?.isActive({ textAlign: "left" }))}
                  >
                    <AlignLeft size={14} />
                    <span>Left</span>
                  </button>
                  <button
                    type="button"
                    onMouseDown={preventBlur}
                    onClick={() => {
                      activeEditor?.chain().focus().setTextAlign("center").run();
                      setAlignFlyoutOpen(false);
                    }}
                    style={flyoutItemStyle(activeEditor?.isActive({ textAlign: "center" }))}
                  >
                    <AlignCenter size={14} />
                    <span>Center</span>
                  </button>
                  <button
                    type="button"
                    onMouseDown={preventBlur}
                    onClick={() => {
                      activeEditor?.chain().focus().setTextAlign("right").run();
                      setAlignFlyoutOpen(false);
                    }}
                    style={flyoutItemStyle(activeEditor?.isActive({ textAlign: "right" }))}
                  >
                    <AlignRight size={14} />
                    <span>Right</span>
                  </button>
                </div>
              )}
            </div>

            {/* 9. Link */}
            <button
              type="button"
              title="Insert / Edit Link"
              onMouseDown={preventBlur}
              onClick={() => {
                if (activeEditor) {
                  const currentHref = activeEditor.getAttributes("link").href;
                  setLinkUrl(currentHref || "https://www.oracleeyehospital.com/");
                  setLinkOpenNewTab(activeEditor.getAttributes("link").target !== "_self");
                  setLinkModalOpen(true);
                }
              }}
              style={btnStyle(activeEditor?.isActive("link"))}
              className="vertical-tb-btn"
            >
              <LinkIcon size={15} />
            </button>

            {/* 10. Image */}
            <button
              type="button"
              title="Insert Image"
              onMouseDown={preventBlur}
              onClick={() => {
                setImageUrl("");
                setImageAlt("");
                setImageModalOpen(true);
              }}
              style={btnStyle(false)}
              className="vertical-tb-btn"
            >
              <ImageIcon size={15} />
            </button>

            {/* 11. Clear Formatting */}
            <button
              type="button"
              title="Clear Formatting"
              onMouseDown={preventBlur}
              onClick={() => activeEditor?.chain().focus().clearNodes().unsetAllMarks().run()}
              style={btnStyle(false)}
              className="vertical-tb-btn"
            >
              <RemoveFormatting size={15} />
            </button>

            <div style={dividerStyle} />

            {/* 12. Undo */}
            <button
              type="button"
              title="Undo (Ctrl+Z)"
              onMouseDown={preventBlur}
              onClick={() => activeEditor?.chain().focus().undo().run()}
              style={btnStyle(false)}
              className="vertical-tb-btn"
            >
              <Undo size={14} />
            </button>

            {/* 13. Redo */}
            <button
              type="button"
              title="Redo (Ctrl+Y)"
              onMouseDown={preventBlur}
              onClick={() => activeEditor?.chain().focus().redo().run()}
              style={btnStyle(false)}
              className="vertical-tb-btn"
            >
              <Redo size={14} />
            </button>
          </>
        )}
      </aside>

      {/* Link Modal */}
      {linkModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setLinkModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 10,
              padding: 22,
              width: 440,
              maxWidth: "92%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Insert / Edit Hyperlink</h4>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleLinkSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>
                  Target Destination URL
                </label>
                <input
                  type="text"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://www.oracleeyehospital.com/service-slug"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#475569", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={linkOpenNewTab}
                    onChange={(e) => setLinkOpenNewTab(e.target.checked)}
                  />
                  <span>Open link in new browser tab (target=&quot;_blank&quot;)</span>
                </label>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  style={{
                    padding: "7px 14px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "7px 16px",
                    background: "#0d9488",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setImageModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 10,
              padding: 22,
              width: 440,
              maxWidth: "92%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Insert Content Image</h4>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleImageSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>
                  Image URL or Path
                </label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/Assets/img/services/Cataract-Surgery.jpg"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>
                  Alt Description Text
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. Eye examination procedure at Oracle Eye Hospital"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  style={{
                    padding: "7px 14px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "7px 16px",
                    background: "#0d9488",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Insert Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table Modal */}
      {tableModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setTableModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 10,
              padding: 22,
              width: 380,
              maxWidth: "92%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Insert Data Table</h4>
              <button
                type="button"
                onClick={() => setTableModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleTableSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>
                    Rows
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={tableRows}
                    onChange={(e) => setTableRows(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #cbd5e1",
                      borderRadius: 6,
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>
                    Columns
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={tableCols}
                    onChange={(e) => setTableCols(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #cbd5e1",
                      borderRadius: 6,
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#475569", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={tableWithHeader}
                    onChange={(e) => setTableWithHeader(e.target.checked)}
                  />
                  <span>Include Header Row</span>
                </label>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setTableModalOpen(false)}
                  style={{
                    padding: "7px 14px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "7px 16px",
                    background: "#0d9488",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Insert Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
