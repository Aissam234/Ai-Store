"use client";
import { T, useLocale } from "@/components/locale-provider";

import { offerDetails, availabilityLabel } from "@/lib/offer-details";
import { localizeProduct } from "@/i18n/config";

import { DepthStage } from "./depth-stage";
import { Icon, SymbolIcon } from "@/components/icon";
import { store } from "@/config/store";
import Link from "next/link";
import { type Product } from "@/types/catalog";
import { formatPrice } from "@/config/store";
import { ProductImage } from "./product-image";
import { PaymentOrderButton } from "./payment-order-button";
export function ProductPrice({ product }: { product: Product }) { return <div className="product-price"><strong><bdi dir="ltr">{formatPrice(product.price)}</bdi></strong>{product.oldPrice && product.oldPrice > product.price ? <><del>{formatPrice(product.oldPrice)}</del><span className="discount">−{Math.round((1 - product.price / product.oldPrice) * 100)}%</span></> : null}</div>; }
export function ProductVisual({ product: sourceProduct, large = false, flat = false }: { product: Product; large?: boolean; flat?: boolean }) { const { locale } = useLocale(); const product = localizeProduct(sourceProduct, locale); const visual = <div className={`product-visual ${product.color} ${large ? "large" : ""}`} ><ProductImage darkSrc={product.imageDarkUrl} lightSrc={product.imageLightUrl} src={product.imageUrl} name={product.name}><span className="visual-grid"/><span className="visual-label">{store.name} <T text="/ DIGITAL"/></span><span className="product-symbol"><SymbolIcon symbol={product.symbol}/></span><span className="visual-format">{product.format}</span><span className="visual-corner"><Icon name="arrow"/></span></ProductImage></div>; return flat ? visual : <DepthStage>{visual}</DepthStage>; }
export function ProductCard({ product: sourceProduct }: { product: Product }) { const { locale, t } = useLocale(); const product = localizeProduct(sourceProduct, locale); return <DepthStage card><article className={`product-card glass-product-card tone-${product.color}`}><Link href={`/products/${product.slug}`} className="visual-link" aria-label={t("Explore {name}", {name: product.name})}><ProductVisual product={product} flat/></Link><div className="card-body"><div className="card-meta"><span>{<T text={product.category}/>}</span>{product.badge && <span className="badge">{<T text={product.badge}/>}</span>}</div><h3><Link href={`/products/${product.slug}`}><bdi dir="auto">{product.name}</bdi></Link></h3><p>{product.description}</p><ProductOfferDetails product={product}/><span className="product-order-status"><i/> <T text={availabilityLabel(product.availability)}/></span><div className="card-bottom"><ProductPrice product={product}/><Link href={`/products/${product.slug}`} aria-label={t("View {name}", {name: product.name})}><T text="Explore"/> <span><Icon name="arrow"/></span></Link></div><PaymentOrderButton products={[sourceProduct]} className="button primary whatsapp-cta glass-button"/></div></article></DepthStage>; }
export function PageIntro({ eyebrow, title, children, values }: { eyebrow: string; title: string; children: React.ReactNode; values?: Record<string, string | number> }) { return <div className="page-intro"><span className="eyebrow">{<T text={eyebrow}/>}</span><h1>{<T text={title} values={values}/>}</h1><p>{children}</p></div>; }
export function FaqList({ items }: { items: { question: string; answer: string }[] }) { return <div className="faq-list">{items.map(item => <details key={item.question}><summary><T text={item.question}/><span aria-hidden="true"><Icon name="plus"/></span></summary><p>{<T text={item.answer}/>}</p></details>)}</div>; }


export function ProductOfferDetails({ product }: { product: Product }) { const { locale } = useLocale(); const details = offerDetails(product, locale); return details.length ? <dl className="offer-details">{details.map(detail => <div key={detail.label}><dt>{detail.label}</dt><dd><bdi dir={detail.latin ? "ltr" : "auto"}>{detail.value}</bdi></dd></div>)}</dl> : null; }
