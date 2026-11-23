/**
 * Canonical production domain for Oracle Eye Hospital.
 * Always strictly enforce https://www.oracleeyehospital.com (with 'www.')
 * to prevent duplicate indexing and Google Search Console canonical mismatches.
 */
export const CANONICAL_DOMAIN = "https://www.oracleeyehospital.com";

/**
 * Normalizes any URL or slug into a strict canonical URL:
 * - Domain is always https://www.oracleeyehospital.com
 * - Fixes non-www (https://oracleeyehospital.com -> https://www.oracleeyehospital.com)
 * - Fixes localhost or test domains (http://localhost:3000 -> https://www.oracleeyehospital.com)
 * - Strips duplicate/multiple consecutive slashes (e.g. //path -> /path)
 * - Retains clean path (e.g. /why-getting-a-second-opinion-matters-before-major-surgery)
 */
export function normalizeCanonicalUrl(input) {
  if (!input) return "";
  let str = String(input).trim();
  if (!str) return "";

  // If input starts with http:// or https://
  if (/^https?:\/\//i.test(str)) {
    try {
      const parsed = new URL(str);
      const cleanPath = (parsed.pathname || "")
        .replace(/\/+/g, "/") // Collapse multiple slashes (e.g. //slug -> /slug)
        .replace(/\/+$/, ""); // Remove trailing slash unless root

      return `${CANONICAL_DOMAIN}${cleanPath}`;
    } catch {
      // Fallback regex parsing if URL constructor throws
      str = str.replace(/^https?:\/\/[^\/]+/i, "");
    }
  }

  // Handle relative path or raw slug (e.g. "my-page" or "/my-page" or "//my-page")
  const cleanPath = str
    .replace(/^https?:\/\/(www\.)?oracleeyehospital\.com/i, "")
    .replace(/^https?:\/\/localhost(:\d+)?/i, "")
    .replace(/\/+/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  return cleanPath ? `${CANONICAL_DOMAIN}/${cleanPath}` : CANONICAL_DOMAIN;
}

export const SITE_URL = CANONICAL_DOMAIN;
export default SITE_URL;
