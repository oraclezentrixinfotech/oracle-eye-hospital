import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

export function checkCredentials(email, password) {
  const realEmail = process.env.ADMIN_EMAIL || "";
  const realPassword = process.env.ADMIN_PASSWORD || "";
  if (!realEmail || !realPassword || !email || !password) return false;
  
  // Timing safe comparison for both email and password
  const h = (s) => crypto.createHash("sha256").update(String(s)).digest();
  const emailMatch = crypto.timingSafeEqual(h(email.toLowerCase().trim()), h(realEmail.toLowerCase().trim()));
  const passMatch = crypto.timingSafeEqual(h(password), h(realPassword));
  
  return emailMatch && passMatch;
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
