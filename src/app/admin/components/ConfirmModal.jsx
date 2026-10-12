"use client";
import "./datatable.css";

export default function ConfirmModal({ message = "Are you sure you want to delete this?", onConfirm, onCancel }) {
  return (
    <div className="adt-modal-overlay" onClick={onCancel}>
      <div className="adt-modal" onClick={e => e.stopPropagation()}>
        <div className="adt-modal-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff5c7c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="adt-modal-title">Are you sure?</h3>
        <p className="adt-modal-msg">{message}</p>
        <div className="adt-modal-actions">
          <button className="adt-modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="adt-modal-confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
