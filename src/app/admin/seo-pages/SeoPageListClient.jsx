"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ExternalLink, Edit2, Trash2, Eye } from "lucide-react";
import DataTable from "../components/DataTable";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "../components/Toast";
import "../admin.css";
import "../components/datatable.css";

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

export default function SeoPageListClient({ rows = [] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/seo-pages/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast(data.error || "Delete failed.", "error");
      } else {
        toast("SEO page deleted successfully.", "success");
        router.refresh();
      }
    } catch {
      toast("Network error. Could not delete page.", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns = [
    {
      key: "srNo",
      label: "Sr. No",
      render: (_, idx) => <span style={{ color: "#6b7280", fontSize: 13 }}>{idx + 1}</span>,
    },
    {
      key: "h1Title",
      label: "Thumbnail & Title",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {r.heroImage ? (
            <img
              src={r.heroImage}
              alt=""
              className="adt-thumb"
              style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
            />
          ) : (
            <div
              className="adt-thumb-placeholder"
              style={{ width: 48, height: 36, flexShrink: 0, fontSize: 10 }}
            >
              No img
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}>{r.h1Title}</div>
            {r.heroBadge && (
              <span style={{ fontSize: 11, color: "#0d9488", fontWeight: 500 }}>
                {r.heroBadge}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (r) => (
        <code
          style={{
            fontSize: 12,
            color: "#374151",
            background: "#f3f4f6",
            padding: "2px 6px",
            borderRadius: 4,
          }}
        >
          {r.slug}
        </code>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <span
          className={`adt-badge ${
            r.status === "published" ? "adt-badge-active" : "adt-badge-inactive"
          }`}
        >
          {r.status === "published" ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (r) => (
        <span style={{ color: "#6b7280", fontSize: 13 }}>{formatDate(r.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a
            href={`/services/${r.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="adt-btn-action"
            title="View live page in new tab"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 8px",
              background: "#eff6ff",
              color: "#2563eb",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            <Eye size={13} />
            <span>View</span>
            <ExternalLink size={11} />
          </a>
          <Link
            href={`/admin/seo-pages/${r.id}/edit`}
            className="adt-btn-edit"
            title="Edit page"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "5px",
              background: "#fef3c7",
              color: "#d97706",
              borderRadius: 4,
            }}
          >
            <Edit2 size={14} />
          </Link>
          <button
            type="button"
            className="adt-btn-del"
            title="Delete page"
            onClick={() => setDeleteTarget(r)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "5px",
              background: "#fee2e2",
              color: "#dc2626",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Header Card */}
      <div className="adt-header-card">
        <div>
          <h2 className="adt-header-title">Manage SEO Pages</h2>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#6b7280" }}>
            Create and manage keyword-targeted landing pages under <code>/services/[slug]</code>.
          </p>
        </div>
        <Link href="/admin/seo-pages/new" className="adt-btn-save" style={{ textDecoration: "none" }}>
          <Plus size={15} /> Add SEO Page
        </Link>
      </div>

      {/* Table Card */}
      <div className="adt-content-card">
        <DataTable
          columns={columns}
          rows={rows}
          searchKeys={["h1Title", "slug", "metaTitle", "keywords", "heroBadge"]}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          message={`Are you sure you want to delete "${deleteTarget.h1Title}" (${deleteTarget.slug})? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}
    </>
  );
}
