import { prisma } from "@/lib/prisma";

export const DEFAULT_SETTINGS = {
  phone: "+91 8006803111",
  whatsapp: "+91 8006803111",
  email: "oracleeyehospital@gmail.com",
  address: "491, Hi-Street, Near TDI City, Parampara, MDA, Moradabad, Uttar Pradesh 244001, India",
  working_hours: "Mon – Sat, 10:00 AM – 8:00 PM",
  facebook: "https://www.facebook.com/oracleeyehospital/",
  instagram: "https://www.instagram.com/oracleeyehospital/",
};

/**
 * Returns website settings merged over default fallback values.
 * Returns DEFAULT_SETTINGS if database is unreachable.
 */
export async function getSettings() {
  try {
    const rows = await prisma.setting.findMany();
    const map = {};
    for (const row of rows) {
      if (row.key) {
        map[row.key] = row.value;
      }
    }
    return { ...DEFAULT_SETTINGS, ...map };
  } catch (err) {
    console.error("getSettings failed, falling back to defaults:", err?.message || err);
    return { ...DEFAULT_SETTINGS };
  }
}
