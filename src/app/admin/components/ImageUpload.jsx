"use client";
import { useState, useRef } from "react";
import { Upload, X, CheckCircle } from "lucide-react";
import "./datatable.css";

// onUpload(url) called after successful Cloudinary upload
export default function ImageUpload({ currentUrl, onUpload, label = "Image" }) {
  const [preview, setPreview] = useState(currentUrl || "");
  const [progress, setProgress] = useState(0); // 0-100
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    setPreview(URL.createObjectURL(file));
    setError("");
    setProgress(0);
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    try {
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

        xhr.onerror = () => reject(new Error("Network error."));
        xhr.send(fd);
      });

      setProgress(100);
      onUpload(url);
    } catch (err) {
      setError(err.message);
      setPreview(currentUrl || "");
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
          <img src={preview} alt="Preview" className="iup-preview-img" />
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
          <span>Click to choose image</span>
          <span className="iup-hint">JPG, PNG, WebP · max 5 MB</span>
        </div>
      )}

      {/* Progress bar */}
      {uploading && (
        <div className="iup-progress-wrap">
          <div className="iup-progress-bar" style={{ width: `${progress}%` }}></div>
          <span className="iup-progress-text">{progress}%</span>
        </div>
      )}

      {/* Error */}
      {error && <div className="iup-error">{error}</div>}

      {/* Change button when preview exists */}
      {preview && !uploading && (
        <button type="button" className="iup-change-btn" onClick={() => inputRef.current?.click()}>
          Change image
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
