import { connection } from "next/server";
import { getDb } from "@/server/db";
import { catalogVersion } from "@/lib/catalog-version";
export async function GET() {
  await connection();
  const headers = { "Cache-Control": "no-store" };
  try {
    const db = getDb();
    const [products, categories] = await db.$transaction([
      db.product.findMany({ where: { active: true }, select: { id: true, updatedAt: true } }),
      db.category.findMany({ select: { id: true, updatedAt: true } }),
    ]);
    return Response.json({ version: catalogVersion(products, categories) }, { headers });
  } catch {
    return Response.json({ error: "Catalog temporarily unavailable" }, { status: 503, headers });
  }
}
