import { ProductDetailSkeleton } from "@/components/skeleton";
import { T } from "@/components/locale-provider";
import { getLocale } from "@/i18n/server";
import { localizeProduct } from "@/i18n/config";
import { translate } from "@/i18n/messages";
import { Icon } from "@/components/icon";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts, getProductBySlug } from "@/server/catalog";
import { faqs } from "@/data/faqs";

import { ProductVisual, ProductCard, ProductPrice, FaqList } from "@/components/ui";
import { PurchaseActions } from "@/components/purchase-actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const locale = await getLocale(); const row = await getProductBySlug((await params).slug); const p = row ? localizeProduct(row, locale) : undefined; return { title: p?.name || translate(locale, "Product not found"), description: p?.description }; }
export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) { return <Suspense fallback={<ProductDetailSkeleton/>}><ProductContent params={params}/></Suspense>; }
async function ProductContent({ params }: { params: Promise<{ slug: string }> }) { const row = await getProductBySlug((await params).slug); if (!row) notFound(); const locale = await getLocale(); const product = localizeProduct(row, locale); const products = await getProducts(); return <div className="container page-space"><nav className="breadcrumbs" aria-label={translate(locale, "Breadcrumb")}><Link href="/products"><T text="Collection"/></Link><span>/</span><span>{product.name}</span></nav><div className="product-detail"><ProductVisual product={product} large/><div className="product-info"><div className="card-meta"><span className="eyebrow">{<T text={product.category}/>}</span><span className="badge">{<T text={product.badge}/>}</span></div><h1>{product.name}</h1><p className="lead">{product.description}</p><div className="detail-price"><ProductPrice product={product}/><span><T text="Order personally on WhatsApp"/></span></div><PurchaseActions product={product}/><div className="product-facts"><div><span><T text="File formats"/></span><strong>{product.format}</strong></div><div><span><T text="License"/></span><strong><T text="Confirmed with your order"/></strong></div><div><span><T text="Availability"/></span><strong><T text="Contact us on WhatsApp"/></strong></div></div><p className="small"><T text="No online payment. We confirm availability, payment arrangements and delivery with you on WhatsApp."/></p></div></div><div className="detail-content"><section><span className="eyebrow"><T text="A CLOSER LOOK"/></span><h2><T text="Made to move your work forward."/></h2><p>{product.fullDescription}</p></section><section className="panel"><h3><T text="Inside the toolkit"/></h3><ul className="feature-list">{product.features.map(f => <li key={f}><span><Icon name="check"/></span>{f}</li>)}</ul></section></div><section className="section faq-preview"><div><h2><T text="A few useful details."/></h2><p><T text="Need a hand choosing?"/></p><Link className="text-link" href="/support"><T text="Visit support"/> <Icon name="arrow"/></Link></div><FaqList items={[faqs[1], faqs[3], faqs[4]]}/></section><section className="section"><div className="section-heading"><div><span className="eyebrow"><T text="BETTER TOGETHER"/></span><h2><T text="Keep exploring."/></h2></div><Link href="/products" className="text-link"><T text="All products"/> <Icon name="arrow"/></Link></div><div className="product-grid three">{[...products.filter(p => p.category === product.category && p.id !== product.id), ...products.filter(p => p.category !== product.category)].slice(0, 3).map(p => <ProductCard key={p.id} product={p}/>)}</div></section></div>; }


