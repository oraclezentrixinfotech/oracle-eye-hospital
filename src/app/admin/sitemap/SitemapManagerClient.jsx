"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  RefreshCw,
  ExternalLink,
  Edit2,
  Trash2,
  Globe,
  Database,
  FileCode,
  CheckCircle2,
  Search,
  Calendar,
  Layers,
  Info,
} from "lucide-react";
import { toast } from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import "../admin.css";

const CHANGEFREQ_OPTIONS = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
const PRIORITY_OPTIONS = ["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"];

export default function SitemapManagerClient() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ siteUrl: "", customEntries: [], dbSeoPages: [] });
  const [activeTab, setActiveTab] = useState("custom"); // "custom" | "database" | "overview"
  const [search, setSearch] = useState("");

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null => add mode
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    loc: "",
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "weekly",
    priority: "0.8",
  });

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch data
  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sitemap");
      const json = await res.json();
      if (!res.ok) {
        toast(json.error || "Failed to load sitemap entries", "error");
      } else {
        setData(json);
      }
    } catch (err) {
      toast("Network error loading sitemap: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleOpenAdd() {
    setEditingItem(null);
    setForm({
      loc: "",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: "0.8",
    });
    setModalOpen(true);
  }

  function handleOpenEdit(entry) {
    setEditingItem(entry);
    setForm({
      loc: entry.loc,
      lastmod: entry.lastmod || new Date().toISOString().split("T")[0],
      changefreq: entry.changefreq || "weekly",
      priority: entry.priority || "0.8",
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.loc.trim()) {
      toast("Please enter a URL path or full URL", "error");
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (editingItem) {
        res = await fetch("/api/admin/sitemap", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetLoc: editingItem.loc,
            ...form,
          }),
        });
      } else {
        res = await fetch("/api/admin/sitemap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      const resJson = await res.json();
      if (!res.ok) {
        toast(resJson.error || "Save operation failed", "error");
      } else {
        toast(
          editingItem ? "Sitemap URL updated successfully!" : "New URL added to sitemap!",
          "success"
        );
        setModalOpen(false);
        loadData();
      }
    } catch (err) {
      toast("Failed to save: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/sitemap?loc=${encodeURIComponent(deleteTarget.loc)}`, {
        method: "DELETE",
      });
      const resJson = await res.json();
      if (!res.ok) {
        toast(resJson.error || "Could not delete URL", "error");
      } else {
        toast("URL removed from sitemap successfully.", "success");
        setDeleteTarget(null);
        loadData();
      }
    } catch (err) {
      toast("Network error deleting URL: " + err.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  // Filtered lists
  const filteredCustom = (data.customEntries || []).filter((e) =>
    e.loc.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDb = (data.dbSeoPages || []).filter(
    (e) =>
      e.slug.toLowerCase().includes(search.toLowerCase()) ||
      (e.h1Title && e.h1Title.toLowerCase().includes(search.toLowerCase())) ||
      e.fullUrl.toLowerCase().includes(search.toLowerCase())
  );

  const totalEntries = (data.customEntries?.length || 0) + (data.dbSeoPages?.length || 0);

  return (
    <>
      {/* Header Card */}
      <div className="adt-header-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 className="adt-header-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Globe size={22} color="#0d9488" />
            <span>Manage XML Sitemap</span>
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#64748b" }}>
            Add, update, or remove URLs included in <code>https://www.oracleeyehospital.com/sitemap.xml</code>.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="adt-btn-save"
            style={{
              background: "#475569",
              borderColor: "#475569",
              cursor: loading ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <RefreshCw size={14} className={loading ? "adt-spin" : ""} /> Refresh
          </button>

          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="adt-btn-save"
            style={{
              background: "#0f766e",
              borderColor: "#0f766e",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ExternalLink size={14} /> View Live XML
          </a>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="adt-btn-save"
            style={{
              background: "#0284c7",
              borderColor: "#0284c7",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Plus size={15} /> Add Sitemap URL
          </button>
        </div>
      </div>

      {/* Info Stats Banner */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "16px 20px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: "#ecfdf5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#059669",
            }}
          >
            <Globe size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
              Total Sitemap URLs
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>{totalEntries}</div>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "16px 20px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563eb",
            }}
          >
            <FileCode size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
              Custom / Code URLs
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>
              {data.customEntries?.length || 0}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "16px 20px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: "#f0fdfa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0d9488",
            }}
          >
            <Database size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
              DB Published Pages
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>
              {data.dbSeoPages?.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs & Table Card */}
      <div className="adt-content-card" style={{ padding: 0 }}>
        {/* Navigation Tabs & Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            padding: "14px 20px",
            borderBottom: "1px solid #e2e8f0",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              style={{
                padding: "8px 16px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                background: activeTab === "custom" ? "#0f766e" : "#f1f5f9",
                color: activeTab === "custom" ? "#ffffff" : "#475569",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              <FileCode size={15} />
              <span>Custom URLs ({data.customEntries?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("database")}
              style={{
                padding: "8px 16px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                background: activeTab === "database" ? "#0f766e" : "#f1f5f9",
                color: activeTab === "database" ? "#ffffff" : "#475569",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              <Database size={15} />
              <span>Database SEO Pages ({data.dbSeoPages?.length || 0})</span>
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: "relative", minWidth: 260 }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Filter by URL or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px 7px 32px",
                borderRadius: 6,
                border: "1px solid #cbd5e1",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Tab 1: Custom / Code-based URLs Table */}
        {activeTab === "custom" && (
          <div style={{ overflowX: "auto" }}>
            <table className="adt-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", textAlign: "left", fontSize: 12, color: "#64748b" }}>
                  <th style={{ padding: "12px 18px", width: "45%" }}>URL Location (Loc)</th>
                  <th style={{ padding: "12px 14px", width: "15%" }}>Last Modified</th>
                  <th style={{ padding: "12px 14px", width: "12%" }}>Change Frequency</th>
                  <th style={{ padding: "12px 14px", width: "10%" }}>Priority</th>
                  <th style={{ padding: "12px 18px", width: "18%", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustom.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: 36, color: "#94a3b8" }}>
                      No custom sitemap URLs found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredCustom.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <a
                            href={item.loc}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: 13.5,
                              fontWeight: 600,
                              color: "#0284c7",
                              textDecoration: "none",
                              wordBreak: "break-all",
                            }}
                          >
                            {item.loc}
                          </a>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "#475569" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <Calendar size={13} color="#94a3b8" />
                          {item.lastmod}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13 }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 4,
                            background: "#f1f5f9",
                            fontSize: 12,
                            fontWeight: 500,
                            color: "#334155",
                          }}
                        >
                          {item.changefreq}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13 }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 999,
                            background: Number(item.priority) >= 0.8 ? "#ecfdf5" : "#f1f5f9",
                            color: Number(item.priority) >= 0.8 ? "#059669" : "#64748b",
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit URL & settings"
                            className="adt-action-btn"
                          >
                            <Edit2 size={15} color="#0f766e" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            title="Delete URL from sitemap"
                            className="adt-action-btn adt-action-delete"
                          >
                            <Trash2 size={15} color="#dc2626" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Database Published SEO Pages Table */}
        {activeTab === "database" && (
          <div style={{ overflowX: "auto" }}>
            <table className="adt-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", textAlign: "left", fontSize: 12, color: "#64748b" }}>
                  <th style={{ padding: "12px 18px", width: "40%" }}>Page Title &amp; Slug</th>
                  <th style={{ padding: "12px 18px", width: "35%" }}>Auto-Generated Live URL</th>
                  <th style={{ padding: "12px 14px", width: "15%" }}>Last Modified</th>
                  <th style={{ padding: "12px 14px", width: "10%", textAlign: "right" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDb.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: 36, color: "#94a3b8" }}>
                      No published DB pages found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredDb.map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 18px" }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: "#1e293b" }}>
                          {p.h1Title || p.slug}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>
                          /{p.slug}
                        </div>
                      </td>
                      <td style={{ padding: "12px 18px" }}>
                        <a
                          href={p.fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 13,
                            color: "#0284c7",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            wordBreak: "break-all",
                          }}
                        >
                          <span>{p.fullUrl}</span>
                          <ExternalLink size={12} />
                        </a>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "#475569" }}>
                        {p.lastmod}
                      </td>
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 999,
                            background: "#ecfdf5",
                            color: "#047857",
                            fontWeight: 700,
                            fontSize: 11.5,
                          }}
                        >
                          Auto Sync
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit URL Modal */}
      {modalOpen && (
        <div className="adt-modal-overlay" onClick={() => !submitting && setModalOpen(false)}>
          <div
            className="adt-modal"
            style={{ maxWidth: 520, width: "95%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                {editingItem ? "Edit Sitemap URL" : "Add New URL to Sitemap"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: 20 }}>
              {/* URL Location */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  URL Path or Full Link <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /why-getting-a-second-opinion or https://..."
                  value={form.loc}
                  onChange={(e) => setForm({ ...form, loc: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 4 }}>
                  Tip: Relative paths like <code>/about-us</code> will automatically prefix with{" "}
                  <code>{data.siteUrl || "https://www.oracleeyehospital.com"}</code>.
                </div>
              </div>

              {/* Changefreq & Priority */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Change Frequency
                  </label>
                  <select
                    value={form.changefreq}
                    onChange={(e) => setForm({ ...form, changefreq: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 6,
                      border: "1px solid #cbd5e1",
                      fontSize: 13,
                      boxSizing: "border-box",
                      background: "#ffffff",
                    }}
                  >
                    {CHANGEFREQ_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Priority (0.1 to 1.0)
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 6,
                      border: "1px solid #cbd5e1",
                      fontSize: 13,
                      boxSizing: "border-box",
                      background: "#ffffff",
                    }}
                  >
                    {PRIORITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lastmod */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Last Modified Date
                </label>
                <input
                  type="date"
                  value={form.lastmod}
                  onChange={(e) => setForm({ ...form, lastmod: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  paddingTop: 14,
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#475569",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 6,
                    border: "none",
                    background: "#0d9488",
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: submitting ? "wait" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {submitting ? "Saving..." : editingItem ? "Update URL" : "Add to Sitemap"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          message={`Are you sure you want to remove "${deleteTarget.loc}" from the sitemap?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}
    </>
  );
}
