import { getProducts, getCategories } from "@/server/catalog";
import { Suspense } from "react";
import { Catalog } from "@/components/catalog";
import { PageIntro } from "@/components/ui";
export const metadata = { title: "The collection" };
export default function ProductsPage() { return <div className="container page-space"><PageIntro eyebrow="THE DIGITAL COLLECTION" title="Tools for your next chapter.">Thoughtfully crafted resources for building, creating, and getting things done.</PageIntro><Suspense fallback={<p className="loading">Loading the collection…</p>}><DatabaseCatalog/></Suspense></div>; }

async function DatabaseCatalog() { const [products, categories] = await Promise.all([getProducts(), getCategories()]); return <Catalog products={products} categories={categories}/>; }
