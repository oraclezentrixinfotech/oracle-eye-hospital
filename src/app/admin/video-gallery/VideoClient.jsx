"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";
import DataTable from "../components/DataTable";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "../components/Toast";
import "../admin.css";
import "../components/datatable.css";

const EMPTY_FORM = { title: "", url: "", sortOrder: 0, active: true };

function StatusBadge({ active }) {
  return (
    <span className={`adt-badge ${active ? "adt-badge-active" : "adt-badge-inactive"}`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "url", label: "YouTube URL", render: r => (
    <a href={r.url} target="_blank" rel="noopener noreferrer"
      style={{ color: "#4482ff", wordBreak: "break-all" }}>
      {r.url.length > 45 ? r.url.slice(0, 45) + "…" : r.url}
    </a>
  )},
  { key: "active", label: "Status", render: r => <StatusBadge active={r.active} /> },
];

export default function VideoClient({ rows }) {
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
    setForm({ title: row.title, url: row.url, sortOrder: row.sortOrder, active: row.active });
    setFormError("");
    setModalOpen(true);
  }

  // ── Save (Add / Edit) ───────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const isEditing = !!editTarget;
    const url = isEditing ? `/api/admin/videos/${editTarget.id}` : "/api/admin/videos";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(data.error || "Something went wrong.");
      } else {
        setModalOpen(false);
        toast(isEditing ? "Video updated!" : "Video added!", "success");
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
      const res = await fetch(`/api/admin/videos/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast(data.error || "Delete failed.", "error");
      } else {
        toast("Video deleted.", "success");
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
    onChange: e => setForm(f => ({ ...f, [key]: e.target.value })),
  });

  return (
    <>
      {/* ── Header card ── */}
      <div className="adt-header-card">
        <h2 className="adt-header-title">Manage Video Gallery</h2>
        <button className="adt-btn-save" onClick={openAdd}>
          <Plus size={15} /> Add New Video
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="adt-content-card">
        <DataTable
          columns={COLUMNS}
          rows={rows}
          searchKeys={["title", "url"]}
          onEdit={openEdit}
          onDelete={row => setDeleteTarget(row)}
        />
      </div>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="adt-modal-overlay" onClick={() => !saving && setModalOpen(false)}>
          <div className="adt-form-modal" onClick={e => e.stopPropagation()}>
            <div className="adt-form-modal-header">
              <h3>{editTarget ? "Edit Video" : "Add New Video"}</h3>
              <button className="adt-form-modal-close" onClick={() => !saving && setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              {formError && <div className="adt-form-error">{formError}</div>}

              <div className="adt-field" style={{ marginBottom: 16 }}>
                <label>Video Title *</label>
                <input type="text" required minLength={2} placeholder="e.g. Eye Checkup Camp 2024" {...field("title")} />
              </div>

              <div className="adt-field" style={{ marginBottom: 16 }}>
                <label>YouTube URL *</label>
                <input type="url" required placeholder="https://www.youtube.com/watch?v=..." {...field("url")} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div className="adt-field">
                  <label>Sort Order</label>
                  <input type="number" min={0} {...field("sortOrder")} />
                </div>
                <div className="adt-toggle-wrap" style={{ paddingTop: 22 }}>
                  <label className="adt-toggle">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                    />
                    <span className="adt-toggle-slider"></span>
                  </label>
                  <span>Active</span>
                </div>
              </div>

              <div className="adt-form-actions">
                <button type="submit" className="adt-btn-save" disabled={saving}>
                  {saving ? <><Loader2 size={14} className="adt-spinner" /> Saving…</> : "Save Video"}
                </button>
                <button type="button" className="adt-btn-cancel-form" disabled={saving}
                  onClick={() => setModalOpen(false)}>
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
