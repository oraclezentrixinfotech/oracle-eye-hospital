"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, RefreshCw } from "lucide-react";
import DataTable from "./DataTable";
import ConfirmModal from "./ConfirmModal";
import ImageUpload from "./ImageUpload";
import { toast } from "./Toast";
import "../admin.css";
import "./datatable.css";

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  image: "",
  published: true,
};

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function PostManager({ type, rows = [] }) {
  const router = useRouter();
  const isNews = type === "NEWS";
  const singularLabel = isNews ? "News" : "Blog Post";
  const pluralLabel = isNews ? "News & Events" : "Blog Posts";

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugCustomized, setSlugCustomized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Open Add Modal ──────────────────────────────────────────────
  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setSlugCustomized(false);
    setFormError("");
    setModalOpen(true);
  }

  // ── Open Edit Modal ─────────────────────────────────────────────
  function openEdit(row) {
    setEditTarget(row);
    setForm({
      title: row.title || "",
      slug: row.slug || "",
      excerpt: row.excerpt || "",
      body: row.body || "",
      image: row.image || "",
      published: row.published ?? true,
    });
    setSlugCustomized(true); // Don't auto-overwrite existing slug when editing title
    setFormError("");
    setModalOpen(true);
  }

  // ── Handle Title Change (Auto-generate slug if not customized) ──
  function handleTitleChange(e) {
    const newTitle = e.target.value;
    setForm((prev) => ({
      ...prev,
      title: newTitle,
      slug: !slugCustomized ? slugify(newTitle) : prev.slug,
    }));
  }

  // ── Handle Slug Manual Change ───────────────────────────────────
  function handleSlugChange(e) {
    setSlugCustomized(true);
    setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
  }

  // ── Regenerate Slug from Title ──────────────────────────────────
  function regenerateSlug() {
    const newSlug = slugify(form.title);
    setForm((prev) => ({ ...prev, slug: newSlug }));
    setSlugCustomized(false);
  }

  // ── Save (Add / Edit) ───────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const isEditing = Boolean(editTarget);
    const url = isEditing ? `/api/admin/posts/${editTarget.id}` : "/api/admin/posts";
    const method = isEditing ? "PUT" : "POST";

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      body: form.body.trim(),
      image: form.image || null,
      published: Boolean(form.published),
      type,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(data.error || "Failed to save post. Please check details.");
      } else {
        setModalOpen(false);
        toast(isEditing ? `${singularLabel} updated!` : `${singularLabel} added!`, "success");
        router.refresh();
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete Post ─────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/posts/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast(data.error || "Delete failed.", "error");
      } else {
        toast(`${singularLabel} deleted.`, "success");
        router.refresh();
      }
    } catch {
      toast("Network error.", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  // ── Table Columns ───────────────────────────────────────────────
  const columns = [
    {
      key: "title",
      label: "Title",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {r.image ? (
            <img
              src={r.image}
              alt=""
              className="adt-thumb"
              style={{ width: 44, height: 34, flexShrink: 0 }}
            />
          ) : (
            <div
              className="adt-thumb-placeholder"
              style={{ width: 44, height: 34, flexShrink: 0 }}
            >
              No img
            </div>
          )}
          <span style={{ fontWeight: 500, color: "#111827" }}>{r.title}</span>
        </div>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (r) => (
        <code style={{ fontSize: 12, color: "#4b5563", background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>
          {r.slug}
        </code>
      ),
    },
    {
      key: "published",
      label: "Status",
      render: (r) => (
        <span className={`adt-badge ${r.published ? "adt-badge-active" : "adt-badge-inactive"}`}>
          {r.published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (r) => <span style={{ color: "#6b7280", fontSize: 13 }}>{formatDate(r.createdAt)}</span>,
    },
  ];

  return (
    <>
      {/* ── Header Card ── */}
      <div className="adt-header-card">
        <h2 className="adt-header-title">Manage {pluralLabel}</h2>
        <button className="adt-btn-save" onClick={openAdd}>
          <Plus size={15} /> Add {singularLabel}
        </button>
      </div>

      {/* ── Table Card ── */}
      <div className="adt-content-card">
        <DataTable
          columns={columns}
          rows={rows}
          searchKeys={["title", "slug", "excerpt"]}
          onEdit={openEdit}
          onDelete={(row) => setDeleteTarget(row)}
        />
      </div>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="adt-modal-overlay" onClick={() => !saving && setModalOpen(false)}>
          <div
            className="adt-form-modal adt-form-modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adt-form-modal-header">
              <h3>{editTarget ? `Edit ${singularLabel}` : `Add New ${singularLabel}`}</h3>
              <button
                className="adt-form-modal-close"
                onClick={() => !saving && setModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              {formError && <div className="adt-form-error">{formError}</div>}

              {/* Featured Image */}
              <div style={{ marginBottom: 16 }}>
                <ImageUpload
                  label="Featured Image (Optional)"
                  currentUrl={form.image}
                  onUpload={(url) => setForm((prev) => ({ ...prev, image: url }))}
                />
              </div>

              {/* Title */}
              <div className="adt-field" style={{ marginBottom: 16 }}>
                <label>Title *</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  placeholder={`Enter ${singularLabel.toLowerCase()} title`}
                  value={form.title}
                  onChange={handleTitleChange}
                />
              </div>

              {/* Slug with Regenerate button */}
              <div className="adt-field" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label>Slug (URL) *</label>
                  {form.title && (
                    <button
                      type="button"
                      onClick={regenerateSlug}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#4482ff",
                        cursor: "pointer",
                        fontSize: 11,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: 0,
                        marginBottom: 4,
                      }}
                      title="Sync slug with current title"
                    >
                      <RefreshCw size={11} /> Auto from title
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. post-url-slug"
                  value={form.slug}
                  onChange={handleSlugChange}
                />
              </div>

              {/* Excerpt */}
              <div className="adt-field" style={{ marginBottom: 16 }}>
                <label>Excerpt / Summary *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Short brief or summary for preview cards..."
                  value={form.excerpt}
                  onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                />
              </div>

              {/* Body */}
              <div className="adt-field" style={{ marginBottom: 16 }}>
                <label>Body Content *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Full post content. Blank lines represent paragraph breaks..."
                  value={form.body}
                  onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
                />
              </div>

              {/* Published Toggle */}
              <div className="adt-toggle-wrap" style={{ padding: "8px 0 16px 0" }}>
                <label className="adt-toggle">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
                  />
                  <span className="adt-toggle-slider"></span>
                </label>
                <span>{form.published ? "Published (Visible publicly)" : "Draft (Hidden publicly)"}</span>
              </div>

              {/* Actions */}
              <div className="adt-form-actions">
                <button type="submit" className="adt-btn-save" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 size={14} className="adt-spin" /> Saving…
                    </>
                  ) : (
                    `Save ${singularLabel}`
                  )}
                </button>
                <button
                  type="button"
                  className="adt-btn-cancel-form"
                  disabled={saving}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}
    </>
  );
}
