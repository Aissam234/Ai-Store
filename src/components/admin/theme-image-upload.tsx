"use client";
import Image from "next/image";
import { imageInputHint, imageSelectionError } from "./prepare-product-images";
import { useEffect, useState } from "react";
export function ThemeImageUpload({ theme, src }: { theme: "Dark" | "Light"; src?: string }) {
  const [preview, setPreview] = useState(src || "");
  useEffect(() => () => { if (preview.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);
  return <fieldset className="translation-group"><legend>{theme === "Dark" ? "Night mode image" : "Light mode image"}</legend><label>Upload image (optional · {imageInputHint})<input type="file" name={`image${theme}`} accept="image/jpeg,image/png,image/webp" onChange={event => { const file = event.target.files?.[0]; event.target.setCustomValidity(imageSelectionError(file)); if (!event.target.reportValidity()) return; setPreview(file ? URL.createObjectURL(file) : src || ""); }}/></label>{preview ? <div className="upload-preview"><Image unoptimized width={360} height={240} src={preview} alt={`${theme} mode product image`}/></div> : <p className="small">Uses the default image until you upload one.</p>}{src && <label className="checkbox-row"><input type="checkbox" name={`remove${theme}Image`}/>Remove this theme image (a new upload takes priority)</label>}</fieldset>;
}
