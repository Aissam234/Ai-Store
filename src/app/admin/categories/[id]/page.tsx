import { notFound } from "next/navigation";
import { adminCategory } from "@/server/admin";
import { CategoryForm, DeleteForm } from "@/components/admin/forms";
export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const category = await adminCategory(id); if (!category) notFound();
  return <section className="panel admin-editor"><h1 className="admin-title">Edit category</h1><CategoryForm category={{ id: category.id, name: category.name, slug: category.slug, description: category.description, symbol: category.symbol }}/><DeleteForm kind="category" id={id}/></section>;
}
