/**
 * One-time admin credential rotation (PostgreSQL User table).
 * Does not print passwords or password hashes.
 *
 * Usage:
 *   node scripts/replace-admin-credentials.js
 *
 * Prefer temporary env vars so the password is not echoed in the terminal:
 *   $env:ROTATE_ADMIN_EMAIL="you@example.com"
 *   $env:ROTATE_ADMIN_PASSWORD="your-new-password"
 *   node scripts/replace-admin-credentials.js
 *   Remove-Item Env:ROTATE_ADMIN_PASSWORD
 */

const readline = require("readline");
const { PrismaClient } = require("@prisma/client");
const { upsertAdminCredentials } = require("../prisma/adminUser");

const prisma = new PrismaClient();

function createRl() {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const rl = createRl();

  try {
    const adminsBefore = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, email: true, active: true, role: true },
    });

    console.log("Current admin account(s) in database:");
    if (adminsBefore.length === 0) {
      console.log("  (none)");
    } else {
      for (const a of adminsBefore) {
        console.log(`  - id=${a.id} email=${a.email} active=${a.active} role=${a.role}`);
      }
    }

    const email =
      process.env.ROTATE_ADMIN_EMAIL?.trim() ||
      (await ask(rl, "New admin email: ")).trim();

    let password = process.env.ROTATE_ADMIN_PASSWORD;
    if (!password) {
      console.log("(Set ROTATE_ADMIN_PASSWORD to avoid typing the password in the terminal.)");
      password = await ask(rl, "New admin password: ");
    }

    const nodeEnv = process.env.NODE_ENV || "development";
    if (nodeEnv === "production") {
      const answer = await ask(
        rl,
        `NODE_ENV=production. Type YES to update admin credentials for "${email}": `
      );
      if (answer !== "YES") {
        console.log("Aborted; no changes made.");
        return;
      }
    } else {
      const answer = await ask(rl, `Proceed with admin credential update for "${email}"? (y/N): `);
      if (answer.toLowerCase() !== "y") {
        console.log("Aborted; no changes made.");
        return;
      }
    }

    const result = await upsertAdminCredentials(prisma, email, password);

    const adminsAfter = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, email: true, active: true },
    });

    if (adminsAfter.length !== 1) {
      throw new Error(
        `Expected exactly one admin after update; found ${adminsAfter.length}. Review the database manually.`
      );
    }
    if (adminsAfter[0].id !== result.id) {
      throw new Error("Updated admin id does not match the sole admin record; review the database manually.");
    }

    console.log(`Success: admin account ${result.action}.`);
    console.log(`  id: ${result.id}`);
    console.log(`  email: ${result.email}`);
    console.log("Verify by signing in at /admin with the new email and password.");
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
