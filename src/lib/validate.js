export const clean = (v, max = 200) =>
  typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "";

export const cleanMultiline = (v, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export const digits = (v) => String(v || "").replace(/\D/g, "");

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
