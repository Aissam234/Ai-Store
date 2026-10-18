import { Suspense } from "react";
import type { Metadata } from "next";
import { store } from "@/config/store";
import { CartProvider } from "@/components/cart-provider";
import { Header } from "@/components/shell";
import { Footer } from "@/components/footer";
import { CustomerTheme } from "@/components/customer-theme";
import "./globals.css";
import "./storefront.css";
import "./glass-pass.css";
import "./crimson.css";
import "./admin-theme.css";
export const metadata: Metadata = { title: { default: `${store.name} — Premium digital tools & AI services.`, template: `%s | ${store.name}` }, description: store.description, icons: { icon: "/icon.svg" } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: "(function(){try{document.documentElement.dataset.storeTheme=localStorage.getItem('ai-store-theme')==='light'?'light':'dark'}catch(e){document.documentElement.dataset.storeTheme='dark'}})()" }}/></head><body><CartProvider><CustomerTheme><a className="skip-link" href="#main">Skip to content</a><Suspense fallback={<header className="site-header"><div className="container nav"><span className="brand">{store.name}</span></div></header>}><Header/></Suspense><main id="main">{children}</main><Footer/></CustomerTheme></CartProvider></body></html>; }



