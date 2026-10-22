"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ExternalLink, Edit2, Trash2, Eye, UploadCloud } from "lucide-react";
import DataTable from "../components/DataTable";
import ConfirmModal from "../components/ConfirmModal";
import DocumentImportModal from "./components/DocumentImportModal";
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

export default function SeoPageListClient({ rows = [], doctorsList = [], allPages = [] }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

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
            <Link
              href={`/admin/seo-pages/${r.id}/edit`}
              title="Click to edit this page"
              style={{ fontWeight: 600, color: "#0f766e", fontSize: 14, textDecoration: "none" }}
            >
              {r.h1Title}
            </Link>
            {r.heroBadge && (
              <div style={{ fontSize: 11, color: "#0d9488", fontWeight: 500, marginTop: 2 }}>
                {r.heroBadge}
              </div>
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
      sortable: false,
      render: (r) => (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
          <a
            href={`/services/${r.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View live page in new tab"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 10px",
              background: "#eff6ff",
              color: "#2563eb",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid #bfdbfe",
            }}
          >
            <Eye size={13} />
            <span>View</span>
            <ExternalLink size={11} />
          </a>

          <Link
            href={`/admin/seo-pages/${r.id}/edit`}
            title="Edit SEO page content and metadata"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 10px",
              background: "#fef3c7",
              color: "#b45309",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid #fde68a",
            }}
          >
            <Edit2 size={13} />
            <span>Edit</span>
          </Link>

          <button
            type="button"
            title="Delete page"
            onClick={() => setDeleteTarget(r)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 10px",
              background: "#fee2e2",
              color: "#dc2626",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              border: "1px solid #fecaca",
              cursor: "pointer",
            }}
          >
            <Trash2 size={13} />
            <span>Delete</span>
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="adt-btn-save"
            style={{
              background: "#0284c7",
              borderColor: "#0284c7",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <UploadCloud size={16} /> Import SEO Page
          </button>
          <Link href="/admin/seo-pages/new" className="adt-btn-save" style={{ textDecoration: "none" }}>
            <Plus size={15} /> Add SEO Page
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="adt-content-card">
        <DataTable
          columns={columns}
          rows={rows}
          searchKeys={["h1Title", "slug", "metaTitle", "keywords", "heroBadge"]}
        />
      </div>

      {/* Document Import Modal */}
      {importModalOpen && (
        <DocumentImportModal
          isOpen={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          doctorsList={doctorsList}
          allPages={allPages}
        />
      )}

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
