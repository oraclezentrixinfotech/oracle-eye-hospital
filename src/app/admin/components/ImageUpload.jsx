"use client";
import { useState, useRef } from "react";
import { Upload, X, CheckCircle, Loader2 } from "lucide-react";
import { compressImageToMaxLimit } from "@/lib/imageCompressor";
import "./datatable.css";

// onUpload(url) called after successful Cloudinary upload
export default function ImageUpload({ currentUrl, onUpload, label = "Image", mediaType = "image" }) {
  const [preview, setPreview] = useState(currentUrl || "");
  const [progress, setProgress] = useState(0); // 0-100
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const isVideo = mediaType === "video";

  async function handleFile(e) {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setError("");
    setProgress(0);
    setUploading(true);

    try {
      let fileToUpload = rawFile;

      // Instant local preview
      setPreview(URL.createObjectURL(rawFile));

      // Client-side compress images to under 1 MB
      if (!isVideo && rawFile.type.startsWith("image/")) {
        setStatusText("Optimizing image under 1 MB...");
        fileToUpload = await compressImageToMaxLimit(rawFile, 1024 * 1024);
      }

      setStatusText("Uploading to Cloudinary...");
      const fd = new FormData();
      fd.append("file", fileToUpload);

      // Use XMLHttpRequest so we can track upload progress
      const url = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/upload");

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            setProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            if (data.url) resolve(data.url);
            else reject(new Error(data.error || "Upload failed."));
          } else {
            const data = JSON.parse(xhr.responseText || "{}");
            reject(new Error(data.error || `Server error ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload."));
        xhr.send(fd);
      });

      setProgress(100);
      setStatusText("");
      onUpload(url);
    } catch (err) {
      setError(err.message || "Failed to process and upload image.");
      setPreview(currentUrl || "");
      setStatusText("");
    } finally {
      setUploading(false);
    }
  }

  function clearImage() {
    setPreview("");
    setProgress(0);
    setError("");
    onUpload("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="iup-root">
      <label className="iup-label">{label}</label>

      {/* Preview */}
      {preview ? (
        <div className="iup-preview-wrap">
          {isVideo ? (
            <video src={preview} className="iup-preview-img" controls />
          ) : (
            <img src={preview} alt="Preview" className="iup-preview-img" />
          )}
          {progress === 100 && !uploading && (
            <span className="iup-done"><CheckCircle size={14} /> Uploaded</span>
          )}
          {!uploading && (
            <button type="button" className="iup-clear" onClick={clearImage} title="Remove">
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className="iup-dropzone" onClick={() => inputRef.current?.click()}>
          <Upload size={22} color="#9ca3af" />
          <span>Click to choose {isVideo ? "video" : "image"}</span>
          <span className="iup-hint">
            {isVideo ? "MP4, WebM, MOV · max 100 MB" : "JPG, PNG, WebP · max 5 MB"}
          </span>
        </div>
      )}

      {/* Uploading Loader & Status */}
      {uploading && (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#0d9488", marginBottom: 4, fontWeight: 600 }}>
            <Loader2 size={14} className="adt-spin" />
            <span>{statusText || "Processing image..."}</span>
          </div>
          <div className="iup-progress-wrap">
            <div className="iup-progress-bar" style={{ width: `${progress}%` }}></div>
            <span className="iup-progress-text">{progress}%</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <div className="iup-error">{error}</div>}

      {/* Change button when preview exists */}
      {preview && !uploading && (
        <button type="button" className="iup-change-btn" onClick={() => inputRef.current?.click()}>
          Change {isVideo ? "video" : "image"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={isVideo ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp"}
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
