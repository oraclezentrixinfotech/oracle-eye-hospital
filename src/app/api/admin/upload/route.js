import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

function uploadToCloudinary(buffer, options) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        }).end(buffer);
    });
}

export async function POST(req) {
    if (!isAdmin()) return unauthorized();

    const formData = await req.formData().catch(() => null);
    if (!formData) return NextResponse.json({ error: "Invalid form data." }, { status: 400 });

    const file = formData.get("file");
    if (!file || typeof file === "string")
        return NextResponse.json({ error: "No file uploaded." }, { status: 400 });

    const isImage = IMAGE_TYPES.includes(file.type);
    const isVideo = VIDEO_TYPES.includes(file.type);
    if (!isImage && !isVideo)
        return NextResponse.json({ error: "Only JPG, PNG, WebP, MP4, WebM, and MOV files are allowed." }, { status: 400 });

    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes)
        return NextResponse.json({ error: `File must be under ${isVideo ? "100 MB" : "5 MB"}.` }, { status: 400 });

    try {
        const result = await uploadToCloudinary(Buffer.from(await file.arrayBuffer()), {
            folder: "oracle-eye-hospital",
            resource_type: isVideo ? "video" : "image",
        });
        return NextResponse.json({ url: result.secure_url });
    } catch (err) {
        console.error("Cloudinary upload error:", err);
        return NextResponse.json({ error: "Upload failed. Check Cloudinary credentials." }, { status: 500 });
    }
}