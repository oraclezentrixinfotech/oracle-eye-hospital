import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseBasicText, validateSeoPageData } from "@/app/admin/seo-pages/components/parseEngine";
import mammoth from "mammoth";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req) {
  if (!isAdmin()) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No file provided. Please choose a .txt, .docx, or .doc file to upload." },
        { status: 400 }
      );
    }

    const fileName = file.name || "document.txt";
    const fileSizeBytes = file.size || 0;

    // 1. File Size Validation
    if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `File size (${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed limit of 10 MB.`,
        },
        { status: 400 }
      );
    }

    if (fileSizeBytes === 0) {
      return NextResponse.json(
        { error: "The uploaded file is empty (0 bytes). Please upload a file containing SEO content." },
        { status: 400 }
      );
    }

    const ext = fileName.toLowerCase().split(".").pop();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";
    let extractedHtml = "";

    // 2. Format Identification & Extraction
    if (ext === "docx") {
      try {
        const rawResult = await mammoth.extractRawText({ buffer });
        extractedText = rawResult.value || "";

        const htmlResult = await mammoth.convertToHtml({ buffer });
        extractedHtml = htmlResult.value || "";

        if (!extractedText.trim()) {
          return NextResponse.json(
            { error: "The Word document (.docx) contains no readable text or is corrupted." },
            { status: 422 }
          );
        }
      } catch (docErr) {
        return NextResponse.json(
          {
            error: "Unable to read the Word document (.docx). The file may be password-protected or corrupted: " + docErr.message,
          },
          { status: 422 }
        );
      }
    } else if (ext === "txt") {
      try {
        // Try UTF-8 first
        extractedText = buffer.toString("utf-8");
        // Check for Unicode replacement character bombardment indicating encoding mismatch
        if ((extractedText.match(/\uFFFD/g) || []).length > 5) {
          extractedText = buffer.toString("latin1");
        }

        if (!extractedText.trim()) {
          return NextResponse.json(
            { error: "The text file is empty or contains only whitespace." },
            { status: 422 }
          );
        }
      } catch (txtErr) {
        return NextResponse.json(
          { error: "Unable to decode text file. Ensure it is saved in UTF-8 or ANSI encoding." },
          { status: 422 }
        );
      }
    } else if (ext === "doc") {
      // Legacy binary Word format (.doc)
      const isOleCompound = buffer.length > 8 && buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0;
      
      // Attempt to extract plain readable text chunks if possible
      let textChunk = "";
      for (let i = 0; i < buffer.length - 1; i++) {
        const byte = buffer[i];
        if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13) {
          textChunk += String.fromCharCode(byte);
        } else if (byte === 0 && textChunk.length > 0 && textChunk[textChunk.length - 1] !== " ") {
          textChunk += " ";
        }
      }

      // Filter readable paragraphs (> 20 printable characters in succession)
      const readableLines = textChunk
        .split(/\r?\n/)
        .map((l) => l.trim().replace(/\s{2,}/g, " "))
        .filter((l) => l.length >= 10 && !/^[^\w\s]+$/.test(l));

      if (readableLines.length >= 4) {
        extractedText = readableLines.join("\n\n");
      } else {
        return NextResponse.json(
          {
            error:
              "Legacy Microsoft Word (.doc) binary format detected. The proprietary binary structure could not be parsed safely without losing content integrity. Please open the file in Microsoft Word or Google Docs and save it as modern Word (.docx) or plain text (.txt), then re-upload.",
          },
          { status: 422 }
        );
      }
    } else {
      return NextResponse.json(
        {
          error: `Unsupported file extension '.${ext}'. Supported formats are: .docx (Word document), .txt (Plain text), and .doc (Legacy Word).`,
        },
        { status: 400 }
      );
    }

    // 3. Load DB Doctors and Existing Pages for Smart Linking
    let doctorsList = [];
    let allPages = [];
    let existingPages = [];

    try {
      doctorsList = await prisma.doctor.findMany({
        where: { active: true },
        select: { id: true, name: true, role: true, qualification: true },
      });
      allPages = await prisma.seoPage.findMany({
        where: { status: "published" },
        select: { id: true, slug: true, h1Title: true },
      });
      existingPages = await prisma.seoPage.findMany({
        select: { id: true, slug: true, h1Title: true, status: true },
      });
    } catch (dbErr) {
      console.warn("DB load warning during document import:", dbErr?.message);
    }

    // 4. Parse Structured Fields
    const parsedData = parseBasicText(extractedText, doctorsList, allPages);
    if (!parsedData) {
      return NextResponse.json(
        { error: "Could not identify SEO content in document. Ensure headings and sections are present." },
        { status: 422 }
      );
    }

    // 5. Run Field Validation Engine
    const existingSlugs = existingPages.map((p) => p.slug);
    const validationReport = validateSeoPageData(parsedData, existingSlugs);

    // 6. Check Slug Conflict with Existing Published/Draft Page
    const conflict = existingPages.find((p) => p.slug === parsedData.slug);
    const slugConflict = conflict
      ? {
          exists: true,
          existingId: conflict.id,
          existingTitle: conflict.h1Title,
          existingSlug: conflict.slug,
          existingStatus: conflict.status,
        }
      : null;

    return NextResponse.json({
      success: true,
      fileName,
      fileSizeBytes,
      fileType: ext.toUpperCase(),
      parsedData,
      validationReport,
      slugConflict,
      unmappedContent: parsedData.unmappedContent || [],
      extractedTextLength: extractedText.length,
    });
  } catch (err) {
    console.error("POST /api/admin/seo-pages/import-document error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to process document: " + (err?.message || "Internal server error") },
      { status: 500 }
    );
  }
}
