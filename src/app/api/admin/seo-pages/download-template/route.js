import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const zipPath = path.join(process.cwd(), "public", "templates", "seo-page-templates.zip");
    if (!fs.existsSync(zipPath)) {
      return NextResponse.json(
        { error: "Template bundle not found on server." },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(zipPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="seo-page-templates.zip"',
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[Download Template API Error]:", err);
    return NextResponse.json(
      { error: "Failed to download template bundle." },
      { status: 500 }
    );
  }
}
