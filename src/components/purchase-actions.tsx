"use client";
import { Icon } from "@/components/icon";

import Link from "next/link";
import { useCart } from "./cart-provider";
import { whatsappOrderUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/catalog";
export function PurchaseActions({ product }: { product: Product }) { const cart = useCart(); const added = cart.ids.includes(product.id); return <><div className="purchase-actions"><a className="button primary" href={whatsappOrderUrl([product])} target="_blank" rel="noopener noreferrer">Commander sur WhatsApp <Icon name="arrow"/></a><button className="button secondary" disabled={!cart.ready || added} onClick={() => cart.add(product.id)}>{added ? <><Icon name="check"/> Added to cart</> : "Add to cart"}</button></div><p className="small" aria-live="polite">{cart.notice || (added ? <Link href="/cart">View your cart <Icon name="right"/></Link> : "We confirm availability and purchase details personally on WhatsApp.")}</p></>; }
