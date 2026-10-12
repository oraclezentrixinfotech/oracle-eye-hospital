import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export async function PUT(req, { params }) {
  if (!isAdmin()) return unauthorized();
  const { status } = await req.json().catch(() => ({}));
  if (!status || !STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  try {
    await prisma.appointment.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to update appointment status:", err);
    return NextResponse.json({ error: "Appointment not found or update failed" }, { status: 500 });
  }
}

export const PATCH = PUT;

export async function DELETE(_req, { params }) {
  if (!isAdmin()) return unauthorized();
  try {
    await prisma.appointment.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete appointment:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
