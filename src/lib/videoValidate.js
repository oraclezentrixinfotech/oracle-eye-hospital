// src/lib/videoValidate.js
// No exports other than parseVideo — safe to import in both pages & API routes.

export function parseVideo(body) {
  const title = (body?.title ?? "").trim();
  const url = (body?.url ?? "").trim();
  const active = body?.active === undefined ? true : Boolean(body.active);
  const sortOrder = Number.isInteger(Number(body?.sortOrder)) ? Number(body.sortOrder) : 0;

  if (!title || title.length < 2) return { error: "Title must be at least 2 characters." };
  if (!url || !url.startsWith("https://")) return { error: "YouTube URL must start with https://" };

  return { data: { title, url, active, sortOrder } };
}
