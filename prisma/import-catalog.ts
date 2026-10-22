import type { Prisma } from "../src/generated/prisma/client";
import { seedCategories, seedProducts } from "./seed-data";

export async function importCatalog(tx: Prisma.TransactionClient, replaceCatalog = false) {
  const categoryIds = new Map<string, string>();
  for (const category of seedCategories) {
    const row = await tx.category.upsert({ where: { slug: category.slug }, update: {}, create: category });
    categoryIds.set(category.name, row.id);
  }
  const ids: string[] = [];
  for (const product of seedProducts) {
    const { id, price, released, category, imageUrl: _image, oldPrice: _oldPrice, ...content } = product;
    void _image; void _oldPrice;
    const data = { ...content, durationMonths: product.durationMonths ?? null, apiCreditUsd: product.apiCreditUsd ?? null, activation: product.activation ?? null,
      nameEn: null, nameFr: null, nameAr: null, nameMa: null, oldPriceMinor: null, active: true,
      priceMinor: Math.round(price * 100), releasedAt: new Date(`${released}T00:00:00.000Z`), categoryId: categoryIds.get(category)! };
    const row = await tx.product.upsert({ where: { slug: product.slug }, update: replaceCatalog ? data : {}, create: { ...data, id } });
    ids.push(row.id);
  }
  // Explicit replacement preserves old records, images and order references; it only hides other offers.
  if (replaceCatalog) await tx.product.updateMany({ where: { id: { notIn: ids }, active: true }, data: { active: false } });
  return ids;
}
