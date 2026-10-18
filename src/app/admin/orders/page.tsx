import Link from "next/link";
import { adminOrders, pageNumber, PAGE_SIZE } from "@/server/admin";
import { formatPrice } from "@/config/store";
import { Pagination } from "@/components/admin/pagination";
export default async function OrdersAdmin({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = pageNumber((await searchParams).page); const { rows, count } = await adminOrders(page);
  return <><div className="section-heading"><div><h1 className="admin-title">Orders</h1><p>Unpaid checkout drafts only. No payments have been processed.</p></div></div><div className="table-scroll"><table className="admin-table"><caption className="sr-only">Unpaid order drafts</caption><thead><tr><th>Draft / date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>{rows.map(order => <tr key={order.id}><td><Link href={`/admin/orders/${order.id}`} className="text-link">{order.id}</Link><small>{order.createdAt.toISOString().slice(0, 10)}</small></td><td>{order.customerName}</td><td>{order._count.items}</td><td>{formatPrice(order.totalMinor / 100)}</td><td><span className="badge">{order.status} · Unpaid</span></td></tr>)}</tbody></table>{!rows.length && <p className="panel">No checkout drafts on this page.</p>}</div><Pagination page={page} count={count} pageSize={PAGE_SIZE} href="/admin/orders"/></>;
}
