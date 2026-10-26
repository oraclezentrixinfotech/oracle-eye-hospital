import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAdmin()) return unauthorized();

  try {
    const doctors = await prisma.doctor.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(doctors);
  } catch (err) {
    console.error("Doctors API error:", err?.message || err);
    return NextResponse.json({ error: "Failed to fetch doctors." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!isAdmin()) return unauthorized();

  try {
    const body = await req.json();
    const {
      name,
      role,
      qualification,
      image,
      bio,
      badgeText,
      profileHref,
      sortOrder,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Doctor name is required." }, { status: 400 });
    }

    const doctor = await prisma.doctor.create({
      data: {
        name: name.trim(),
        role: role ? role.trim() : "Ophthalmologist",
        qualification: qualification ? qualification.trim() : null,
        image: image ? image.trim() : null,
        bio: bio ? bio.trim() : null,
        badgeText: badgeText ? badgeText.trim() : null,
        profileHref: profileHref ? profileHref.trim() : null,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
        active: true,
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (err) {
    console.error("Create Doctor API error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to create doctor: " + (err?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
