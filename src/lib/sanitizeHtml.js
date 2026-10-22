/**
 * Safe Server-side HTML Sanitizer for SEO Content Sections
 * Strips script tags, iframes, inline event handlers, and unsafe protocols,
 * while preserving valid semantic tags, formatting, lists, tables, and links.
 */

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "a", "blockquote", "span", "code", "pre",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td"
]);

const ALLOWED_ATTRIBUTES = {
  a: new Set(["href", "title", "target", "rel"]),
  th: new Set(["colspan", "rowspan", "scope", "align"]),
  td: new Set(["colspan", "rowspan", "align"]),
  span: new Set(["class"]),
  code: new Set(["class"]),
};

export function sanitizeHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== "string") return "";

  // 1. Remove dangerous blocks: <script>...</script>, <style>...</style>, <iframe>...</iframe>, <object>...
  let clean = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // 2. Remove inline event handlers like onclick=..., onload=..., onerror=...
  clean = clean.replace(/\s*on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  // 3. Remove javascript: and data: URIs from href
  clean = clean.replace(/href\s*=\s*["']?\s*(?:javascript|data|vbscript):[^"'>\s]*/gi, 'href="#"');

  // 4. Ensure target="_blank" has rel="noopener noreferrer"
  clean = clean.replace(/<a\b([^>]*target=["']_blank["'][^>]*)>/gi, (match, attrs) => {
    if (!/rel=/i.test(attrs)) {
      return `<a ${attrs} rel="noopener noreferrer">`;
    }
    return match;
  });

  return clean.trim();
}
