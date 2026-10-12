import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clean, cleanMultiline, isEmail } from "@/lib/validate";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true });

  const name = clean(body.name, 80);
  const email = clean(body.email, 120);
  const message = cleanMultiline(body.message, 2000);

  if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (message.length < 5) return NextResponse.json({ error: "Please write a message." }, { status: 400 });
  if (email && !isEmail(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  try {
    await prisma.enquiry.create({
      data: { name, phone: clean(body.phone, 20) || null, email: email || null, subject: clean(body.subject, 120) || null, message },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("enquiry create failed:", e);
    return NextResponse.json({ error: "Could not send your message. Please call us instead." }, { status: 500 });
  }
}
