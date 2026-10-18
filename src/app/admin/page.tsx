import Link from "next/link";
import { adminSummary } from "@/server/admin";
export default async function AdminPage() {
  const summary = await adminSummary();
  return <><div className="admin-metrics">{[["Products", summary.products, "/admin/products"], ["Categories", summary.categories, "/admin/categories"], ["Unpaid drafts", summary.orders, "/admin/orders"]].map(([label, value, href]) => <Link href={String(href)} className="panel" key={label}><span className="eyebrow">{label}</span><strong>{value}</strong></Link>)}<div className="panel"><span className="eyebrow">Customer accounts</span><strong>{summary.customers}</strong></div></div><section className="panel"><h2>Make your next update.</h2><p>Keep your collection fresh. Add products, refine their details, and organize categories. Orders are unpaid checkout drafts; purchases are confirmed personally on WhatsApp.</p><div className="button-row"><Link href="/admin/products/new" className="button primary">Add a product ↗</Link><Link href="/admin/categories/new" className="button secondary">Add a category</Link></div></section></>;
}
