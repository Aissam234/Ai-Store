import { Icon } from "@/components/icon";
import Link from "next/link";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui";
import { requireUser } from "@/server/auth";
import { getDb } from "@/server/db";
import { logout } from "@/actions/auth";
import { formatPrice } from "@/config/store";
export const metadata = { title: "Your account" };
async function AccountContent() {
  const user = await requireUser();
  const orders = await getDb().order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50, include: { items: true } });
  return <><PageIntro eyebrow="YOUR ACCOUNT" title={`Welcome, ${user.name}.`}>Your profile and your latest 50 unpaid checkout drafts.</PageIntro><div className="panel account-profile"><div><h2>{user.name}</h2><p>{user.email}</p><span className="badge">{user.role}</span></div><div className="button-row">{user.role === "ADMIN" && <Link className="button secondary" href="/admin">Open administration <Icon name="arrow"/></Link>}<form action={logout}><button className="button secondary">Sign out</button></form></div></div><section className="section"><div className="section-heading"><h2>Your checkout drafts</h2><Link className="text-link" href="/cart">View your cart <Icon name="right"/></Link></div>{orders.length ? <div className="admin-stack">{orders.map(order => <article className="panel" key={order.id}><div className="section-heading"><div><span className="eyebrow">{order.createdAt.toISOString().slice(0, 10)}</span><h3 className="break-word">Draft {order.id}</h3></div><span className="badge">Unpaid · {order.status}</span></div><ul className="feature-list">{order.items.map(item => <li key={item.id}>{item.productName}<span>{formatPrice(item.unitPriceMinor / 100)}</span></li>)}</ul><p><strong>{formatPrice(order.totalMinor / 100)}</strong> · No payment collected. This draft does not grant access to downloads.</p></article>)}</div> : <div className="empty-state"><h2>Nothing here just yet.</h2><p>Your saved checkout drafts will appear here.</p><Link href="/products" className="button primary">Explore products <Icon name="arrow"/></Link></div>}</section></>;
}
export default function AccountPage() { return <div className="container page-space"><Suspense fallback={<p className="loading">Loading your account…</p>}><AccountContent/></Suspense></div>; }
