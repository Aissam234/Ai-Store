"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createCheckoutDraft, deleteDraft, resumeDraft } from "@/actions/checkout";
import { useLocale } from "./locale-provider";
import { useCart } from "./cart-provider";

const failure = "Please review your cart and try again.";
function requestId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  return [hex.slice(0,8), hex.slice(8,12), hex.slice(12,16), hex.slice(16,20), hex.slice(20)].join("-");
}
export function SaveDraft({ ids }: { ids: string[] }) {
  const { t } = useLocale();
  const router = useRouter();
  const key = useRef("");
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  async function save() {
    setPending(true);
    setError("");
    try {
      key.current ||= requestId();
      const result = await createCheckoutDraft({ ids, idempotencyKey: key.current });
      if ("orderId" in result) setSaved(true);
      else if (result.loginRequired) router.push("/login?next=%2Fcheckout");
      else setError(result.error);
    } catch { setError(failure); }
    finally { setPending(false); }
  }
  return <div>
    <button type="button" className="button secondary" disabled={pending || saved} onClick={save}>{t(pending ? "Please wait…" : "Save Checkout")}</button>
    <div role="status">{saved && <Link className="text-link" href="/account">{t("Draft saved. View in My Account.")}</Link>}{error && t(error)}</div>
  </div>;
}

export function DraftActions({ id }: { id: string }) {
  const { t } = useLocale();
  const cart = useCart();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function handle(remove: boolean) {
    if (remove && !window.confirm(t("Delete this checkout draft?"))) return;
    setPending(true);
    setMessage("");
    try {
      if (remove) {
        if (!await deleteDraft(id)) setMessage("This draft is no longer available.");
      } else {
        const draft = await resumeDraft(id);
        if (!draft?.ids.length) setMessage("No products from this draft are available.");
        else {
          cart.restore(draft.ids, draft.skipped);
          router.push("/checkout");
        }
      }
    } catch { setMessage("Could not update this draft. Please try again."); }
    finally { setPending(false); }
  }
  return <><div className="button-row">
    <button className="button secondary" disabled={!cart.ready || pending} onClick={() => handle(false)}>{t("Resume checkout")}</button>
    <button className="text-button" disabled={pending} onClick={() => handle(true)}>{t("Delete draft")}</button>
  </div><p className="small" role="status">{t(message)}</p></>;
}
