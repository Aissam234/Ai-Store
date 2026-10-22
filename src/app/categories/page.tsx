import { Suspense } from "react";
import { CategorySkeleton } from "@/components/skeleton";
import { pageMetadata } from "@/i18n/server";
import { T } from "@/components/locale-provider";
import { Icon, SymbolIcon } from "@/components/icon";
import Link from "next/link";
import { getCategories } from "@/server/catalog";
import { PageIntro } from "@/components/ui";
export async function generateMetadata() { return pageMetadata("Categories"); }
export default function CategoriesPage() { return <div className="container page-space"><PageIntro eyebrow="FIND YOUR FOCUS" title="A toolkit for every ambition."><T text="Find the resources that fit the way you work, and where you want to go next."/></PageIntro><Suspense fallback={<CategorySkeleton page/>}><CategoryCollection/></Suspense></div>; }


async function CategoryCollection() { const categories = (await getCategories()).filter(category => category.productCount > 0); return <div className="category-grid category-page">{categories.map(c => <Link key={c.id} href={`/products?category=${encodeURIComponent(c.name)}`} className="category-card"><span className="category-symbol"><SymbolIcon symbol={c.symbol}/></span><small>{c.productCount} <T text="DIGITAL PRODUCTS"/></small><h2>{<T text={c.name}/>} <span><Icon name="arrow"/></span></h2><p>{<T text={c.description}/>}</p><span className="text-link"><T text="Explore collection"/> <Icon name="right"/></span></Link>)}</div>; }
