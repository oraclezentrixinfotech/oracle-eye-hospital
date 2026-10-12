"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import "./login.css";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ email, password }) 
    });
    
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError((await res.json().catch(() => ({}))).error || "Invalid email or password.");
      setBusy(false);
    }
  }

  return (
    <div className="al-container">
      <div className="al-card">
        
        <div className="al-header">
          <img 
            src="/uploads/logos/232296ca-9c85-445b-b965-033a97fe7008.png" 
            alt="Oracle Eye Hospital" 
            className="al-logo"
          />
          <h1 className="al-title">Admin Login</h1>
          <p className="al-subtitle">
            Sign in to manage your website
          </p>
        </div>

        {error && (
          <div className="al-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="al-form-group">
            <label htmlFor="email" className="al-label">
              Email
            </label>
            <div className="al-input-wrapper">
              <div className="al-input-icon-left">
                <Mail size={20} />
              </div>
              <input
                id="email"
                type="email"
                required
                autoFocus
                autoComplete="username"
                aria-label="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="al-input"
                placeholder="Enter admin email"
              />
            </div>
          </div>

          <div className="al-form-group">
            <label htmlFor="password" className="al-label">
              Password
            </label>
            <div className="al-input-wrapper">
              <div className="al-input-icon-left">
                <Lock size={20} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                aria-label="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="al-input"
                placeholder="Enter admin password"
              />
              <button
                type="button"
                className="al-input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="al-button"
          >
            {busy ? (
              <>
                <Loader2 size={20} className="al-spinner" />
                Signing in...
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <div className="al-footer">
          <Link 
            href="/" 
            className="al-link"
          >
            <ArrowLeft size={16} />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
