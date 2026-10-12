// src/lib/photoValidate.js
// Validation helper for Photo Gallery

export function parsePhoto(body) {
  const title = (body?.title ?? "").trim();
  const image = (body?.image ?? "").trim();
  const status = body?.status === undefined ? true : Boolean(body.status);
  const sortOrder = Number.isInteger(Number(body?.sortOrder)) ? Number(body.sortOrder) : 0;

  if (!title || title.length < 2) {
    return { error: "Title must be at least 2 characters." };
  }
  if (!image || (!image.startsWith("https://") && !image.startsWith("http://"))) {
    return { error: "Please upload or provide a valid image URL." };
  }

  return { data: { title, image, status, sortOrder } };
}
