import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";
import { digits, isEmail, clean } from "@/lib/validate";
import { getSettings } from "@/lib/settings";
import { revalidatePath } from "next/cache";

const ALLOWED_KEYS = [
  "phone",
  "whatsapp",
  "email",
  "address",
  "working_hours",
  "facebook",
  "instagram",
];

export async function GET() {
  if (!isAdmin()) return unauthorized();
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req) {
  if (!isAdmin()) return unauthorized();

  const body = await req.json().catch(() => ({}));

  const phone = clean(body.phone, 30);
  const email = clean(body.email, 120);
  const whatsapp = clean(body.whatsapp, 30);

  if (!phone || digits(phone).length < 10) {
    return NextResponse.json({ error: "Please enter a valid phone number (at least 10 digits)." }, { status: 400 });
  }

  if (!email || !isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const upserts = ALLOWED_KEYS.map((key) => {
      const val = body[key] != null ? String(body[key]).trim() : "";
      return prisma.setting.upsert({
        where: { key },
        update: { value: val },
        create: { key, value: val },
      });
    });

    await prisma.$transaction(upserts);

    // Revalidate public layouts & pages so latest settings reflect immediately
    revalidatePath("/", "layout");
    revalidatePath("/contact-us");
    revalidatePath("/overview");
    revalidatePath("/admin/settings");

    const updated = await getSettings();
    return NextResponse.json({ ok: true, settings: updated });
  } catch (err) {
    console.error("Failed to update settings:", err);
    return NextResponse.json({ error: "Failed to save settings." }, { status: 500 });
  }
}
