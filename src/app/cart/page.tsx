import { getProducts } from "@/server/catalog";
import { PageIntro } from "@/components/ui";
import { CartContent } from "@/components/cart-content";
export const metadata = { title: "Your cart" };
export default async function CartPage() { const products = await getProducts(); return <div className="container page-space"><PageIntro eyebrow="YOUR TOOLKIT" title="A few good choices.">Your next project is already looking promising.</PageIntro><CartContent catalog={products}/></div>; }

