"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icon";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Overview", icon: "grid" },
  { href: "/admin/products", label: "Products", icon: "layers" },
  { href: "/admin/categories", label: "Categories", icon: "tag" },
  { href: "/admin/orders", label: "Orders", icon: "diamond" },
];
export function AdminNavigation() {
  const path = usePathname();
  return <nav className="admin-nav" aria-label="Administration">{items.map(item => {
    const active = item.href === "/admin" ? path === item.href : path.startsWith(item.href);
    return <Link href={item.href} key={item.href} aria-current={active ? "page" : undefined}><Icon name={item.icon}/>{item.label}</Link>;
  })}</nav>;
}
