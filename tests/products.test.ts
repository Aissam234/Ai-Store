import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { productSchema } from "../src/lib/validation";
import { whatsappOrderUrl } from "../src/lib/whatsapp";
import { normalizeProductImage } from "../src/server/product-image";
import { seedProducts } from "../prisma/seed-data";
const input = { ...seedProducts[0], categoryId: "category-1", price: "100.25", oldPrice: "150", active: true, features: "A useful feature", badge: "" };
test("discounts are optional and must exceed the actual price", () => {
  assert.equal(productSchema.parse(input).oldPrice, 15000);
  assert.equal(productSchema.parse({ ...input, oldPrice: "" }).oldPrice, null);
  for (const oldPrice of ["100.25", "99", "-1", "abc"]) assert.equal(productSchema.safeParse({ ...input, oldPrice }).success, false);
});
test("WhatsApp messages preserve product names, accents, symbols and exact prices", () => {
  const url = new URL(whatsappOrderUrl([{ name: "Création & API + Kit", price: 100.25 }], "fr"));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/212607144420");
  assert.equal(url.searchParams.get("text"), "Bonjour, je souhaite commander :\n\nProduit : Création & API + Kit\nPrix : 100.25 MAD");
});
test("images are normalized and invalid files rejected", async () => {
  const source = await sharp({ create: { width: 1800, height: 900, channels: 3, background: "#80bba0" } }).png().toBuffer();
  const output = await normalizeProductImage(new File([new Uint8Array(source)], "test.png", { type: "image/png" }));
  const meta = await sharp(output).metadata();
  assert.equal(meta.format, "webp"); assert.equal(meta.width, 1600);
  await assert.rejects(normalizeProductImage(new File(["bad"], "bad.png", { type: "image/png" })));
  await assert.rejects(normalizeProductImage(new File(["<svg/>"], "test.svg", { type: "image/svg+xml" })));
  await assert.rejects(normalizeProductImage(new File([new Uint8Array(3 * 1024 * 1024 + 1)], "large.png", { type: "image/png" })));
});
