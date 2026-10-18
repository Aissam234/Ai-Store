import { Suspense } from "react";
import Link from "next/link";
import { AdminNavigation } from "@/components/admin/navigation";
import { requireAdmin } from "@/server/auth";
export const metadata = { title: "Administration", robots: { index: false, follow: false } };
async function AdminGate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <div className="container page-space admin-workspace"><div className="section-heading"><div><span className="eyebrow">STORE ADMINISTRATION</span><h2>Your store. In focus.</h2><p className="admin-intro">Your collection, your customers, every detail.</p></div><Link href="/account" className="text-link">Your account ↗</Link></div><AdminNavigation/>{children}</div>;
}
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <Suspense fallback={<div className="container loading">Checking access…</div>}><AdminGate>{children}</AdminGate></Suspense>; }
