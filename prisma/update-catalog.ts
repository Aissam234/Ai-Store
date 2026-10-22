import "./load-env";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { importCatalog } from "./import-catalog";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url || !["localhost", "127.0.0.1"].includes(new URL(url).hostname)) throw new Error("This catalog replacement command is restricted to the local database.");
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  try {
    const ids = await db.$transaction(tx => importCatalog(tx, true), { timeout: 30000 });
    console.log(`Updated ${ids.length} offers. Other products disabled; no products or orders deleted.`);
  } finally { await db.$disconnect(); }
}
main().catch(() => { console.error("Catalog import failed; transaction rolled back. Check migrations and catalog constraints."); process.exitCode = 1; });
