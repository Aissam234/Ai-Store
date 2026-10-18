import Link from "next/link";
import { adminCategories } from "@/server/admin";
export default async function CategoriesAdmin() {
  const categories = await adminCategories();
  return <><div className="section-heading"><h1 className="admin-title">Categories</h1><Link className="button primary" href="/admin/categories/new">Add category ↗</Link></div><div className="table-scroll"><table className="admin-table"><caption className="sr-only">Product categories</caption><thead><tr><th>Category</th><th>Slug</th><th>Products</th><th>Action</th></tr></thead><tbody>{categories.map(category => <tr key={category.id}><td>{category.symbol} {category.name}</td><td>{category.slug}</td><td>{category._count.products}</td><td><Link className="text-link" href={`/admin/categories/${category.id}`}>Edit <span className="sr-only">{category.name}</span>→</Link></td></tr>)}</tbody></table>{!categories.length && <p className="panel">No categories yet. Add the first one to start your catalog.</p>}</div></>;
}
