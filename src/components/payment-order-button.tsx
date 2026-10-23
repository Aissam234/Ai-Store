"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "./locale-provider";
import { Icon } from "./icon";
import { availablePaymentMethods, type PaymentMethod } from "@/config/payments";
import { whatsappOrderUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/catalog";
import { localizeProduct } from "@/i18n/config";
import { formatPrice } from "@/config/store";

function MethodImage({ method }: { method: PaymentMethod }) {
  const [failed, setFailed] = useState(false);
  return <span className="payment-logo" aria-hidden="true">{method.image && !failed
    // Custom public assets can be replaced without an image-service dependency.
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={method.image} alt="" onError={() => setFailed(true)}/>
    : <span>{method.id === "other" ? "…" : method.name.split(" ").map(word => word[0]).join("").slice(0, 3)}</span>}</span>;
}

export function PaymentOrderButton({ products, className = "button primary" }: { products: Product[]; className?: string }) {
  const { locale, t } = useLocale();
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useId();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [notice, setNotice] = useState("");
  const methods = availablePaymentMethods();
  const method = methods.find(item => item.id === selected);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  function close() { dialog.current?.close(); setOpen(false); }
  async function copy(value: string) {
    try { await navigator.clipboard.writeText(value); setNotice(t("Copied")); }
    catch { setNotice(t("Select the value and copy it manually.")); }
  }
  return <>
    <button type="button" className={className} disabled={!products.length} onClick={() => { setSelected(""); setNotice(""); setOpen(true); }}>{t("Order on WhatsApp")} <Icon name="arrow"/></button>
    {open && <dialog ref={dialog} className="payment-dialog" aria-labelledby={heading} onCancel={close} onClose={() => setOpen(false)}>
      <div className="payment-heading"><div><span className="eyebrow">{t("Manual payment")}</span><h2 id={heading}>{t("Choose a payment method")}</h2></div><button type="button" className="payment-close" aria-label={t("Close")} onClick={close}>×</button></div>
      <p>{t("No payment is collected here. Confirm the details with us on WhatsApp before paying.")}</p>
      <div className="payment-products">{products.map(product => <div key={product.id}><bdi>{localizeProduct(product, locale).name}</bdi><bdi dir="ltr">{formatPrice(product.price)}</bdi></div>)}</div>
      <div className="payment-methods" role="group" aria-label={t("Payment method")}>{methods.map(item => <button type="button" key={item.id} className="payment-method" aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setNotice(""); }}><MethodImage method={item}/><span><strong><bdi>{t(item.name)}</bdi></strong><small>{t(item.description)}</small></span><span className="payment-check" aria-hidden="true">{selected === item.id ? "✓" : ""}</span></button>)}</div>
      {!methods.length && <p role="status">{t("Payment methods are temporarily unavailable. Please contact support.")}</p>}
      {method && <section className="payment-instructions" aria-label={t(method.name)}><h3><bdi>{t(method.name)}</bdi></h3><p>{t(method.instructions)}</p><div className="payment-values">{method.details.map((detail, index) => <div key={index}><label htmlFor={`${heading}-${index}`}>{t(detail.label)}</label>{detail.value ? <div className="payment-copy"><input id={`${heading}-${index}`} dir="auto" readOnly value={detail.value} onFocus={event => event.target.select()}/><button type="button" className="button secondary" aria-label={`${t("Copy")}: ${t(detail.label)}`} onClick={() => copy(detail.value)}>{t("Copy")}</button></div> : <p className="small">{t("Not configured — request details on WhatsApp.")}</p>}</div>)}</div><p className="small" role="status">{notice}</p></section>}
      <div className="payment-footer">{method ? <a className="button primary" href={whatsappOrderUrl(products, locale, method.name)} target="_blank" rel="noopener noreferrer">{t("Continue on WhatsApp")} <Icon name="arrow"/></a> : <button className="button primary" disabled>{t("Select a payment method to continue")}</button>}</div>
    </dialog>}
  </>;
}
