import { getLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
import { LocaleProvider, T } from "@/components/locale-provider";
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
import "./locale.css";
import "./glass-material.css";
import "./skeleton.css";
import "./payments.css";
export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); return { title: { default: `${store.name} — ${translate(locale, "Premium digital tools & AI services.")}`, template: `%s | ${store.name}` }, description: translate(locale, store.description), icons: { icon: "/icon.svg" }, openGraph: { locale: {en:"en_US",fr:"fr_FR",ar:"ar",ma:"ar_MA"}[locale] } }; }
async function LocalizedApp({ children }: { children: React.ReactNode }) { return <LocaleProvider initialLocale={await getLocale()}><CartProvider><CustomerTheme><a className="skip-link" href="#main"><T text="Skip to content"/></a><Suspense fallback={null}><Header/></Suspense><main id="main">{children}</main><Footer/></CustomerTheme></CartProvider></LocaleProvider>; }
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" dir="ltr" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: "(function(){var m=document.cookie.match(/(?:^|; )ai-store-locale=(en|fr|ar|ma)(?:;|$)/);var l=m?m[1]:'en';document.documentElement.lang=l==='ma'?'ary':l;document.documentElement.dir=l==='ar'||l==='ma'?'rtl':'ltr'})()" }}/><script dangerouslySetInnerHTML={{ __html: "(function(){try{document.documentElement.dataset.storeTheme=localStorage.getItem('ai-store-theme')==='light'?'light':'dark'}catch(e){document.documentElement.dataset.storeTheme='dark'}})()" }}/></head><body><Suspense fallback={null}><LocalizedApp>{children}</LocalizedApp></Suspense></body></html>; }



