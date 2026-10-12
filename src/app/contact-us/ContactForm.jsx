"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "", website: "" });
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState("done");
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  }

  if (state === "done") return <p className="rounded-xl bg-mist p-6" role="status" data-aos="fade-up">Message sent. We will get back to you soon.</p>;

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">Name<input className="field mt-1" required value={form.name} onChange={set("name")} /></label>
        <label className="block text-sm font-medium">Phone<input className="field mt-1" inputMode="tel" value={form.phone} onChange={set("phone")} /></label>
        <label className="block text-sm font-medium">Email<input className="field mt-1" type="email" value={form.email} onChange={set("email")} /></label>
        <label className="block text-sm font-medium">Subject<input className="field mt-1" value={form.subject} onChange={set("subject")} /></label>
      </div>
      <label className="block text-sm font-medium">Message<textarea className="field mt-1" rows={4} required value={form.message} onChange={set("message")} /></label>
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" name="website" value={form.website} onChange={set("website")} />
      {state === "error" && <p className="text-sm text-red-700" role="alert" data-aos="fade-up">{error}</p>}
      <button className="btn btn-dark" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</button>
    </form>
  );
}
