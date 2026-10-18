import Link from "next/link";
import { adminCategories } from "@/server/admin";
import { ProductForm } from "@/components/admin/forms";
export default async function NewProductPage() {
  const categories = await adminCategories();
  return <section className="panel admin-editor"><h1 className="admin-title">Add product</h1>{!categories.length && <p>Create a <Link className="text-link" href="/admin/categories/new">category</Link> first.</p>}<ProductForm categories={categories.map(({ id, name }) => ({ id, name }))}/></section>;
}
