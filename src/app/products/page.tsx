import { CatalogSkeleton } from "@/components/skeleton";
import { pageMetadata } from "@/i18n/server";
import { T } from "@/components/locale-provider";
import { getProducts, getCategories } from "@/server/catalog";
import { Suspense } from "react";
import { Catalog } from "@/components/catalog";
import { PageIntro } from "@/components/ui";
export async function generateMetadata() { return pageMetadata("The collection"); }
export default function ProductsPage() { return <div className="container page-space"><PageIntro eyebrow="THE DIGITAL COLLECTION" title="Tools for your next chapter."><T text="Thoughtfully crafted resources for building, creating, and getting things done."/></PageIntro><Suspense fallback={<CatalogSkeleton/>}><DatabaseCatalog/></Suspense></div>; }

async function DatabaseCatalog() { const [products, categories] = await Promise.all([getProducts(), getCategories()]); return <Catalog products={products} categories={categories}/>; }
