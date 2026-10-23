"use client";
import { T, useLocale } from "@/components/locale-provider";

import { localizeProduct } from "@/i18n/config";

import { Icon } from "@/components/icon";

import Link from "next/link";
import { useCart } from "./cart-provider";
import { PaymentOrderButton } from "./payment-order-button";
import type { Product } from "@/types/catalog";
export function PurchaseActions({ product: sourceProduct }: { product: Product }) { const { locale, t } = useLocale(); const product = localizeProduct(sourceProduct, locale); const cart = useCart(); const added = cart.ids.includes(product.id); return <><div className="purchase-actions"><PaymentOrderButton products={[sourceProduct]}/><button className="button secondary" disabled={!cart.ready || added} onClick={() => cart.add(product.id)}>{added ? <><Icon name="check"/> <T text="Added to cart"/></> : t("Add to cart")}</button></div><p className="small" aria-live="polite">{(cart.notice && t(cart.notice)) || (added ? <Link href="/cart"><T text="View your cart"/> <Icon name="right"/></Link> : t("We confirm availability and purchase details personally on WhatsApp."))}</p></>; }
