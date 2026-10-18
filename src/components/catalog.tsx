"use client";
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
function CatalogResults({ initial, products, categories, offers }: CatalogProps & { initial: string | null; offers: boolean }) {
  const [category, setCategory] = useState(initial && categories.some(c => c.name === initial) ? initial : "All products"); const [query, setQuery] = useState(""); const [sort, setSort] = useState("featured");
  const [offersOnly, setOffersOnly] = useState(offers);
  const results = products.filter(p => (!offersOnly || (p.oldPrice !== undefined && p.oldPrice > p.price)) && (category === "All products" || p.category === category) && `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(query.toLowerCase().trim())).sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "newest" ? b.released.localeCompare(a.released) : Number(b.featured) - Number(a.featured));
  return <><div className="catalog-toolbar"><label className="search-field"><span aria-hidden="true"><Icon name="search"/></span><input type="search" aria-label="Search products" placeholder="Search products, tools, and services…" value={query} onChange={e => setQuery(e.target.value)}/></label><label className="sort-field">Sort by<select value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="newest">Newest</option></select></label></div><div className="filters" aria-label="Filter by category">{["All products", ...categories.map(c => c.name)].map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}<button className="offers-chip" aria-pressed={offersOnly} onClick={() => setOffersOnly(!offersOnly)}>Offers <Icon name="spark"/></button></div><div className="results-meta" role="status">{results.length} {results.length === 1 ? "product" : "products"}<span>Digital resources · One-time prices · MAD</span></div>{results.length ? <div className="product-grid">{results.map(p => <ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><span><Icon name="search"/></span><h2>No matches just yet.</h2><p>Try a different search or explore the full collection.</p><button className="button primary" onClick={() => { setQuery(""); setCategory("All products"); setOffersOnly(false); }}>Reset filters</button></div>}<p className="demo-note">Order on WhatsApp. Availability and delivery are confirmed personally before purchase.</p></>;
}


