import bcrypt from "bcrypt";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const COOKIE_NAME = "oeh_admin";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET must be set (16+ characters)");
  return s;
}

const sign = (v) => crypto.createHmac("sha256", secret()).update(v).digest("hex");

export function createToken() {
  const exp = String(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(exp));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}

export async function checkCredentials(email, password) {
  if (!email || !password) return false;
  const normalizedEmail = String(email).toLowerCase().trim();
  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.active || user.role !== "ADMIN") return false;
    return bcrypt.compare(String(password), user.passwordHash);
  } catch {
    return false;
  }
}

export function isAdmin() {
  try {
    return verifyToken(cookies().get(COOKIE_NAME)?.value);
  } catch {
    return false;
  }
}

// Use at the top of every /api/admin/* handler
export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
