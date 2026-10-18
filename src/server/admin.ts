import "server-only";
import { requireAdmin } from "./auth";
import { getDb } from "./db";

export const PAGE_SIZE = 30;
export function pageNumber(value: string | string[] | undefined) {
  const number = Number(Array.isArray(value) ? value[0] : value || 1);
  return Number.isSafeInteger(number) && number > 0 ? Math.min(number, 10000) : 1;
}
export async function adminSummary() {
  await requireAdmin();
  const db = getDb();
  const [products, categories, orders, customers] = await Promise.all([
    db.product.count(), db.category.count(), db.order.count(), db.user.count({ where: { role: "CUSTOMER" } }),
  ]);
  return { products, categories, orders, customers };
}
export async function adminProducts(page: number) {
  await requireAdmin();
  const db = getDb();
  const [rows, count] = await Promise.all([
    db.product.findMany({ omit: { imageData: true }, include: { category: true }, orderBy: [{ createdAt: "desc" }, { id: "asc" }], take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }), db.product.count(),
  ]);
  return { rows, count };
}
export async function adminProduct(id: string) {
  await requireAdmin();
  return getDb().product.findUnique({ where: { id }, omit: { imageData: true } });
}
export async function adminCategories() {
  await requireAdmin();
  return getDb().category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } });
}
export async function adminCategory(id: string) {
  await requireAdmin();
  return getDb().category.findUnique({ where: { id } });
}
export async function adminOrders(page: number) {
  await requireAdmin();
  const db = getDb();
  const [rows, count] = await Promise.all([
    db.order.findMany({ orderBy: [{ createdAt: "desc" }, { id: "asc" }], take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, include: { _count: { select: { items: true } } } }), db.order.count(),
  ]);
  return { rows, count };
}
export async function adminOrder(id: string) {
  await requireAdmin();
  return getDb().order.findUnique({ where: { id }, include: { items: true, user: { select: { name: true, email: true } } } });
}
