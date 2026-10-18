import { Icon, SymbolIcon } from "@/components/icon";
import Link from "next/link";
import { getCategories } from "@/server/catalog";
import { PageIntro } from "@/components/ui";
export const metadata = { title: "Categories" };
export default async function CategoriesPage() { const categories = await getCategories(); return <div className="container page-space"><PageIntro eyebrow="FIND YOUR FOCUS" title="A toolkit for every ambition.">Find the resources that fit the way you work, and where you want to go next.</PageIntro><div className="category-grid category-page">{categories.map(c => <Link key={c.name} href={`/products?category=${encodeURIComponent(c.name)}`} className="category-card"><span className="category-symbol"><SymbolIcon symbol={c.symbol}/></span><small>{c.productCount} DIGITAL PRODUCTS</small><h2>{c.name} <span><Icon name="arrow"/></span></h2><p>{c.description}</p><span className="text-link">Explore collection <Icon name="right"/></span></Link>)}</div></div>; }

