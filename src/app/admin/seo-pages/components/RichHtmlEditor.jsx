"use client";

import { useEffect, useState, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
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
  Unlink,
  Image as ImageIcon,
  Undo,
  Redo,
  FileCode,
  ChevronDown,
  Trash2,
} from "lucide-react";

// Custom Image extension supporting .content-img class and data-align attribute
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "content-img",
        renderHTML: (attributes) => ({
          class: attributes.class ? `${attributes.class} content-img` : "content-img",
        }),
      },
      align: {
        default: "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align || "center",
        }),
        parseHTML: (element) => element.getAttribute("data-align") || "center",
      },
    };
  },
});

export default function RichHtmlEditor({
  value = "",
  onChange,
  placeholder = "Write content...",
  minHeight = 140,
  onToggleBulletList,
  onToggleOrderedList,
}) {
  const [sourceMode, setSourceMode] = useState(false);
  const [source, setSource] = useState(value || "");
  const [mounted, setMounted] = useState(false);
  const [headingDropdownOpen, setHeadingDropdownOpen] = useState(false);
  const [alignDropdownOpen, setAlignDropdownOpen] = useState(false);

  // Floating Image Bubble Menu State
  const [imageBubble, setImageBubble] = useState(null);

  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const alignRef = useRef(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4, 5, 6] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["http", "https", "mailto"],
      }),
      CustomImage.configure({ allowBase64: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "",
    editorProps: {
      attributes: { class: "rich-html-editor-content" },
      handleClickOn: (view, pos, node) => {
        if (node.type.name === "image") {
          updateImageBubble(view, pos, node);
          return true;
        }
        setImageBubble(null);
        return false;
      },
    },
    onSelectionUpdate: ({ editor: current }) => {
      const { state, view } = current;
      const { selection } = state;
      if (selection.node && selection.node.type.name === "image") {
        updateImageBubble(view, selection.from, selection.node);
      } else {
        // If selection is not image, check if we still clicked on an image
        setTimeout(() => {
          if (!containerRef.current?.contains(document.activeElement)) {
            // keep state if user is clicking floating menu
          }
        }, 50);
      }
    },
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      setSource(html);
      onChange?.(html);
    },
  });

  function updateImageBubble(view, pos, node) {
    try {
      const dom = view.nodeDOM(pos);
      if (!dom || !containerRef.current) return;
      const rect = dom.getBoundingClientRect();
      const parentRect = containerRef.current.getBoundingClientRect();

      setImageBubble({
        pos,
        currentAlign: node.attrs.align || "center",
        top: rect.top - parentRect.top - 46,
        left: Math.max(10, rect.left - parentRect.left + rect.width / 2 - 95),
      });
    } catch {
      // fallback
    }
  }

  function setImageAlignment(alignment) {
    if (!editor || !imageBubble) return;
    const { pos } = imageBubble;
    editor
      .chain()
      .setNodeSelection(pos)
      .updateAttributes("image", { align: alignment })
      .focus()
      .run();

    setImageBubble((prev) => (prev ? { ...prev, currentAlign: alignment } : null));

    // trigger update after attribute update
    setTimeout(() => {
      const html = editor.getHTML();
      setSource(html);
      onChange?.(html);
    }, 20);
  }

  function removeSelectedImage() {
    if (!editor || !imageBubble) return;
    const { pos } = imageBubble;
    editor.chain().setNodeSelection(pos).deleteSelection().focus().run();
    setImageBubble(null);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns and image bubble on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (headingRef.current && !headingRef.current.contains(event.target)) {
        setHeadingDropdownOpen(false);
      }
      if (alignRef.current && !alignRef.current.contains(event.target)) {
        setAlignDropdownOpen(false);
      }
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !event.target.closest(".img-floating-bubble")
      ) {
        setImageBubble(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!editor || sourceMode) return;
    const next = value || "";
    if (next !== editor.getHTML()) editor.commands.setContent(next, false);
    setSource(next);
  }, [value, editor, sourceMode]);

  function toggleSource() {
    if (!sourceMode) setSource(editor?.getHTML() || value || "");
    setSourceMode((current) => !current);
  }

  function applySource(next) {
    setSource(next);
    onChange?.(next);
    if (editor) editor.commands.setContent(next || "", false);
  }

  // Prevent button click from taking focus away from selected editor text
  function preventBlur(e) {
    e.preventDefault();
  }

  function addLink() {
    if (!editor) return;
    const currentHref = editor.getAttributes("link").href || "";
    const href = window.prompt("Enter a URL (https://, http://, mailto:, or /internal-path):", currentHref);
    if (href === null) return;
    if (!href || /^(javascript|data|vbscript):/i.test(href.trim())) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: href.trim(), target: "_blank", rel: "noopener noreferrer" })
      .run();
  }

  function addImage() {
    if (!editor) return;
    const src = window.prompt("Enter a secure image URL (https:// or /path):");
    if (!src || /^(javascript|data|vbscript):/i.test(src.trim())) return;
    const alt = window.prompt("Enter meaningful image alt text:", "");
    editor
      .chain()
      .focus()
      .setImage({ src: src.trim(), alt: alt || "", align: "center", class: "content-img" })
      .run();
  }

  const activeHeadingLevel = [2, 3, 4, 5, 6].find((lvl) =>
    editor?.isActive("heading", { level: lvl })
  );

  if (!mounted) {
    return (
      <textarea
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          width: "100%",
          minHeight,
          padding: 12,
          border: "1px solid #cbd5e1",
          borderRadius: 6,
          resize: "vertical",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="rich-html-editor"
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: 6,
        overflow: "visible",
        background: "#fff",
        position: "relative",
      }}
    >
      {/* Floating Image Bubble Toolbar */}
      {imageBubble && (
        <div
          className="img-floating-bubble"
          style={{
            position: "absolute",
            top: `${imageBubble.top}px`,
            left: `${imageBubble.left}px`,
            zIndex: 120,
            background: "#1e293b",
            borderRadius: 6,
            padding: "4px 6px",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.2)",
            animation: "fadeIn 0.15s ease",
          }}
          onMouseDown={preventBlur}
        >
          <span style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600, padding: "0 4px" }}>
            Align:
          </span>
          <button
            type="button"
            title="Align Left (Wrap Text)"
            onMouseDown={preventBlur}
            onClick={() => setImageAlignment("left")}
            className={`bubble-btn ${imageBubble.currentAlign === "left" ? "active" : ""}`}
          >
            <AlignLeft size={13} />
            <span>Left</span>
          </button>
          <button
            type="button"
            title="Align Center"
            onMouseDown={preventBlur}
            onClick={() => setImageAlignment("center")}
            className={`bubble-btn ${imageBubble.currentAlign === "center" ? "active" : ""}`}
          >
            <AlignCenter size={13} />
            <span>Center</span>
          </button>
          <button
            type="button"
            title="Align Right (Wrap Text)"
            onMouseDown={preventBlur}
            onClick={() => setImageAlignment("right")}
            className={`bubble-btn ${imageBubble.currentAlign === "right" ? "active" : ""}`}
          >
            <AlignRight size={13} />
            <span>Right</span>
          </button>
          <div style={{ width: 1, height: 16, background: "#475569", margin: "0 2px" }} />
          <button
            type="button"
            title="Delete Image"
            onMouseDown={preventBlur}
            onClick={removeSelectedImage}
            className="bubble-btn text-danger"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      {/* Modern Compact Toolbar with Dropdowns and Icons */}
      <div
        className="rich-editor-toolbar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 3,
          padding: "5px 8px",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          userSelect: "none",
        }}
      >
        {/* Basic Text Formatting Group */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onMouseDown={preventBlur}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`tb-btn ${editor?.isActive("bold") ? "active" : ""}`}
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onMouseDown={preventBlur}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`tb-btn ${editor?.isActive("italic") ? "active" : ""}`}
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onMouseDown={preventBlur}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`tb-btn ${editor?.isActive("underline") ? "active" : ""}`}
          >
            <UnderlineIcon size={14} />
          </button>
          <button
            type="button"
            title="Strikethrough"
            onMouseDown={preventBlur}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`tb-btn ${editor?.isActive("strike") ? "active" : ""}`}
          >
            <Strikethrough size={14} />
          </button>
        </div>

        <div className="tb-divider" />

        {/* Headings Dropdown */}
        <div
          ref={headingRef}
          style={{ position: "relative" }}
          onMouseEnter={() => setHeadingDropdownOpen(true)}
          onMouseLeave={() => setHeadingDropdownOpen(false)}
        >
          <button
            type="button"
            title="Headings"
            onMouseDown={preventBlur}
            onClick={() => setHeadingDropdownOpen((v) => !v)}
            className={`tb-btn tb-dropdown-btn ${activeHeadingLevel ? "active" : ""}`}
          >
            <Heading size={14} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>
              {activeHeadingLevel ? `H${activeHeadingLevel}` : "Heading"}
            </span>
            <ChevronDown size={11} style={{ opacity: 0.7 }} />
          </button>

          {headingDropdownOpen && (
            <div className="tb-dropdown-menu">
              <button
                type="button"
                onMouseDown={preventBlur}
                onClick={() => {
                  editor?.chain().focus().setParagraph().run();
                  setHeadingDropdownOpen(false);
                }}
                className={`tb-dropdown-item ${!activeHeadingLevel && editor?.isActive("paragraph") ? "active" : ""}`}
              >
                Normal Text (Paragraph)
              </button>
              {[2, 3, 4, 5, 6].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onMouseDown={preventBlur}
                  onClick={() => {
                    editor?.chain().focus().toggleHeading({ level: lvl }).run();
                    setHeadingDropdownOpen(false);
                  }}
                  className={`tb-dropdown-item ${editor?.isActive("heading", { level: lvl }) ? "active" : ""}`}
                  style={{
                    fontSize: lvl === 2 ? 15 : lvl === 3 ? 14 : 13,
                    fontWeight: lvl <= 3 ? 700 : 600,
                  }}
                >
                  Heading {lvl} (H{lvl})
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="tb-divider" />

        {/* Lists & Blocks */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button
            type="button"
            title="Highlight Bullet Points (Items List)"
            onMouseDown={preventBlur}
            onClick={() => {
              if (onToggleBulletList) {
                onToggleBulletList();
              } else {
                editor?.chain().focus().toggleBulletList().run();
              }
            }}
            className={`tb-btn ${editor?.isActive("bulletList") ? "active" : ""}`}
          >
            <List size={14} />
          </button>
          <button
            type="button"
            title="Numbered Step Items (Items List)"
            onMouseDown={preventBlur}
            onClick={() => {
              if (onToggleOrderedList) {
                onToggleOrderedList();
              } else {
                editor?.chain().focus().toggleOrderedList().run();
              }
            }}
            className={`tb-btn ${editor?.isActive("orderedList") ? "active" : ""}`}
          >
            <ListOrdered size={14} />
          </button>
          <button
            type="button"
            title="Blockquote"
            onMouseDown={preventBlur}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`tb-btn ${editor?.isActive("blockquote") ? "active" : ""}`}
          >
            <Quote size={14} />
          </button>
          <button
            type="button"
            title="Code Block"
            onMouseDown={preventBlur}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            className={`tb-btn ${editor?.isActive("codeBlock") ? "active" : ""}`}
          >
            <Code size={14} />
          </button>
          <button
            type="button"
            title="Insert 2x2 Table"
            onMouseDown={preventBlur}
            onClick={() =>
              editor?.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()
            }
            className={`tb-btn ${editor?.isActive("table") ? "active" : ""}`}
          >
            <TableIcon size={14} />
          </button>
        </div>

        <div className="tb-divider" />

        {/* Text Alignment Dropdown */}
        <div
          ref={alignRef}
          style={{ position: "relative" }}
          onMouseEnter={() => setAlignDropdownOpen(true)}
          onMouseLeave={() => setAlignDropdownOpen(false)}
        >
          <button
            type="button"
            title="Alignment"
            onMouseDown={preventBlur}
            onClick={() => setAlignDropdownOpen((v) => !v)}
            className="tb-btn tb-dropdown-btn"
          >
            {editor?.isActive({ textAlign: "center" }) ? (
              <AlignCenter size={14} />
            ) : editor?.isActive({ textAlign: "right" }) ? (
              <AlignRight size={14} />
            ) : (
              <AlignLeft size={14} />
            )}
            <ChevronDown size={11} style={{ opacity: 0.7 }} />
          </button>

          {alignDropdownOpen && (
            <div className="tb-dropdown-menu" style={{ minWidth: 120 }}>
              <button
                type="button"
                onMouseDown={preventBlur}
                onClick={() => {
                  editor?.chain().focus().setTextAlign("left").run();
                  setAlignDropdownOpen(false);
                }}
                className={`tb-dropdown-item ${editor?.isActive({ textAlign: "left" }) ? "active" : ""}`}
              >
                <AlignLeft size={13} style={{ marginRight: 6 }} /> Left
              </button>
              <button
                type="button"
                onMouseDown={preventBlur}
                onClick={() => {
                  editor?.chain().focus().setTextAlign("center").run();
                  setAlignDropdownOpen(false);
                }}
                className={`tb-dropdown-item ${editor?.isActive({ textAlign: "center" }) ? "active" : ""}`}
              >
                <AlignCenter size={13} style={{ marginRight: 6 }} /> Center
              </button>
              <button
                type="button"
                onMouseDown={preventBlur}
                onClick={() => {
                  editor?.chain().focus().setTextAlign("right").run();
                  setAlignDropdownOpen(false);
                }}
                className={`tb-dropdown-item ${editor?.isActive({ textAlign: "right" }) ? "active" : ""}`}
              >
                <AlignRight size={13} style={{ marginRight: 6 }} /> Right
              </button>
            </div>
          )}
        </div>

        <div className="tb-divider" />

        {/* Links & Media */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button
            type="button"
            title="Add Link to Selection"
            onMouseDown={preventBlur}
            onClick={addLink}
            className={`tb-btn ${editor?.isActive("link") ? "active" : ""}`}
          >
            <LinkIcon size={14} />
          </button>
          {editor?.isActive("link") && (
            <button
              type="button"
              title="Remove Link"
              onMouseDown={preventBlur}
              onClick={() => editor?.chain().focus().unsetLink().run()}
              className="tb-btn"
            >
              <Unlink size={14} />
            </button>
          )}
          <button
            type="button"
            title="Insert Image"
            onMouseDown={preventBlur}
            onClick={addImage}
            className="tb-btn"
          >
            <ImageIcon size={14} />
          </button>
          <button
            type="button"
            title="Clear Formatting on Selection"
            onMouseDown={preventBlur}
            onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
            className="tb-btn"
          >
            <RemoveFormatting size={14} />
          </button>
        </div>

        <div className="tb-divider" />

        {/* History & Source View */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "auto" }}>
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            onMouseDown={preventBlur}
            onClick={() => editor?.chain().focus().undo().run()}
            className="tb-btn"
          >
            <Undo size={14} />
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Y)"
            onMouseDown={preventBlur}
            onClick={() => editor?.chain().focus().redo().run()}
            className="tb-btn"
          >
            <Redo size={14} />
          </button>
          <button
            type="button"
            title="View Raw HTML Source"
            onMouseDown={preventBlur}
            onClick={toggleSource}
            className={`tb-btn ${sourceMode ? "active" : ""}`}
            style={{ fontWeight: 600, fontSize: 11, padding: "4px 8px" }}
          >
            <FileCode size={13} style={{ marginRight: 3 }} /> HTML
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {sourceMode ? (
        <textarea
          value={source}
          onChange={(e) => applySource(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            minHeight,
            border: 0,
            padding: 12,
            resize: "vertical",
            fontFamily: "monospace",
            fontSize: 12,
            outline: "none",
            display: "block",
            boxSizing: "border-box",
          }}
        />
      ) : (
        <EditorContent editor={editor} style={{ minHeight }} />
      )}

      <style jsx global>{`
        .rich-editor-toolbar .tb-btn {
          border: 1px solid transparent;
          background: transparent;
          color: #475569;
          border-radius: 4px;
          padding: 5px 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          transition: all 0.15s ease;
          line-height: 1;
        }
        .rich-editor-toolbar .tb-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
          border-color: #cbd5e1;
        }
        .rich-editor-toolbar .tb-btn.active {
          background: #ccfbf1;
          color: #0f766e;
          border-color: #99f6e4;
        }
        .rich-editor-toolbar .tb-dropdown-btn {
          padding: 4px 7px;
          border: 1px solid #cbd5e1;
          background: #fff;
        }
        .rich-editor-toolbar .tb-divider {
          width: 1px;
          height: 18px;
          background: #cbd5e1;
          margin: 0 4px;
        }
        .rich-editor-toolbar .tb-dropdown-menu {
          position: absolute;
          top: calc(100% + 3px);
          left: 0;
          background: #fff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
          z-index: 100;
          padding: 4px;
          min-width: 170px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .rich-editor-toolbar .tb-dropdown-item {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 13px;
          color: #334155;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background 0.12s ease;
        }
        .rich-editor-toolbar .tb-dropdown-item:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .rich-editor-toolbar .tb-dropdown-item.active {
          background: #ccfbf1;
          color: #0f766e;
          font-weight: 600;
        }

        /* Floating Bubble Menu */
        .img-floating-bubble .bubble-btn {
          background: #334155;
          border: 1px solid #475569;
          color: #f1f5f9;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.12s ease;
        }
        .img-floating-bubble .bubble-btn:hover {
          background: #475569;
          color: #fff;
        }
        .img-floating-bubble .bubble-btn.active {
          background: #0d9488;
          border-color: #14b8a6;
          color: #fff;
        }
        .img-floating-bubble .bubble-btn.text-danger:hover {
          background: #dc2626;
          border-color: #ef4444;
          color: #fff;
        }

        /* Editor Content & Images */
        .rich-html-editor-content {
          min-height: ${minHeight}px;
          padding: 12px 14px;
          outline: none;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }
        .rich-html-editor-content::after {
          content: "";
          display: table;
          clear: both;
        }
        .rich-html-editor-content p {
          margin: 0 0 10px;
        }
        .rich-html-editor-content h2,
        .rich-html-editor-content h3,
        .rich-html-editor-content h4,
        .rich-html-editor-content h5,
        .rich-html-editor-content h6 {
          margin: 14px 0 8px;
          font-weight: 700;
          color: #0f172a;
        }

        /* Content Image Styling in Editor */
        .rich-html-editor-content img,
        .rich-html-editor-content .content-img {
          display: block;
          max-width: 420px;
          width: 100%;
          height: auto;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
          transition: outline 0.12s ease, box-shadow 0.12s ease;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          margin-top: 6px;
          margin-bottom: 12px;
        }
        .rich-html-editor-content img:hover {
          outline: 2px dashed #0d9488;
          outline-offset: 2px;
        }
        .rich-html-editor-content .ProseMirror-selectednode {
          outline: 3px solid #0d9488 !important;
          outline-offset: 2px;
        }

        /* 1. Left / Right image = passport size (140px fixed width, text wrap) */
        .rich-html-editor-content img[data-align="left"],
        .rich-html-editor-content .content-img[data-align="left"] {
          float: left !important;
          width: 140px !important;
          max-width: 140px !important;
          height: auto !important;
          object-fit: cover !important;
          margin: 4px 16px 8px 0 !important;
          border-radius: 4px !important;
          border: 1px solid #e2e8f0 !important;
        }

        .rich-html-editor-content img[data-align="right"],
        .rich-html-editor-content .content-img[data-align="right"] {
          float: right !important;
          width: 140px !important;
          max-width: 140px !important;
          height: auto !important;
          object-fit: cover !important;
          margin: 4px 0 8px 16px !important;
          border-radius: 4px !important;
          border: 1px solid #e2e8f0 !important;
        }

        /* 4. Center image = pehle jaisa (max-width: 420px; width: 100%; display: block; margin: 0 auto;) */
        .rich-html-editor-content img[data-align="center"],
        .rich-html-editor-content .content-img[data-align="center"] {
          float: none !important;
          max-width: 420px !important;
          width: 100% !important;
          height: auto !important;
          margin: 10px auto 14px auto !important;
          display: block !important;
          clear: both !important;
          border-radius: 6px !important;
        }

        /* 3. Lists, Headings, Tables, Blockquotes image ke neeche start hon (clear: both) */
        .rich-html-editor-content ul,
        .rich-html-editor-content ol,
        .rich-html-editor-content table,
        .rich-html-editor-content blockquote,
        .rich-html-editor-content pre,
        .rich-html-editor-content h2,
        .rich-html-editor-content h3,
        .rich-html-editor-content h4,
        .rich-html-editor-content h5,
        .rich-html-editor-content h6 {
          clear: both;
        }

        /* 5. Mobile (max-width: 640px): unfloat left/right images and center them */
        @media (max-width: 640px) {
          .rich-html-editor-content img,
          .rich-html-editor-content .content-img,
          .rich-html-editor-content img[data-align="left"],
          .rich-html-editor-content .content-img[data-align="left"],
          .rich-html-editor-content img[data-align="right"],
          .rich-html-editor-content .content-img[data-align="right"] {
            float: none !important;
            margin: 10px auto 14px auto !important;
            display: block !important;
            max-width: 220px !important;
            width: 100% !important;
            clear: both !important;
          }
        }

        .rich-html-editor-content ul,
        .rich-html-editor-content ol {
          padding-left: 24px;
          margin: 0 0 10px;
        }
        .rich-html-editor-content blockquote {
          border-left: 3px solid #0d9488;
          padding-left: 12px;
          color: #475569;
          margin: 10px 0;
          font-style: italic;
        }
        .rich-html-editor-content pre {
          background: #1e293b;
          color: #f8fafc;
          padding: 10px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 12px;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}
