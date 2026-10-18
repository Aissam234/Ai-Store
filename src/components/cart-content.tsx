"use client";
import { Icon } from "@/components/icon";

import Link from "next/link";

import { useCart } from "./cart-provider";
import type { Product } from "@/types/catalog";
import { formatPrice } from "@/config/store";
import { ProductVisual } from "./ui";
import { whatsappOrderUrl } from "@/lib/whatsapp";

export function CartContent({ catalog, checkout = false }: { catalog: Product[]; checkout?: boolean }) {
  const cart = useCart();
  const products = catalog.filter(product => cart.ids.includes(product.id));
  const missing = cart.ids.filter(id => !catalog.some(product => product.id === id));
  const estimatedMinor = products.reduce((sum, product) => sum + Math.round(product.price * 100), 0);
  const total = estimatedMinor / 100;

  if (!cart.ready) return <p className="loading" role="status">Loading your saved cart…</p>;
  if (!cart.ids.length) return <div className="empty-state"><span>▢</span><h2>A little room for possibility.</h2><p>Your cart is empty. Discover a useful tool for your next project.</p><Link href="/products" className="button primary">Explore the collection <Icon name="arrow"/></Link></div>;
  return <>
    <p role="status" className="small">{cart.notice}</p>
    {!!missing.length && <div className="preview-notice missing-items"><strong>Some products are no longer available.</strong><p>Remove them before continuing. Unavailable items are excluded from the estimate.</p><ul>{missing.map(id => <li key={id}><span>Unavailable product</span><button className="text-button" onClick={() => cart.remove(id)}>Remove unavailable item</button></li>)}</ul></div>}
    <div className="cart-layout"><div>{checkout ? <section className="panel">
      <span className="eyebrow">PERSONAL SERVICE</span><h2>Complete your order on WhatsApp.</h2><p>Send us your selection. We will confirm availability, payment arrangements and delivery personally before you purchase.</p><div className="preview-notice"><strong>No online payment</strong><p>The button opens WhatsApp with your products and prices ready to send. It does not place or pay for an order automatically.</p></div>{!missing.length && products.length > 0 && <a className="button primary" href={whatsappOrderUrl(products)} target="_blank" rel="noopener noreferrer">Commander sur WhatsApp <Icon name="arrow"/></a>}
    </section> : <>
      <div className="section-heading"><h2>Your selection <span className="muted">({products.length})</span></h2><button className="text-button" onClick={cart.clear}>Clear cart</button></div>
      <div className="cart-items">{products.map(product => <article className="cart-item" key={product.id}><Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}><ProductVisual product={product}/></Link><div className="cart-item-info"><span className="eyebrow">{product.category}</span><h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3><p className="small">Digital resource · Single license</p><button className="text-button" aria-label={`Remove ${product.name}`} onClick={() => cart.remove(product.id)}>Remove</button></div><strong>{formatPrice(product.price)}</strong></article>)}</div>
      <Link href="/products" className="text-link continue-link"><Icon name="left"/> Continue exploring</Link>
    </>}</div>
    <aside className="panel order-summary"><span className="eyebrow">THE NEXT STEP</span><h2>Order summary</h2>
      {checkout && <div className="summary-products">{products.map(product => <div key={product.id}><Link href={`/products/${product.slug}`}>{product.name}</Link><span>{formatPrice(product.price)}</span></div>)}</div>}
      <div className="summary-line"><span>Estimated subtotal · {products.length} {products.length === 1 ? "product" : "products"}</span><span>{formatPrice(estimatedMinor / 100)}</span></div>
      <div className="summary-line"><span>Delivery</span><span>Arranged on WhatsApp</span></div>
      <div className="summary-total"><span>Estimated total</span><strong>{formatPrice(total)}</strong></div>
      <p className="small">Prices come from our catalog. Availability and final purchase details are confirmed on WhatsApp.</p>
      {!checkout ? <Link href="/checkout" className="button primary">Review your order <Icon name="arrow"/></Link> : <Link href="/cart" className="text-link"><Icon name="left"/> Edit your cart</Link>}
      <p className="summary-footnote">No payment is collected on this website.</p>
    </aside></div>
  </>;
}
