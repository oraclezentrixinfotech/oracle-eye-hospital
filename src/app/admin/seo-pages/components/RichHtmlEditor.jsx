"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";

const buttonStyle = (active = false) => ({
  border: "1px solid #cbd5e1",
  background: active ? "#ccfbf1" : "#fff",
  color: active ? "#0f766e" : "#334155",
  borderRadius: 4,
  padding: "4px 7px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
});

export default function RichHtmlEditor({ value = "", onChange, placeholder = "Write content...", minHeight = 140 }) {
  const [sourceMode, setSourceMode] = useState(false);
  const [source, setSource] = useState(value || "");
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4, 5, 6] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, protocols: ["http", "https", "mailto"] }),
      Image.configure({ allowBase64: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "",
    editorProps: { attributes: { class: "rich-html-editor-content" } },
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      setSource(html);
      onChange?.(html);
    },
  });

  useEffect(() => {
    setMounted(true);
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

  function addLink() {
    if (!editor) return;
    const href = window.prompt("Enter a URL (https://, http://, mailto:, or /internal-path):", editor.getAttributes("link").href || "");
    if (href === null) return;
    if (!href || /^(javascript|data|vbscript):/i.test(href.trim())) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim(), target: "_blank", rel: "noopener noreferrer" }).run();
  }

  function addImage() {
    if (!editor) return;
    const src = window.prompt("Enter a secure image URL (https:// or /path):");
    if (!src || /^(javascript|data|vbscript):/i.test(src.trim())) return;
    const alt = window.prompt("Enter meaningful image alt text:", "");
    editor.chain().focus().setImage({ src: src.trim(), alt: alt || "" }).run();
  }

  // Keep the server render and the first browser render identical. TipTap
  // creates browser-only ProseMirror DOM after hydration is complete.
  if (!mounted) {
    return (
      <textarea
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{ width: "100%", minHeight, padding: 12, border: "1px solid #cbd5e1", borderRadius: 6, resize: "vertical" }}
      />
    );
  }

  return (
    <div className="rich-html-editor" style={{ border: "1px solid #cbd5e1", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 6, background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
        {["bold", "italic", "underline", "strike"].map((mark) => (
          <button key={mark} type="button" title={mark} style={buttonStyle(editor?.isActive(mark))} onClick={() => editor?.chain().focus()[`toggle${mark[0].toUpperCase()}${mark.slice(1)}`]().run()}>{mark[0].toUpperCase()}</button>
        ))}
        {[2, 3, 4, 5, 6].map((level) => (
          <button key={level} type="button" style={buttonStyle(editor?.isActive("heading", { level }))} onClick={() => editor?.chain().focus().toggleHeading({ level }).run()}>H{level}</button>
        ))}
        <button type="button" style={buttonStyle()} onClick={() => editor?.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" style={buttonStyle()} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" style={buttonStyle()} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button type="button" style={buttonStyle()} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>Code</button>
        <button type="button" style={buttonStyle()} onClick={() => editor?.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()}>Table</button>
        {!["left", "center", "right"].map((align) => <button key={align} type="button" style={buttonStyle()} onClick={() => editor?.chain().focus().setTextAlign(align).run()}>{align[0].toUpperCase()}</button>)}
        <button type="button" style={buttonStyle()} onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}>Clear</button>
        <button type="button" style={buttonStyle()} onClick={addLink}>Link</button>
        <button type="button" style={buttonStyle()} onClick={() => editor?.chain().focus().unsetLink().run()}>Unlink</button>
        <button type="button" style={buttonStyle()} onClick={addImage}>Image</button>
        <button type="button" style={buttonStyle()} onClick={() => editor?.chain().focus().undo().run()}>Undo</button>
        <button type="button" style={buttonStyle()} onClick={() => editor?.chain().focus().redo().run()}>Redo</button>
        <button type="button" style={buttonStyle(sourceMode)} onClick={toggleSource}>HTML</button>
      </div>
      {sourceMode ? (
        <textarea value={source} onChange={(e) => applySource(e.target.value)} placeholder={placeholder} style={{ width: "100%", minHeight, border: 0, padding: 12, resize: "vertical", fontFamily: "monospace", fontSize: 12 }} />
      ) : (
        <EditorContent editor={editor} style={{ minHeight }} />
      )}
      <style jsx global>{`.rich-html-editor-content { min-height: ${minHeight}px; padding: 12px; outline: none; line-height: 1.6; overflow-wrap: anywhere; } .rich-html-editor-content p { margin: 0 0 8px; } .rich-html-editor-content img { display: block; max-width: 100%; width: auto; height: auto; object-fit: contain; } .rich-html-editor-content ul, .rich-html-editor-content ol { padding-left: 24px; }`}</style>
    </div>
  );
}
