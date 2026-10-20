import { Suspense } from "react";
import { CartSkeleton } from "@/components/skeleton";
import { pageMetadata } from "@/i18n/server";
import { T } from "@/components/locale-provider";
import { getProducts } from "@/server/catalog";
import { PageIntro } from "@/components/ui";
import { CartContent } from "@/components/cart-content";
export async function generateMetadata() { return pageMetadata("Review your order"); }
export default function CheckoutPage() { return <div className="container page-space"><PageIntro eyebrow="ORDER / WHATSAPP" title="One step closer to what’s next."><T text="Review your selection, then contact us on WhatsApp to complete your purchase. No online payment."/></PageIntro><Suspense fallback={<CartSkeleton/>}><PendingCart/></Suspense></div>; }


async function PendingCart() { return <CartContent catalog={await getProducts()} checkout/>; }
