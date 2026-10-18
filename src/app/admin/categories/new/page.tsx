import { requireAdmin } from "@/server/auth";
import { CategoryForm } from "@/components/admin/forms";
export default async function NewCategoryPage() { await requireAdmin(); return <section className="panel admin-editor"><h1 className="admin-title">Add category</h1><CategoryForm/></section>; }
