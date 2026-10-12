"use client";
import { useState, useCallback } from "react";
import "./datatable.css";

// Toast state manager — singleton pattern via module-level ref
let _setToasts = null;
let _id = 0;

export function toast(message, type = "success") {
  if (_setToasts) {
    const id = ++_id;
    _setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      _setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;

  const remove = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="adt-toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`adt-toast adt-toast-${t.type}`}>
          <span>{t.message}</span>
          <button className="adt-toast-close" onClick={() => remove(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
