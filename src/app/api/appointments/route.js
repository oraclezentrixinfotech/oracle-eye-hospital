import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clean, cleanMultiline, digits, isEmail } from "@/lib/validate";
import nodemailer from "nodemailer";

const NOTIFICATION_EMAIL = process.env.APPOINTMENT_NOTIFICATION_EMAIL || "orcal.zentrixinfotech@gmail.com";

async function sendAppointmentNotification(appointment) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn("Appointment saved, but email notification is not configured (missing SMTP settings).");
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: NOTIFICATION_EMAIL,
    replyTo: appointment.email || undefined,
    subject: `New appointment request - ${appointment.name}`,
    text: [
      "New appointment request received",
      `Name: ${appointment.name}`,
      `Phone: ${appointment.phone}`,
      `Email: ${appointment.email || "Not provided"}`,
      `Doctor: ${appointment.doctor || "Any available doctor"}`,
      `Service: ${appointment.service || "Not specified"}`,
      `Preferred date: ${appointment.preferredDate || "Not specified"}`,
      `Message: ${appointment.message || "—"}`,
    ].join("\n"),
  });
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ ok: true }); // honeypot: pretend success to bots

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20);
  const email = clean(body.email, 120);

  if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (digits(phone).length < 10) return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  if (email && !isEmail(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  let preferredDate = null;
  if (body.preferredDate) {
    const d = new Date(body.preferredDate);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (Number.isNaN(d.getTime()) || d < startOfToday)
      return NextResponse.json({ error: "Please choose today or a future date." }, { status: 400 });
    preferredDate = d;
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        name,
        phone,
        email: email || null,
        doctor: clean(body.doctor, 80) || null,
        service: clean(body.service, 80) || null,
        preferredDate,
        message: cleanMultiline(body.message, 1000) || null,
      },
    });
    try {
      await sendAppointmentNotification(appointment);
    } catch (emailError) {
      console.error("appointment notification failed:", emailError);
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("appointment create failed:", e);
    return NextResponse.json({ error: "Could not save your request. Please call us instead." }, { status: 500 });
  }
}
