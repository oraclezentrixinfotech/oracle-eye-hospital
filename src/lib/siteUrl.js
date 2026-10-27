/**
 * Single source of truth for the base site URL across the entire project.
 * Reads process.env.SITE_URL or process.env.NEXT_PUBLIC_SITE_URL,
 * defaulting to the production domain https://www.oracleeyehospital.com.
 * Strips any trailing slashes to guarantee clean concatenation.
 */
export const SITE_URL = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.oracleeyehospital.com"
).replace(/\/+$/, "");

export default SITE_URL;
