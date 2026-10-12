"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, MessageCircle, Mail, MapPin, Clock, Save, Loader2 } from "lucide-react";
import { toast } from "../components/Toast";
import "../admin.css";
import "../components/datatable.css";

function FacebookIcon({ size = 14, color = "#1877f2" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 14, color = "#e4405f" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function SettingsClient({ initialSettings }) {
  const router = useRouter();
  const [form, setForm] = useState({
    phone: initialSettings?.phone || "",
    whatsapp: initialSettings?.whatsapp || "",
    email: initialSettings?.email || "",
    address: initialSettings?.address || "",
    working_hours: initialSettings?.working_hours || "",
    facebook: initialSettings?.facebook || "",
    instagram: initialSettings?.instagram || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      toast("Website settings saved successfully!", "success");
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to save settings");
      toast(err.message || "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* ── Header Card ── */}
      <div className="adt-header-card">
        <div>
          <h2 className="adt-header-title">Website Settings</h2>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>
            Manage public hospital contact info, working hours, and social media links.
          </p>
        </div>
      </div>

      {/* ── Form Card ── */}
      <div className="adt-content-card" style={{ maxWidth: 880 }}>
        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "4px",
              fontSize: "13px",
              marginBottom: "18px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section: Contact Details */}
          <h3 className="adt-section-label">Hospital Contact Information</h3>

          <div className="adt-form-row adt-form-row-2">
            <div className="adt-field">
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={14} color="#4b5563" /> Phone Number *
              </label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+91 8006803111"
              />
              <span style={{ fontSize: "11px", color: "#6b7280" }}>Main hospital contact number displayed in header & footer</span>
            </div>

            <div className="adt-field">
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MessageCircle size={14} color="#4b5563" /> WhatsApp Number
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="+91 8006803111"
              />
              <span style={{ fontSize: "11px", color: "#6b7280" }}>WhatsApp chat number for floating chat widgets</span>
            </div>
          </div>

          <div className="adt-form-row adt-form-row-2">
            <div className="adt-field">
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={14} color="#4b5563" /> Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="oracleeyehospital@gmail.com"
              />
            </div>

            <div className="adt-field">
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={14} color="#4b5563" /> Working Hours
              </label>
              <input
                type="text"
                value={form.working_hours}
                onChange={(e) => handleChange("working_hours", e.target.value)}
                placeholder="Mon – Sat, 10:00 AM – 8:00 PM"
              />
            </div>
          </div>

          <div className="adt-field" style={{ marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={14} color="#4b5563" /> Hospital Address *
            </label>
            <textarea
              rows={2}
              required
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="491, Hi-Street, Near TDI City, Parampara, MDA, Moradabad, Uttar Pradesh 244001, India"
            />
          </div>

          {/* Section: Social Media */}
          <h3 className="adt-section-label" style={{ marginTop: 28 }}>Social Media Links</h3>

          <div className="adt-form-row adt-form-row-2">
            <div className="adt-field">
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FacebookIcon size={14} color="#1877f2" /> Facebook Page URL
              </label>
              <input
                type="url"
                value={form.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
                placeholder="https://www.facebook.com/oracleeyehospital/"
              />
            </div>

            <div className="adt-field">
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <InstagramIcon size={14} color="#e4405f" /> Instagram Profile URL
              </label>
              <input
                type="url"
                value={form.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                placeholder="https://www.instagram.com/oracleeyehospital/"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="adt-form-actions" style={{ marginTop: 24 }}>
            <button type="submit" className="adt-btn-save" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={15} className="adt-spinner" /> Saving Settings...
                </>
              ) : (
                <>
                  <Save size={15} /> Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
