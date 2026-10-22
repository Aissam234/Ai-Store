import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import type { Product, Category } from "@/types/catalog";
import { getDb } from "./db";

type Row = Prisma.ProductGetPayload<{ include: { category: true }; omit: { imageData: true } }>;
function toProduct(row: Row): Product {
  return {
    nameEn: row.nameEn, nameFr: row.nameFr, nameAr: row.nameAr, nameMa: row.nameMa, descriptionEn: row.descriptionEn, descriptionFr: row.descriptionFr, descriptionAr: row.descriptionAr, descriptionMa: row.descriptionMa,
    id: row.id, slug: row.slug, name: row.name, category: row.category.name,
    description: row.description, fullDescription: row.fullDescription,
    price: row.priceMinor / 100, oldPrice: row.oldPriceMinor === null ? undefined : row.oldPriceMinor / 100, imageUrl: row.hasImage ? `/api/products/${row.id}/image?v=${row.updatedAt.getTime()}` : undefined, badge: row.badge, featured: row.featured,
    released: row.releasedAt.toISOString().slice(0, 10), symbol: row.symbol,
    color: row.color, features: row.features, format: row.format,
    availability: row.availability, durationMonths: row.durationMonths, apiCreditUsd: row.apiCreditUsd, activation: row.activation,
  };
}
export const getProducts = cache(async (): Promise<Product[]> => {
  await connection();
  const rows = await getDb().product.findMany({ where: { active: true }, include: { category: true }, omit: { imageData: true }, orderBy: [{ featured: "desc" }, { createdAt: "asc" }, { id: "asc" }] });
  return rows.map(toProduct);
});
export async function getFeaturedProducts() { return (await getProducts()).filter(product => product.featured); }
export const getProductBySlug = cache(async (slug: string): Promise<Product | undefined> => {
  await connection();
  const row = await getDb().product.findUnique({ where: { slug, active: true }, include: { category: true }, omit: { imageData: true } });
  return row ? toProduct(row) : undefined;
});
export async function getProductsByCategory(category: string) { return (await getProducts()).filter(product => product.category === category); }
export const getCategories = cache(async (): Promise<Category[]> => {
  await connection();
  const rows = await getDb().category.findMany({ orderBy: [{ createdAt: "asc" }, { id: "asc" }], include: { _count: { select: { products: { where: { active: true } } } } } });
  return rows.map(row => ({ id: row.id, name: row.name, slug: row.slug, description: row.description, symbol: row.symbol, productCount: row._count.products }));
});
