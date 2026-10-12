"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";
import DataTable from "../components/DataTable";
import ConfirmModal from "../components/ConfirmModal";
import ImageUpload from "../components/ImageUpload";
import { toast } from "../components/Toast";
import "../admin.css";
import "../components/datatable.css";

const EMPTY_FORM = { title: "", image: "", sortOrder: 0, status: true };

function StatusBadge({ status }) {
  return (
    <span className={`adt-badge ${status ? "adt-badge-active" : "adt-badge-inactive"}`}>
      {status ? "Active" : "Inactive"}
    </span>
  );
}

const COLUMNS = [
  {
    key: "image",
    label: "Image",
    render: (r) =>
      r.image ? (
        <a href={r.image} target="_blank" rel="noopener noreferrer" title="View full image">
          <img src={r.image} alt={r.title || "Photo"} className="adt-thumb" />
        </a>
      ) : (
        <div className="adt-thumb-placeholder">No Image</div>
      ),
  },
  { key: "title", label: "Title" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

export default function PhotoClient({ rows }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // row to delete
  const [deleting, setDeleting] = useState(false);

  // ── Open Add Modal ──────────────────────────────────────────────
  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  // ── Open Edit Modal ─────────────────────────────────────────────
  function openEdit(row) {
    setEditTarget(row);
    setForm({
      title: row.title || "",
      image: row.image || "",
      sortOrder: row.sortOrder ?? 0,
      status: row.status ?? true,
    });
    setFormError("");
    setModalOpen(true);
  }

  // ── Save (Add / Edit) ───────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    if (!form.image) {
      setFormError("Please upload an image first.");
      setSaving(false);
      return;
    }

    const isEditing = !!editTarget;
    const url = isEditing ? `/api/admin/photos/${editTarget.id}` : "/api/admin/photos";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sortOrder: Number(form.sortOrder) || 0,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(data.error || "Something went wrong.");
      } else {
        setModalOpen(false);
        toast(isEditing ? "Photo updated!" : "Photo added!", "success");
        router.refresh();
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ──────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/photos/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast(data.error || "Delete failed.", "error");
      } else {
        toast("Photo deleted.", "success");
        router.refresh();
      }
    } catch {
      toast("Network error.", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  // ── Field helper ────────────────────────────────────────────────
  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <>
      {/* ── Header card ── */}
      <div className="adt-header-card">
        <h2 className="adt-header-title">Manage Photo Gallery</h2>
        <button className="adt-btn-save" onClick={openAdd}>
          <Plus size={15} /> Add New Photo
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="adt-content-card">
        <DataTable
          columns={COLUMNS}
          rows={rows}
          searchKeys={["title"]}
          onEdit={openEdit}
          onDelete={(row) => setDeleteTarget(row)}
        />
      </div>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="adt-modal-overlay" onClick={() => !saving && setModalOpen(false)}>
          <div className="adt-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adt-form-modal-header">
              <h3>{editTarget ? "Edit Photo" : "Add New Photo"}</h3>
              <button className="adt-form-modal-close" onClick={() => !saving && setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              {formError && <div className="adt-form-error">{formError}</div>}

              {/* Image Upload Component */}
              <div style={{ marginBottom: 16 }}>
                <ImageUpload
                  label="Photo Image *"
                  currentUrl={form.image}
                  onUpload={(url) => setForm((f) => ({ ...f, image: url }))}
                />
              </div>

              {/* Title */}
              <div className="adt-field" style={{ marginBottom: 16 }}>
                <label>Photo Title *</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  placeholder="e.g. Modern Operation Theatre"
                  {...field("title")}
                />
              </div>

              {/* Sort Order & Status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div className="adt-field">
                  <label>Sort Order</label>
                  <input type="number" min={0} {...field("sortOrder")} />
                </div>
                <div className="adt-toggle-wrap" style={{ paddingTop: 22 }}>
                  <label className="adt-toggle">
                    <input
                      type="checkbox"
                      checked={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked }))}
                    />
                    <span className="adt-toggle-slider"></span>
                  </label>
                  <span>Active</span>
                </div>
              </div>

              {/* Actions */}
              <div className="adt-form-actions">
                <button type="submit" className="adt-btn-save" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 size={14} className="adt-spin" /> Saving…
                    </>
                  ) : (
                    "Save Photo"
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
