"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/server/auth";
import { getDb } from "@/server/db";
import { categorySchema, productSchema, idSchema, type ActionState } from "@/lib/validation";
import { normalizeProductImage } from "@/server/product-image";
import { z } from "zod";
import { readThemeImages } from "@/server/theme-images";

function refreshCatalog() {
  for (const path of ["/", "/products", "/categories", "/cart", "/checkout", "/admin", "/admin/products", "/admin/categories"]) revalidatePath(path);
  revalidatePath("/products/[slug]", "page");
}
function mutationError(error: unknown): ActionState {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return { error: "That name or slug is already in use. Choose a unique value." };
    if (error.code === "P2003") return { error: "This record is still referenced. Reassign its products before deleting it." };
    if (error.code === "P2025") return { error: "This record no longer exists. Refresh the list." };
  }
  return { error: "Could not save this change. Check the database connection and try again." };
}
export async function saveProduct(id: string | null, _previous: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  if (id !== null && !idSchema.safeParse(id).success) return { error: "Invalid product ID." };
  const values = Object.fromEntries(form);
  if (!values.slug) values.slug = String(values.name || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || `product-${crypto.randomUUID().slice(0, 8)}`;
  if (!values.fullDescription) values.fullDescription = values.description;
  const parsed = productSchema.safeParse({ ...values, featured: form.get("featured") === "on", active: form.get("active") === "on" });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { price, oldPrice, released, categoryId, ...content } = parsed.data;
  try {
    let imageData: Uint8Array<ArrayBuffer> | null | undefined;
    const file = form.get("image");
    if (file instanceof File && file.size) {
      try { imageData = await normalizeProductImage(file); } catch { return { error: "Choose a valid JPEG, PNG or WebP image up to 3 MB (maximum 25 megapixels)." }; }
    } else if (form.get("removeImage") === "on") imageData = null;
    const themeImages = await readThemeImages(form);
    const data = { ...content, ...themeImages, ...(imageData !== undefined ? { imageData, hasImage: imageData !== null } : {}), oldPriceMinor: oldPrice, priceMinor: price, releasedAt: new Date(`${released}T00:00:00.000Z`), category: { connect: { id: categoryId } } };
    if (id) await getDb().product.update({ where: { id }, data });
    else await getDb().product.create({ data });
  } catch (error) { if (error instanceof Error && error.message === "Invalid theme image") return { error: "Choose valid JPEG, PNG or WebP theme images up to 3 MB each (maximum 25 megapixels)." }; return mutationError(error); }
  refreshCatalog();
  redirect("/admin/products");
}
export async function saveCategory(id: string | null, _previous: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  if (id !== null && !idSchema.safeParse(id).success) return { error: "Invalid category ID." };
  const parsed = categorySchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    if (id) await getDb().category.update({ where: { id }, data: parsed.data });
    else await getDb().category.create({ data: parsed.data });
  } catch (error) { return mutationError(error); }
  refreshCatalog();
  redirect("/admin/categories");
}
export async function deleteRecord(kind: "product" | "category", id: string, _previous: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({ kind: z.enum(["product", "category"]), id: idSchema, confirm: z.literal("on", { error: "Confirm the deletion before continuing." }) }).safeParse({ kind, id, confirm: form.get("confirm") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    if (parsed.data.kind === "product") await getDb().product.delete({ where: { id: parsed.data.id } });
    else await getDb().category.delete({ where: { id: parsed.data.id } });
  } catch (error) { return mutationError(error); }
  refreshCatalog();
  redirect(kind === "product" ? "/admin/products" : "/admin/categories");
}

export async function toggleProduct(id: string, active: boolean, _previous: ActionState): Promise<ActionState> {
  void _previous;
  await requireAdmin();
  if (!idSchema.safeParse(id).success || typeof active !== "boolean") return { error: "Invalid product." };
  try { await getDb().product.update({ where: { id }, data: { active } }); } catch (error) { return mutationError(error); }
  refreshCatalog();
  return { success: active ? "Product enabled." : "Product disabled." };
}

