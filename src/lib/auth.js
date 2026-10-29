import bcrypt from "bcrypt";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import fs from "fs";
import path from "path";

function ensureEnvLoaded() {
  if (process.env.AUTH_SECRET && process.env.ADMIN_EMAIL) return;
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          process.env[key] = val;
        }
      });
    }
  } catch (err) {
    // ignore
  }
}

ensureEnvLoaded();

export const COOKIE_NAME = "oeh_admin";

function secret() {
  ensureEnvLoaded();
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) return "oracle-eye-hospital-default-auth-secret-key-2026";
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
  const inputPassword = String(password);

  // 1. Check against environment variables (for local development or env credentials)
  const envEmail = process.env.ADMIN_EMAIL
    ? String(process.env.ADMIN_EMAIL).trim().replace(/^["']|["']$/g, "").toLowerCase()
    : null;
  const envPassword = process.env.ADMIN_PASSWORD
    ? String(process.env.ADMIN_PASSWORD).trim().replace(/^["']|["']$/g, "")
    : null;

  if (
    envEmail &&
    envPassword &&
    normalizedEmail === envEmail &&
    (inputPassword === envPassword || inputPassword.trim() === envPassword)
  ) {
    return true;
  }

  // 2. Fall back to database lookup (for deployed/production database)
  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.active || user.role !== "ADMIN") return false;
    return bcrypt.compare(inputPassword, user.passwordHash);
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
