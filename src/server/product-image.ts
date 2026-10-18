import sharp from "sharp";
export async function normalizeProductImage(file: File): Promise<Uint8Array<ArrayBuffer>> {
  if (file.size > 3 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Invalid image");
  const input = Buffer.from(await file.arrayBuffer());
  const metadata = await sharp(input, { limitInputPixels: 25_000_000 }).metadata();
  if (!["jpeg", "png", "webp"].includes(metadata.format || "")) throw new Error("Invalid image");
  return new Uint8Array(await sharp(input, { limitInputPixels: 25_000_000 }).rotate().resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer());
}
