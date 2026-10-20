import { Suspense } from "react";
import { CartSkeleton } from "@/components/skeleton";
import { pageMetadata } from "@/i18n/server";
import { T } from "@/components/locale-provider";
import { getProducts } from "@/server/catalog";
import { PageIntro } from "@/components/ui";
import { CartContent } from "@/components/cart-content";
export async function generateMetadata() { return pageMetadata("Your cart"); }
export default function CartPage() { return <div className="container page-space"><PageIntro eyebrow="YOUR TOOLKIT" title="A few good choices."><T text="Your next project is already looking promising."/></PageIntro><Suspense fallback={<CartSkeleton/>}><PendingCart/></Suspense></div>; }


async function PendingCart() { return <CartContent catalog={await getProducts()}/>; }
