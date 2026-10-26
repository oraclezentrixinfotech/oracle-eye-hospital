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
