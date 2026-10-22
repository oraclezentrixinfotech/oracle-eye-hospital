"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ExternalLink, Edit2, Trash2, Eye, UploadCloud, Download } from "lucide-react";
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

function TitleCell({ r }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (r.h1Title || "").length > 55;

  return (
    <div style={{ maxWidth: 320, minWidth: 180 }}>
      <div
        style={{
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 2,
          WebkitBoxOrient: "vertical",
          overflow: expanded ? "visible" : "hidden",
          lineHeight: "1.4",
        }}
      >
        <Link
          href={`/admin/seo-pages/${r.id}/edit`}
          title={`Click to edit: ${r.h1Title}`}
          style={{ fontWeight: 600, color: "#0f766e", fontSize: 13.5, textDecoration: "none" }}
        >
          {r.h1Title}
        </Link>
      </div>

      {isLong && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#0284c7",
            cursor: "pointer",
            padding: 0,
            fontSize: 11,
            fontWeight: 600,
            marginTop: 2,
            display: "inline-block",
          }}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {r.heroBadge && (
        <div
          title={r.heroBadge}
          style={{
            fontSize: 11,
            color: "#0d9488",
            fontWeight: 500,
            marginTop: 3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 280,
          }}
        >
          {r.heroBadge}
        </div>
      )}
    </div>
  );
}

function SlugCell({ slug }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (slug || "").length > 32;

  return (
    <div style={{ maxWidth: 220, minWidth: 140 }}>
      <div
        style={{
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 2,
          WebkitBoxOrient: "vertical",
          overflow: expanded ? "visible" : "hidden",
          lineHeight: "1.4",
          wordBreak: "break-all",
          overflowWrap: "anywhere",
        }}
      >
        <code
          style={{
            fontSize: 11.5,
            color: "#374151",
            background: "#f3f4f6",
            padding: "2px 6px",
            borderRadius: 4,
            display: "inline-block",
            wordBreak: "break-all",
            overflowWrap: "anywhere",
          }}
        >
          {slug}
        </code>
      </div>

      {isLong && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#0284c7",
            cursor: "pointer",
            padding: 0,
            fontSize: 11,
            fontWeight: 600,
            marginTop: 2,
            display: "inline-block",
          }}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

function ActionButtons({ r, onOpenDelete }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
      <a
        href={`/services/${r.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        title="View live page"
        className="adt-action-btn adt-action-view"
      >
        <Eye size={15} color="#2563eb" strokeWidth={2} />
      </a>

      <Link
        href={`/admin/seo-pages/${r.id}/edit`}
        title="Edit page"
        className="adt-action-btn adt-action-edit"
      >
        <Edit2 size={14} color="#b45309" strokeWidth={2} />
      </Link>

      <button
        type="button"
        title="Delete page"
        onClick={() => onOpenDelete(r)}
        className="adt-action-btn adt-action-delete"
      >
        <Trash2 size={15} color="#dc2626" strokeWidth={2} />
      </button>
    </div>
  );
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
      key: "heroImage",
      label: "Image",
      sortable: false,
      render: (r) =>
        r.heroImage ? (
          <img
            src={r.heroImage}
            alt=""
            style={{
              width: 48,
              height: 36,
              objectFit: "cover",
              borderRadius: 4,
              display: "block",
              border: "1px solid #e2e8f0",
            }}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 36,
              borderRadius: 4,
              background: "#f1f5f9",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 600,
              border: "1px dashed #cbd5e1",
            }}
          >
            No img
          </div>
        ),
    },
    {
      key: "h1Title",
      label: "Title",
      sortable: true,
      render: (r) => <TitleCell r={r} />,
    },
    {
      key: "slug",
      label: "Slug",
      sortable: true,
      render: (r) => <SlugCell slug={r.slug} />,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
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
      sortable: true,
      render: (r) => (
        <span style={{ color: "#6b7280", fontSize: 13, whiteSpace: "nowrap" }}>
          {formatDate(r.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (r) => <ActionButtons r={r} onOpenDelete={setDeleteTarget} />,
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
          <a
            href="/api/admin/seo-pages/download-template"
            download="seo-page-templates.zip"
            title="Download Banner.jsx, Content.jsx & page.jsx templates bundle (.zip)"
            className="adt-btn-save"
            style={{
              background: "#475569",
              borderColor: "#475569",
              color: "#ffffff",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
            }}
          >
            <Download size={15} /> Download Template
          </a>
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
