"use client";
import { useState, useMemo, useEffect } from "react";
import { ChevronUp, ChevronDown, Edit2, Trash2 } from "lucide-react";
import "./datatable.css";

function columnClassName(key) {
  return `adt-col-${String(key).toLowerCase().replace(/[^a-z0-9_-]+/g, "-")}`;
}

export default function DataTable({ columns, rows, searchKeys, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Reset page on search or entries change
  useEffect(() => { setPage(1); }, [search, entries]);

  // Filter
  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(row =>
      (searchKeys || columns.map(c => c.key)).some(k => {
        const v = row[k];
        return v != null && String(v).toLowerCase().includes(q);
      })
    );
  }, [rows, search, columns, searchKeys]);

  // Sort
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

  // Paginate
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / entries));
  const safePage = Math.min(page, totalPages);
  const sliced = sorted.slice((safePage - 1) * entries, safePage * entries);

  function handleSort(key) {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  }

  // Build page number array (max 5 around current)
  const pageNums = useMemo(() => {
    const pages = [];
    const start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [safePage, totalPages]);

  const from = total === 0 ? 0 : (safePage - 1) * entries + 1;
  const to = Math.min(safePage * entries, total);

  return (
    <div className="adt-root">
      {/* Top controls */}
      <div className="adt-controls">
        <div className="adt-entries">
          <label>
            Show{" "}
            <select value={entries} onChange={e => setEntries(Number(e.target.value))}>
              {[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}
            </select>
            {" "}entries
          </label>
        </div>
        <div className="adt-search">
          <label>
            Search:{" "}
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="adt-search-input"
            />
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="adt-table-wrap">
        <table className="adt-table adt-data-table">
          <thead>
            <tr>
              <th className="adt-th adt-th-sr">Sr. No.</th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`adt-th ${columnClassName(col.key)} ${col.sortable !== false ? "adt-sortable" : ""}`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <span className="adt-th-inner">
                    {col.label}
                    {col.sortable !== false && (
                      <span className="adt-sort-icons">
                        <ChevronUp
                          size={11}
                          className={sortKey === col.key && sortAsc ? "adt-sort-active" : ""}
                        />
                        <ChevronDown
                          size={11}
                          className={sortKey === col.key && !sortAsc ? "adt-sort-active" : ""}
                        />
                      </span>
                    )}
                  </span>
                </th>
              ))}
              {(onEdit || onDelete) && <th className="adt-th adt-col-action">Action</th>}
            </tr>
          </thead>
          <tbody>
            {sliced.length === 0 ? (
              <tr>
                <td
                  className="adt-empty"
                  colSpan={columns.length + 1 + (onEdit || onDelete ? 1 : 0)}
                >
                  No matching records found
                </td>
              </tr>
            ) : sliced.map((row, idx) => (
              <tr key={row.id ?? idx} className="adt-tr">
                <td className="adt-td adt-td-sr">{from + idx}</td>
                {columns.map(col => (
                  <td key={col.key} className={`adt-td ${columnClassName(col.key)}`}>
                    {col.render ? col.render(row) : (row[col.key] ?? "—")}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="adt-td adt-actions adt-col-action">
                    {onEdit && (
                      <button className="adt-btn-edit" onClick={() => onEdit(row)}>
                        <Edit2 size={13} /> Edit
                      </button>
                    )}
                    {onDelete && (
                      <button className="adt-btn-delete" onClick={() => onDelete(row)}>
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom info + pagination */}
      <div className="adt-bottom">
        <div className="adt-info">
          Showing {from} to {to} of {total} entries
        </div>
        <div className="adt-pagination">
          <button
            className="adt-page-btn"
            disabled={safePage === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          {pageNums.map(n => (
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
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
