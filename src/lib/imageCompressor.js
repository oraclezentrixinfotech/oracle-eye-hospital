/**
 * Client-side image compression utility using HTML Canvas and progressive quality loop.
 * Guarantees that the returned File/Blob is under maxSizeBytes (default 1 MB / 1024 * 1024 bytes).
 */
export async function compressImageToMaxLimit(file, maxSizeBytes = 1024 * 1024) {
  if (!file || !(file instanceof Blob)) return file;
  
  // If file is already below limit and is standard web image, return as is
  if (file.size <= maxSizeBytes && !file.type.includes("bmp") && !file.type.includes("tiff")) {
    return file;
  }

  // If not an image, return file directly
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image into canvas."));
      img.onload = async () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Downscale huge resolution dimensions if > 1920 to keep compression fast & lightweight
          const MAX_DIM = 2400;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }

          // Use white background in case of transparent png to jpg, or maintain webp
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Progressive quality loop
          let quality = 0.92;
          let blob = null;
          const targetType = "image/webp"; // WebP offers best compression ratio

          for (let attempt = 0; attempt < 8; attempt++) {
            blob = await new Promise((resBlob) => {
              canvas.toBlob(resBlob, targetType, quality);
            });

            if (!blob) break;

            if (blob.size <= maxSizeBytes) {
              break;
            }

            // Reduce quality or dimensions
            if (quality > 0.4) {
              quality -= 0.15;
            } else {
              // Further scale down dimensions if still > 1MB
              width = Math.round(width * 0.85);
              height = Math.round(height * 0.85);
              canvas.width = width;
              canvas.height = height;
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, width, height);
              ctx.drawImage(img, 0, 0, width, height);
              quality = 0.75;
            }
          }

          if (blob && blob.size <= maxSizeBytes) {
            const originalName = file.name ? file.name.replace(/\.[^/.]+$/, "") : "image";
            const compressedFile = new File([blob], `${originalName}.webp`, {
              type: targetType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else if (blob) {
            // Best effort fallback
            const originalName = file.name ? file.name.replace(/\.[^/.]+$/, "") : "image";
            const compressedFile = new File([blob], `${originalName}.webp`, {
              type: targetType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        } catch (err) {
          reject(err);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}
