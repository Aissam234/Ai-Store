"use client";
import { T, useLocale } from "@/components/locale-provider";

import { localizeProduct } from "@/i18n/config";

import { Icon } from "@/components/icon";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product, Category } from "@/types/catalog";
import { ProductCard } from "./ui";
type CatalogProps = { products: Product[]; categories: Category[] };
export function Catalog({ products, categories }: CatalogProps) {
  const params = useSearchParams();
  return <CatalogResults products={products} categories={categories} key={`${params.get("category") || "all"}-${params.get("offers") || "0"}`} initial={params.get("category")} offers={params.get("offers") === "1"}/>;
}
function CatalogResults({ initial, products: sourceProducts, categories, offers }: CatalogProps & { initial: string | null; offers: boolean }) {
  const { locale, t } = useLocale();
  const products = sourceProducts.map(product => localizeProduct(product, locale));
  const [category, setCategory] = useState(initial && categories.some(c => c.name === initial) ? initial : "All products"); const [query, setQuery] = useState(""); const [sort, setSort] = useState("featured");
  const [offersOnly, setOffersOnly] = useState(offers);
  const results = products.filter(p => (!offersOnly || (p.oldPrice !== undefined && p.oldPrice > p.price)) && (category === "All products" || p.category === category) && `${p.name} ${p.description} ${t(p.category)}`.toLowerCase().includes(query.toLowerCase().trim())).sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "newest" ? b.released.localeCompare(a.released) : Number(b.featured) - Number(a.featured));
  return <><div className="catalog-toolbar"><label className="search-field"><span aria-hidden="true"><Icon name="search"/></span><input type="search" aria-label={t("Search products")} placeholder={t("Search products, tools, and services…")} value={query} onChange={e => setQuery(e.target.value)}/></label><label className="sort-field"><T text="Sort by"/><select value={sort} onChange={e => setSort(e.target.value)}><option value="featured"><T text="Featured"/></option><option value="low"><T text="Price: low to high"/></option><option value="high"><T text="Price: high to low"/></option><option value="newest"><T text="Newest"/></option></select></label></div><div className="filters" aria-label={t("Filter by category")}>{["All products", ...categories.filter(c => c.productCount > 0).map(c => c.name)].map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{t(c)}</button>)}<button className="offers-chip" aria-pressed={offersOnly} onClick={() => setOffersOnly(!offersOnly)}><T text="Offers"/> <Icon name="spark"/></button></div><div className="results-meta" role="status">{t("{count} products", {count: results.length})}</div>{results.length ? <div className="product-grid">{results.map(p => <ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><span><Icon name="search"/></span><h2><T text="No matches just yet."/></h2><p><T text="Try a different search or explore the full collection."/></p><button className="button primary" onClick={() => { setQuery(""); setCategory("All products"); setOffersOnly(false); }}><T text="Reset filters"/></button></div>}<p className="demo-note"><T text="Order on WhatsApp. Availability and delivery are confirmed personally before purchase."/></p></>;
}


