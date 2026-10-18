import { pageMetadata } from "@/i18n/server";
import { T } from "@/components/locale-provider";
import { Icon } from "@/components/icon";
import Link from "next/link";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui";
import { requireUser } from "@/server/auth";
import { getDb } from "@/server/db";
import { logout } from "@/actions/auth";
import { formatPrice } from "@/config/store";
export async function generateMetadata() { return pageMetadata("Your account"); }
async function AccountContent() {
  const user = await requireUser();
  const orders = await getDb().order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50, include: { items: true } });
  return <><PageIntro eyebrow="YOUR ACCOUNT" title="Welcome, {name}." values={{name:user.name}}><T text="Your profile and your latest 50 unpaid checkout drafts."/></PageIntro><div className="panel account-profile"><div><h2>{user.name}</h2><p>{user.email}</p><span className="badge">{<T text={user.role}/>}</span></div><div className="button-row">{user.role === "ADMIN" && <Link className="button secondary" href="/admin"><T text="Open administration"/> <Icon name="arrow"/></Link>}<form action={logout}><button className="button secondary"><T text="Sign out"/></button></form></div></div><section className="section"><div className="section-heading"><h2><T text="Your checkout drafts"/></h2><Link className="text-link" href="/cart"><T text="View your cart"/> <Icon name="right"/></Link></div>{orders.length ? <div className="admin-stack">{orders.map(order => <article className="panel" key={order.id}><div className="section-heading"><div><span className="eyebrow">{order.createdAt.toISOString().slice(0, 10)}</span><h3 className="break-word"><T text="Draft"/> {order.id}</h3></div><span className="badge"><T text="Unpaid ·"/> {<T text={order.status}/>}</span></div><ul className="feature-list">{order.items.map(item => <li key={item.id}>{item.productName}<span>{formatPrice(item.unitPriceMinor / 100)}</span></li>)}</ul><p><strong>{formatPrice(order.totalMinor / 100)}</strong> <T text="· No payment collected. This draft does not grant access to downloads."/></p></article>)}</div> : <div className="empty-state"><h2><T text="Nothing here just yet."/></h2><p><T text="Your saved checkout drafts will appear here."/></p><Link href="/products" className="button primary"><T text="Explore products"/> <Icon name="arrow"/></Link></div>}</section></>;
}
export default function AccountPage() { return <div className="container page-space"><Suspense fallback={<p className="loading"><T text="Loading your account…"/></p>}><AccountContent/></Suspense></div>; }
