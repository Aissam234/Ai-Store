"use client";
import { T, useLocale, LanguageSwitcher } from "@/components/locale-provider";

import { Icon } from "@/components/icon";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { store } from "@/config/store";
import { useCart } from "./cart-provider";
import { Brand } from "./brand";
import { ThemeToggle } from "./theme-toggle";
export function Header() {
  const { t } = useLocale();
  const path = usePathname(); const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false); const { ids } = useCart(); const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 16); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  const close = () => setOpen(false);
  if (path.startsWith("/admin")) return <header className={`site-header admin-header ${scrolled ? "is-scrolled" : ""}`}><div className="container nav"><Link className="brand" href="/admin" aria-label={t("AI STORE administration")}><Brand/></Link><span className="admin-header-label"><T text="WORKSPACE"/></span><div className="nav-actions"><LanguageSwitcher/><ThemeToggle/><Link className="button secondary" href="/"><T text="View store"/> <Icon name="arrow"/></Link><Link className="admin-account-link" href="/account"><T text="Account"/></Link></div></div></header>;
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`} onKeyDown={event => { if (event.key === "Escape" && open) { close(); toggle.current?.focus(); } }}><div className="container nav"><Link className="brand" href="/" onClick={close} aria-label={t("AI STORE home")}><Brand/></Link><nav id="main-navigation" aria-label={t("Main navigation")} className={open ? "nav-links is-open" : "nav-links"}>{[["/", "Home"], ["/products", "Products"], ["/products?offers=1", "Offers"], ["/#why-us", "Why us"], ["/support", "Contact"]].map(([href,label]) => <Link key={href} href={href} aria-current={href === path ? "page" : undefined} onClick={close}>{t(label)}</Link>)}<Link href="/account" className="mobile-account" onClick={close}><T text="My account"/></Link><a href={`https://wa.me/${store.whatsappNumber}`} className="mobile-whatsapp" target="_blank" rel="noopener noreferrer" onClick={close}><T text="Order on WhatsApp"/> <Icon name="arrow"/></a><LanguageSwitcher mobile/></nav><div className="nav-actions"><LanguageSwitcher/><Link className="nav-search" href="/products" aria-label={t("Search products")} onClick={close}><Icon name="search"/></Link>{!path.startsWith("/admin") && <ThemeToggle/>}<Link className="account-link" href="/account" onClick={close}><T text="Account"/></Link><Link className="cart-link" href="/cart" onClick={close} aria-label={t("Cart, {count} products", { count: ids.length })}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg><span className="count">{ids.length}</span></Link><a className="button primary nav-whatsapp" href={`https://wa.me/${store.whatsappNumber}`} target="_blank" rel="noopener noreferrer"><T text="WhatsApp"/> <Icon name="arrow"/></a><button ref={toggle} className="menu-toggle" aria-controls="main-navigation" aria-expanded={open} aria-label={t(open ? "Close navigation" : "Open navigation")} onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"}/></button></div></div></header>;
}
