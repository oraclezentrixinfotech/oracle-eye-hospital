import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req) {
  if (!isAdmin()) return unauthorized();

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data." }, { status: 400 });

  const file = formData.get("file");
  if (!file || typeof file === "string")
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "Only JPG, PNG, and WebP images are allowed." }, { status: 400 });

  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: "File must be under 5 MB." }, { status: 400 });

  // Convert to buffer → base64 data URI for Cloudinary upload
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "oracle-eye-hospital",
      resource_type: "image",
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ error: "Upload failed. Check Cloudinary credentials." }, { status: 500 });
  }
}
