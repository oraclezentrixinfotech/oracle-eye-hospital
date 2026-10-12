"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Download, X, Calendar, User, Phone, Mail, Stethoscope, Clock, ChevronUp, ChevronDown } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "../components/Toast";
import "../admin.css";
import "../components/datatable.css";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

function formatDate(isoStr) {
  if (!isoStr) return "—";
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoStr;
  }
}

function formatDateOnly(isoStr) {
  if (!isoStr) return "—";
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoStr;
  }
}

export default function AppointmentsClient({ initialRows }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows || []);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortAsc, setSortAsc] = useState(false);

  // View modal state
  const [viewTarget, setViewTarget] = useState(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Status updating map: { [id]: boolean }
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    setRows(initialRows || []);
  }, [initialRows]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, entries]);

  // ── Status change handler ─────────────────────────────────────────
  async function handleStatusChange(id, newStatus) {
    const prevRows = [...rows];
    // Optimistic update
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    setUpdatingStatus((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update status");
      }

      toast(`Appointment status changed to ${newStatus}`, "success");
      router.refresh();
    } catch (err) {
      // Revert on error
      setRows(prevRows);
      toast(err.message || "Failed to update status", "error");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [id]: false }));
    }
  }

  // ── Delete appointment ────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/appointments/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete appointment");
      }

      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      toast("Appointment deleted successfully", "success");
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      toast(err.message || "Failed to delete appointment", "error");
    } finally {
      setDeleting(false);
    }
  }

  // ── CSV Export ────────────────────────────────────────────────────
  function exportCSV() {
    if (rows.length === 0) {
      toast("No appointments to export", "info");
      return;
    }

    const headers = [
      "ID",
      "Received Date",
      "Name",
      "Phone",
      "Email",
      "Doctor",
      "Service",
      "Preferred Date",
      "Status",
      "Message",
    ];

    const csvRows = [headers.join(",")];

    rows.forEach((row) => {
      const escape = (val) => {
        if (val == null) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rowValues = [
        escape(row.id),
        escape(row.createdAt ? formatDate(row.createdAt) : ""),
        escape(row.name),
        escape(row.phone),
        escape(row.email || ""),
        escape(row.doctor || ""),
        escape(row.service || ""),
        escape(row.preferredDate ? formatDateOnly(row.preferredDate) : ""),
        escape(row.status),
        escape(row.message || ""),
      ];

      csvRows.push(rowValues.join(","));
    });

    const csvContent = csvRows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `appointments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast("Appointments CSV downloaded", "success");
  }

  // ── Filter & Search ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    return rows.filter((row) => {
      // Status filter
      if (statusFilter !== "ALL" && row.status !== statusFilter) {
        return false;
      }
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          (row.name && row.name.toLowerCase().includes(q)) ||
          (row.phone && row.phone.toLowerCase().includes(q)) ||
          (row.email && row.email.toLowerCase().includes(q)) ||
          (row.doctor && row.doctor.toLowerCase().includes(q)) ||
          (row.service && row.service.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [rows, statusFilter, search]);

  // ── Sort ──────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortAsc]);

  function handleSort(key) {
    if (sortKey === key) setSortAsc((prev) => !prev);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  // ── Pagination ────────────────────────────────────────────────────
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / entries));
  const safePage = Math.min(page, totalPages);
  const sliced = sorted.slice((safePage - 1) * entries, safePage * entries);
  const from = total === 0 ? 0 : (safePage - 1) * entries + 1;
  const to = Math.min(safePage * entries, total);

  const pageNums = useMemo(() => {
    const pages = [];
    const start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [safePage, totalPages]);

  return (
    <>
      {/* ── Top Header Card ── */}
      <div className="adt-header-card adt-appointments-header">
        <h2 className="adt-header-title">Manage Appointments</h2>
        <div className="adt-appointments-header-actions">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="adt-appointments-filter"
          >
            <option value="ALL">All Statuses ({rows.length})</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st} ({rows.filter((r) => r.status === st).length})
              </option>
            ))}
          </select>

          {/* Export CSV Button */}
          <button className="adt-btn-export" onClick={exportCSV}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="adt-content-card adt-appointments-content">
        {/* Controls */}
        <div className="adt-controls">
          <div className="adt-entries">
            <label>
              Show{" "}
              <select value={entries} onChange={(e) => setEntries(Number(e.target.value))}>
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>{" "}
              entries
            </label>
          </div>
          <div className="adt-search">
            <label>
              Search:{" "}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, doctor..."
                className="adt-search-input"
              />
            </label>
          </div>
        </div>

        {/* Table */}
        <div className="adt-table-wrap">
          <table className="adt-table adt-appointments-table">
            <thead>
              <tr>
                <th className="adt-th adt-th-sr adt-appointment-col-sr">Sr. No.</th>
                <th className="adt-th adt-sortable adt-appointment-col-received" onClick={() => handleSort("createdAt")}>
                  <span className="adt-th-inner">
                    Received
                    <span className="adt-sort-icons">
                      <ChevronUp size={11} className={sortKey === "createdAt" && sortAsc ? "adt-sort-active" : ""} />
                      <ChevronDown size={11} className={sortKey === "createdAt" && !sortAsc ? "adt-sort-active" : ""} />
                    </span>
                  </span>
                </th>
                <th className="adt-th adt-sortable adt-appointment-col-person" onClick={() => handleSort("name")}>
                  <span className="adt-th-inner">
                    Name
                    <span className="adt-sort-icons">
                      <ChevronUp size={11} className={sortKey === "name" && sortAsc ? "adt-sort-active" : ""} />
                      <ChevronDown size={11} className={sortKey === "name" && !sortAsc ? "adt-sort-active" : ""} />
                    </span>
                  </span>
                </th>
                <th className="adt-th adt-appointment-col-phone">Phone</th>
                <th className="adt-th adt-appointment-col-care">Doctor / Service</th>
                <th className="adt-th adt-sortable adt-appointment-col-date" onClick={() => handleSort("preferredDate")}>
                  <span className="adt-th-inner">
                    Preferred Date
                    <span className="adt-sort-icons">
                      <ChevronUp size={11} className={sortKey === "preferredDate" && sortAsc ? "adt-sort-active" : ""} />
                      <ChevronDown size={11} className={sortKey === "preferredDate" && !sortAsc ? "adt-sort-active" : ""} />
                    </span>
                  </span>
                </th>
                <th className="adt-th adt-appointment-col-status">Status</th>
                <th className="adt-th adt-appointment-col-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {sliced.length === 0 ? (
                <tr>
                  <td className="adt-empty" colSpan={8}>
                    No appointments found
                  </td>
                </tr>
              ) : (
                sliced.map((row, idx) => (
                  <tr key={row.id} className="adt-tr">
                    <td className="adt-td adt-td-sr adt-appointment-col-sr">{from + idx}</td>
                    <td className="adt-td adt-appointment-received">
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="adt-td adt-appointment-person">
                      <strong className="adt-appointment-name">{row.name}</strong>
                      {row.email && (
                        <div className="adt-appointment-email">{row.email}</div>
                      )}
                    </td>
                    <td className="adt-td adt-appointment-phone">
                      <a href={`tel:${row.phone}`} className="adt-appointment-phone-link">
                        {row.phone}
                      </a>
                    </td>
                    <td className="adt-td adt-appointment-care">
                      {row.doctor ? (
                        <div>
                          <strong>{row.doctor}</strong>
                          {row.service && <div style={{ fontSize: "11px", color: "#6b7280" }}>{row.service}</div>}
                        </div>
                      ) : (
                        row.service || "—"
                      )}
                    </td>
                    <td className="adt-td adt-appointment-date">
                      {formatDateOnly(row.preferredDate)}
                    </td>
                    <td className="adt-td adt-appointment-status">
                      <select
                        value={row.status}
                        disabled={updatingStatus[row.id]}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                        className={`adt-select-status adt-select-status-${row.status}`}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="adt-td adt-actions adt-appointment-actions">
                      <button className="adt-btn-view" onClick={() => setViewTarget(row)} title="View full details">
                        <Eye size={13} /> View
                      </button>
                      <button className="adt-btn-delete" onClick={() => setDeleteTarget(row)} title="Delete appointment">
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div className="adt-bottom">
          <div className="adt-info">
            Showing {from} to {to} of {total} entries
          </div>
          <div className="adt-pagination">
            <button
              className="adt-page-btn"
              disabled={safePage === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            {pageNums.map((n) => (
              <button
                key={n}
                className={`adt-page-btn ${n === safePage ? "adt-page-active" : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="adt-page-btn"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── View Detail Modal ── */}
      {viewTarget && (
        <div className="adt-modal-overlay" onClick={() => setViewTarget(null)}>
          <div className="adt-form-modal adt-form-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="adt-form-modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, color: "#111827" }}>Appointment Details</h3>
              <button
                className="adt-form-modal-close"
                onClick={() => setViewTarget(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="adt-detail-grid">
              <div className="adt-detail-item">
                <span className="adt-detail-label">Patient Name</span>
                <span className="adt-detail-val" style={{ fontWeight: 600 }}>{viewTarget.name}</span>
              </div>
              <div className="adt-detail-item">
                <span className="adt-detail-label">Phone</span>
                <span className="adt-detail-val">
                  <a href={`tel:${viewTarget.phone}`} style={{ color: "#2563eb", textDecoration: "none" }}>
                    {viewTarget.phone}
                  </a>
                </span>
              </div>
              <div className="adt-detail-item">
                <span className="adt-detail-label">Email</span>
                <span className="adt-detail-val">{viewTarget.email || "—"}</span>
              </div>
              <div className="adt-detail-item">
                <span className="adt-detail-label">Doctor</span>
                <span className="adt-detail-val">{viewTarget.doctor || "Any / Not specified"}</span>
              </div>
              <div className="adt-detail-item">
                <span className="adt-detail-label">Service</span>
                <span className="adt-detail-val">{viewTarget.service || "—"}</span>
              </div>
              <div className="adt-detail-item">
                <span className="adt-detail-label">Preferred Date</span>
                <span className="adt-detail-val">{formatDateOnly(viewTarget.preferredDate)}</span>
              </div>
              <div className="adt-detail-item">
                <span className="adt-detail-label">Current Status</span>
                <span className="adt-detail-val">
                  <span className={`adt-badge adt-badge-${viewTarget.status?.toLowerCase()}`}>
                    {viewTarget.status}
                  </span>
                </span>
              </div>
              <div className="adt-detail-item">
                <span className="adt-detail-label">Received At</span>
                <span className="adt-detail-val">{formatDate(viewTarget.createdAt)}</span>
              </div>
              <div className="adt-detail-item adt-detail-full">
                <span className="adt-detail-label">Patient Message / Notes</span>
                <div className="adt-detail-msg-box">
                  {viewTarget.message || "No additional message provided."}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: 20 }}>
              <button
                type="button"
                className="adt-btn-cancel-form"
                onClick={() => setViewTarget(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Delete Modal ── */}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete appointment request from "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}
    </>
  );
}
