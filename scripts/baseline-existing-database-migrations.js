/**
 * Use when production was created with db push / manual SQL and
 * `prisma migrate deploy` fails with "already exists" (P3018 / P3009).
 *
 * Marks historical migrations as applied when core tables already exist,
 * then runs `prisma migrate deploy` for any newer migrations (e.g. User).
 *
 * Does NOT reset or drop data. Type YES to continue.
 */

const { execSync } = require("child_process");
const readline = require("readline");
const { PrismaClient } = require("@prisma/client");

const BASELINE = [
  "20261005163128_init",
  "20261005163751_add_photo_setting",
  "20261005164404_add_post_image",
];

function run(cmd) {
  execSync(cmd, { stdio: "inherit", cwd: require("path").join(__dirname, "..") });
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (a) => { rl.close(); resolve(a); }));
}

async function tableExists(prisma, name) {
  const rows = await prisma.$queryRaw`
    SELECT 1 AS ok
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = ${name}
    LIMIT 1
  `;
  return rows.length > 0;
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const hasAppointment = await tableExists(prisma, "Appointment");
    const hasPhoto = await tableExists(prisma, "Photo");
    if (!hasAppointment) {
      throw new Error(
        'Table "Appointment" not found. This script is only for databases that already have the app schema.'
      );
    }
    if (!hasPhoto) {
      throw new Error(
        'Table "Photo" not found. Apply or create missing schema before baselining migrations.'
      );
    }

    console.log("This will mark these migrations as already applied (no SQL from them will run):");
    for (const m of BASELINE) console.log(`  - ${m}`);
    console.log("Then it will run: prisma migrate deploy");

    const answer = await ask('Type YES to continue: ');
    if (answer !== "YES") {
      console.log("Aborted.");
      return;
    }

    for (const migration of BASELINE) {
      try {
        run(`npx prisma migrate resolve --rolled-back ${migration}`);
      } catch {
        // No failed migration row — safe to ignore.
      }
      run(`npx prisma migrate resolve --applied ${migration}`);
    }

    run("npx prisma migrate deploy");
    console.log("Baseline complete. Run npm run db:seed (or the admin rotation script) if needed.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
