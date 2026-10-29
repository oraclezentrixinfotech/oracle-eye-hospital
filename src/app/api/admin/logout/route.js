import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST(req) {
  const host = req.headers.get("host") || "";
  const isProductionDomain = host.includes("oracleeyehospital.com");

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    ...(isProductionDomain ? { domain: ".oracleeyehospital.com" } : {}),
  });
  return res;
}
