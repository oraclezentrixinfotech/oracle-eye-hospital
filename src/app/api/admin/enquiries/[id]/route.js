import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/auth";

export async function PUT(req, { params }) {
  if (!isAdmin()) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const isRead = typeof body.isRead === "boolean" ? body.isRead : true;

  try {
    await prisma.enquiry.update({
      where: { id: params.id },
      data: { isRead },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to update enquiry read status:", err);
    return NextResponse.json({ error: "Enquiry not found or update failed" }, { status: 500 });
  }
}

export const PATCH = PUT;

export async function DELETE(_req, { params }) {
  if (!isAdmin()) return unauthorized();
  try {
    await prisma.enquiry.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete enquiry:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
