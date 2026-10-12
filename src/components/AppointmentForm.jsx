"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DOCTORS, SERVICES, SITE } from "@/lib/content";

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  doctor: "",
  service: "",
  preferredDate: "",
  message: "",
  website: "",
};

export default function AppointmentForm({ initialDoctor = "" }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    doctor: DOCTORS.some((doctor) => doctor.name === initialDoctor) ? initialDoctor : "",
  }));
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setState("sending");
    setError("");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setState("done");
      setForm(EMPTY);
    } catch (requestError) {
      setError(requestError.message);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="appointment-success" role="status">
        <h3>Appointment request received</h3>
        <p>Our team will call you to confirm your appointment. For anything urgent, call {SITE.helpline}.</p>
        <button type="button" className="btn btn-primary" onClick={() => setState("idle")}>Book another appointment</button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="appointment-request-form">
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="appointment-name">Full name <span aria-hidden="true">*</span></label>
          <input id="appointment-name" className="form-control" required value={form.name} onChange={set("name")} autoComplete="name" />
        </div>
        <div className="col-md-6">
          <label htmlFor="appointment-phone">Phone number <span aria-hidden="true">*</span></label>
          <input id="appointment-phone" className="form-control" required inputMode="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" />
        </div>
        <div className="col-md-6">
          <label htmlFor="appointment-email">Email address <small>(optional)</small></label>
          <input id="appointment-email" className="form-control" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
        </div>
        <div className="col-md-6">
          <label htmlFor="appointment-date">Preferred date</label>
          <input id="appointment-date" className="form-control" type="date" min={today} value={form.preferredDate} onChange={set("preferredDate")} />
        </div>
        <div className="col-md-6">
          <label htmlFor="appointment-doctor">Doctor</label>
          <select id="appointment-doctor" className="form-control" value={form.doctor} onChange={set("doctor")}>
            <option value="">Any available doctor</option>
            {DOCTORS.map((doctor) => <option key={doctor.slug} value={doctor.name}>{doctor.name}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="appointment-service">Service</label>
          <select id="appointment-service" className="form-control" value={form.service} onChange={set("service")}>
            <option value="">General eye check-up</option>
            {SERVICES.map((service) => <option key={service.slug} value={service.title}>{service.title}</option>)}
          </select>
        </div>
        <div className="col-12">
          <label htmlFor="appointment-message">Message <small>(optional)</small></label>
          <textarea id="appointment-message" className="form-control" rows={4} value={form.message} onChange={set("message")} />
        </div>
      </div>

      <input tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={form.website} onChange={set("website")} style={{ display: "none" }} />

      {state === "error" && <p className="appointment-form-error" role="alert">{error}</p>}

      <button className="btn btn-primary appointment-submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Book appointment"}
      </button>
    </form>
  );
}
