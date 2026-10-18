import { notFound } from "next/navigation";
import { adminProduct, adminCategories } from "@/server/admin";
import { ProductForm, DeleteForm } from "@/components/admin/forms";
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([adminProduct(id), adminCategories()]);
  if (!product) notFound();
  const value = { nameEn: product.nameEn, nameFr: product.nameFr, nameAr: product.nameAr, nameMa: product.nameMa, descriptionEn: product.descriptionEn, descriptionFr: product.descriptionFr, descriptionAr: product.descriptionAr, descriptionMa: product.descriptionMa, oldPrice: product.oldPriceMinor === null ? "" : (product.oldPriceMinor / 100).toFixed(2), imageUrl: product.hasImage ? `/api/products/${product.id}/image?v=${product.updatedAt.getTime()}` : undefined, id: product.id, name: product.name, slug: product.slug, categoryId: product.categoryId, description: product.description, fullDescription: product.fullDescription, price: (product.priceMinor / 100).toFixed(2), badge: product.badge, featured: product.featured, active: product.active, released: product.releasedAt.toISOString().slice(0, 10), symbol: product.symbol, color: product.color, features: product.features.join("\n"), format: product.format };
  return <section className="panel admin-editor"><h1 className="admin-title">Edit product</h1><ProductForm product={value} categories={categories.map(({ id, name }) => ({ id, name }))}/><DeleteForm kind="product" id={id}/></section>;
}
