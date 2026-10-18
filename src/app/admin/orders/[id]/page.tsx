import Link from "next/link";
import { notFound } from "next/navigation";
import { adminOrder } from "@/server/admin";
import { formatPrice } from "@/config/store";
export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const order = await adminOrder((await params).id); if (!order) notFound();
  return <><div className="section-heading"><div><span className="eyebrow">UNPAID CHECKOUT DRAFT</span><h1 className="admin-title break-word">{order.id}</h1></div><Link href="/admin/orders" className="text-link">← All orders</Link></div><div className="detail-content"><section className="panel"><h2>Customer details</h2><p>{order.customerName}<br/>{order.customerEmail}<br/>{order.company}</p><p className="small">Account: {order.user.name} ({order.user.email})<br/>Created: {order.createdAt.toISOString()}<br/>Status: {order.status} · No payment collected</p></section><section className="panel"><h2>Order summary</h2><ul className="feature-list">{order.items.map(item => <li key={item.id}><span>{item.quantity} ×</span>{item.productName}<strong>{formatPrice(item.unitPriceMinor / 100)}</strong></li>)}</ul><div className="summary-total"><span>Draft total</span><strong>{formatPrice(order.totalMinor / 100)}</strong></div><p className="small">These are price and product snapshots recorded when the draft was created. No payment or delivery entitlement exists.</p></section></div></>;
}
