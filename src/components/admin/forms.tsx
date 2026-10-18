"use client";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { saveProduct, saveCategory, deleteRecord, toggleProduct } from "@/actions/admin";
import type { ActionState } from "@/lib/validation";

export type ProductFormValue = {
  oldPrice?: string; imageUrl?: string;
  id: string; name: string; slug: string; categoryId: string; description: string;
  fullDescription: string; price: string; badge: string; featured: boolean; active: boolean;
  released: string; symbol: string; color: string; features: string; format: string;
};
export type CategoryFormValue = { id: string; name: string; slug: string; description: string; symbol: string };
function Feedback({ state }: { state: ActionState }) { return state.error ? <p className="form-error" role="alert">{state.error}</p> : null; }
export function ProductForm({ product, categories }: { product?: ProductFormValue; categories: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(saveProduct.bind(null, product?.id || null), {});
  const [preview, setPreview] = useState(product?.imageUrl || "");
  useEffect(() => () => { if (preview.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);
  return <form action={action} className="form product-editor-form">
    <div className="editor-section-heading"><span>01 / MEDIA</span><h2>Product picture</h2><p>Upload or replace the picture shown in your storefront. Changes go live when you save.</p></div>
    <label>Product image <span className="muted">(optional · JPEG, PNG, WebP · up to 3 MB)</span><input name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { const file = event.target.files?.[0]; if (file && file.size > 3 * 1024 * 1024) { event.target.setCustomValidity("Choose an image up to 3 MB."); event.target.reportValidity(); return; } event.target.setCustomValidity(""); if (preview.startsWith("blob:")) URL.revokeObjectURL(preview); setPreview(file ? URL.createObjectURL(file) : product?.imageUrl || ""); }}/></label>
    {preview ? <div className="upload-preview"><Image unoptimized width={360} height={240} src={preview} alt="Selected product image"/></div> : <div className="upload-empty"><span>No picture selected</span><p>Your product will use its fallback artwork until you upload a picture.</p></div>}
    {product?.imageUrl && <label className="checkbox-row"><input type="checkbox" name="removeImage"/> Remove current image (a new upload takes priority)</label>}
    <div className="editor-section-heading"><span>02 / PRODUCT</span><h2>Name, pricing & visibility</h2><p>Set the details customers see on your product card.</p></div>
    <div className="form-row"><label>Product name<input name="name" defaultValue={product?.name} required minLength={2} maxLength={120}/></label><label>URL slug<input name="slug" defaultValue={product?.slug} placeholder="Generated from name" pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100}/></label></div>
    <div className="form-row"><label>Category<select name="categoryId" defaultValue={product?.categoryId || categories[0]?.id} required>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>Price in MAD<input name="price" inputMode="decimal" defaultValue={product?.price} required placeholder="490.00" pattern="(0|[1-9][0-9]{0,5})(\.[0-9]{1,2})?"/></label></div>
    <label>Short description<textarea name="description" defaultValue={product?.description} required minLength={10} maxLength={500} rows={3}/></label>
    <div className="form-row"><label>Old price in MAD (optional)<input name="oldPrice" inputMode="decimal" defaultValue={product?.oldPrice} placeholder="Before discount" pattern="(0|[1-9][0-9]{0,5})(\.[0-9]{1,2})?"/></label><label>Badge (optional)<input name="badge" defaultValue={product?.badge} list="product-badges" maxLength={40}/><datalist id="product-badges"><option value="Best Seller"/><option value="Promo"/><option value="New"/></datalist></label></div>
    <div className="checkbox-row"><label><input type="checkbox" name="active" defaultChecked={product?.active ?? true}/> Active — visible in the storefront</label></div>
    <details className="product-options" open><summary>03 / Full description, features & presentation</summary><p className="editor-help">These details appear on the product page. You can edit every field below.</p>
    <label>Full description<textarea name="fullDescription" defaultValue={product?.fullDescription} minLength={10} maxLength={10000} rows={6}/></label>
    <label>Features <span className="muted">(one per line, up to 20)</span><textarea name="features" defaultValue={product?.features || "Contact us for product details and availability."} required maxLength={5000} rows={5}/></label>
    <div className="form-row"><label>File formats<input name="format" defaultValue={product?.format || "Digital product"} required maxLength={80}/></label></div>
    <div className="form-row"><label>Visual symbol<input name="symbol" defaultValue={product?.symbol || "✳"} required maxLength={12}/></label><label>Color<select name="color" defaultValue={product?.color || "mint"}>{["mint", "violet", "peach", "blue"].map(color => <option key={color}>{color}</option>)}</select></label></div>
    <label>Release date<input name="released" type="date" defaultValue={product?.released || new Date().toISOString().slice(0, 10)} required/></label>
    <div className="checkbox-row"><label><input type="checkbox" name="featured" defaultChecked={product?.featured}/> Featured product</label></div></details>
    <Feedback state={state}/><div className="editor-save-row"><p>Save to update the live storefront.</p><button className="button primary" disabled={pending || !categories.length}>{pending ? "Saving…" : product ? "Save changes →" : "Create product →"}</button></div>
  </form>;
}
export function CategoryForm({ category }: { category?: CategoryFormValue }) {
  const [state, action, pending] = useActionState(saveCategory.bind(null, category?.id || null), {});
  return <form action={action} className="form"><label>Category name<input name="name" defaultValue={category?.name} required minLength={2} maxLength={80}/></label><label>URL slug<input name="slug" defaultValue={category?.slug} required maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*"/></label><label>Description<textarea name="description" defaultValue={category?.description} required minLength={5} maxLength={500} rows={4}/></label><label>Visual symbol<input name="symbol" defaultValue={category?.symbol || "✳"} required maxLength={12}/></label><Feedback state={state}/><button className="button primary" disabled={pending}>{pending ? "Saving…" : "Save category →"}</button></form>;
}
export function DeleteForm({ kind, id }: { kind: "product" | "category"; id: string }) {
  const [state, action, pending] = useActionState(deleteRecord.bind(null, kind, id), {});
  return <details className="delete-panel"><summary>Delete this {kind}</summary><form action={action} className="form"><p className="small">{kind === "product" ? "This permanently removes the product from the catalog. Existing order snapshots are preserved. To temporarily hide it, turn off storefront visibility instead." : "A category can only be deleted after its products have been reassigned or removed."}</p><div className="checkbox-row"><label><input name="confirm" type="checkbox" required/> I want to permanently delete this {kind}.</label></div><Feedback state={state}/><button className="button danger" disabled={pending}>{pending ? "Deleting…" : `Delete ${kind}`}</button></form></details>;
}

export function ProductToggle({ id, active }: { id: string; active: boolean }) {
  const [state, action, pending] = useActionState(toggleProduct.bind(null, id, !active), {});
  return <form action={action}><button className="text-button" disabled={pending}>{pending ? "Updating…" : active ? "Disable" : "Enable"}</button><Feedback state={state}/><span className="sr-only" role="status">{state.success}</span></form>;
}
