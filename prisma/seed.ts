import "./load-env";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword, verifyPassword } from "../src/lib/password";
import { registerSchema } from "../src/lib/validation";
import { seedCategories, seedProducts } from "./seed-data";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required to seed. No database changes made.");
  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (Boolean(email) !== Boolean(password)) throw new Error("Set both INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD, or neither.");
  const admin = email && password ? registerSchema.parse({ email, password, name: process.env.INITIAL_ADMIN_NAME || "Store administrator" }) : null;
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString, max: 1, connectionTimeoutMillis: 5000 }) });
  try {
    if (admin) {
      const existing = await db.user.findUnique({ where: { email: admin.email } });
      if (existing && (existing.role !== "ADMIN" || !await verifyPassword(admin.password, existing.passwordHash))) {
        throw new Error("Refusing to overwrite an existing account or promote a customer. Configure a unique initial admin email.");
      }
      if (!existing) await db.user.create({ data: { email: admin.email, name: admin.name, passwordHash: await hashPassword(admin.password), role: "ADMIN" } });
    }
    await db.$transaction(async tx => {
      const categoryIds = new Map<string, string>();
      for (const [index, category] of seedCategories.entries()) {
        const slug = ["ai-automation", "development", "design", "productivity"][index];
        const row = await tx.category.upsert({ where: { id: `category-${index + 1}` }, update: {}, create: { id: `category-${index + 1}`, slug, ...category } });
        categoryIds.set(category.name, row.id);
      }
      for (const product of seedProducts) {
        const { price, released, category, ...content } = product;
        await tx.product.upsert({ where: { id: product.id }, update: {}, create: { ...content, priceMinor: Math.round(price * 100), releasedAt: new Date(`${released}T00:00:00.000Z`), categoryId: categoryIds.get(category)! } });
      }
    });
    console.log("Seed complete. Existing product/category edits preserved. Initial admin configured only when explicitly supplied.");
  } finally { await db.$disconnect(); }
}
main().catch(() => { console.error("Seed failed. Check DATABASE_URL, migrations, validated admin environment variables, and existing account conflicts. No credentials are logged."); process.exitCode = 1; });
