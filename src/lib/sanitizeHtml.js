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
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "img"
]);

const ALLOWED_ATTRIBUTES = {
  a: new Set(["href", "title", "target", "rel"]),
  th: new Set(["colspan", "rowspan", "scope", "align"]),
  td: new Set(["colspan", "rowspan", "align"]),
  span: new Set(["class"]),
  code: new Set(["class"]),
  img: new Set(["src", "alt", "width", "height", "loading"]),
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

  // 4. Keep only the semantic tags/attributes supported by the editor.
  clean = clean.replace(/<\/?([a-z0-9]+)(\s[^>]*)?>/gi, (match, tagName, rawAttrs = "") => {
    const tag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (match.startsWith("</")) return `</${tag}>`;
    const allowed = ALLOWED_ATTRIBUTES[tag] || new Set();
    const attrs = [];
    rawAttrs.replace(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi, (_, name, d, s, bare) => {
      const attr = name.toLowerCase();
      const value = d ?? s ?? bare ?? "";
      if (!allowed.has(attr)) return "";
      if ((attr === "href" || attr === "src") && !/^(https?:|mailto:|tel:|\/|#)/i.test(value.trim())) return "";
      if (attr === "src" && /^data:/i.test(value.trim())) return "";
      if (attr === "width" || attr === "height") {
        if (!/^\d{1,4}$/.test(value)) return "";
      }
      attrs.push(`${attr}="${value.replace(/"/g, "&quot;")}"`);
      return "";
    });
    if (tag === "a" && attrs.some((attr) => attr.startsWith("target=\"_blank\"")) && !attrs.some((attr) => attr.startsWith("rel="))) {
      attrs.push('rel="noopener noreferrer"');
    }
    return `<${tag}${attrs.length ? ` ${attrs.join(" ")}` : ""}${tag === "br" || tag === "img" ? " /" : ""}>`;
  });

  return clean.trim();
}
