const bcrypt = require("bcrypt");

const BCRYPT_ROUNDS = 12;
const ADMIN_ROLE = "ADMIN";

/**
 * Idempotently create or update the single designated admin account.
 * Never logs password or password hash.
 */
async function upsertAdminCredentials(prisma, email, password) {
  const normalizedEmail = String(email).toLowerCase().trim();
  if (!normalizedEmail || !password) {
    throw new Error("Admin email and password are required.");
  }

  const passwordHash = await bcrypt.hash(String(password), BCRYPT_ROUNDS);

  return prisma.$transaction(async (tx) => {
    const byEmail = await tx.user.findUnique({ where: { email: normalizedEmail } });

    if (byEmail) {
      if (byEmail.role !== ADMIN_ROLE) {
        throw new Error(
          `A user with email "${normalizedEmail}" exists but is not an admin; refusing to change password.`
        );
      }
      const updated = await tx.user.update({
        where: { id: byEmail.id },
        data: { passwordHash, active: true },
      });
      return { action: "updated", id: updated.id, email: updated.email };
    }

    const admins = await tx.user.findMany({ where: { role: ADMIN_ROLE } });

    if (admins.length === 0) {
      const created = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          role: ADMIN_ROLE,
          active: true,
        },
      });
      return { action: "created", id: created.id, email: created.email };
    }

    if (admins.length === 1) {
      const updated = await tx.user.update({
        where: { id: admins[0].id },
        data: { email: normalizedEmail, passwordHash, active: true },
      });
      return { action: "updated", id: updated.id, email: updated.email };
    }

    throw new Error(
      `Found ${admins.length} admin accounts; cannot safely choose one to update. Resolve duplicates manually.`
    );
  });
}

async function seedAdminFromEnv(prisma) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email?.trim() || !password) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment before seeding the admin user."
    );
  }
  return upsertAdminCredentials(prisma, email, password);
}

module.exports = { upsertAdminCredentials, seedAdminFromEnv, BCRYPT_ROUNDS };
