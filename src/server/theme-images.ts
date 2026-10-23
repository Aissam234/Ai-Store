import { normalizeProductImage } from "./product-image";
export async function readThemeImages(form: FormData) {
  const result: { imageDarkData?: Uint8Array<ArrayBuffer> | null; imageLightData?: Uint8Array<ArrayBuffer> | null; hasDarkImage?: boolean; hasLightImage?: boolean } = {};
  for (const theme of ["Dark", "Light"] as const) {
    const file = form.get(`image${theme}`);
    if (file instanceof File && file.size) {
      try { result[`image${theme}Data`] = await normalizeProductImage(file); result[`has${theme}Image`] = true; }
      catch { throw new Error("Invalid theme image"); }
    } else if (form.get(`remove${theme}Image`) === "on") {
      result[`image${theme}Data`] = null; result[`has${theme}Image`] = false;
    }
  }
  return result;
}
