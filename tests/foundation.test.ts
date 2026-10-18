import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, dummyPasswordHash } from "../src/lib/password";
import { checkoutSchema, priceSchema, registerSchema, productSchema } from "../src/lib/validation";
import { calculateOrder } from "../src/lib/order-pricing";
import { seedProducts, seedCategories } from "../prisma/seed-data";

test("password hashes use unique salts and reject wrong or malformed credentials", async () => {
  const password = "a long unique testing passphrase";
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.notEqual(first, second);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword("wrong passphrase", first), false);
  assert.equal(await verifyPassword(password, "scrypt-v1$invalid$hash"), false);
  assert.equal(await verifyPassword(password, dummyPasswordHash), false);
});

test("registration normalizes email, preserves password whitespace, and strips injected roles", () => {
  const parsed = registerSchema.parse({ name: " Demo Customer ", email: " Demo@EXAMPLE.COM ", password: " valid long passphrase ", role: "ADMIN" });
  assert.equal(parsed.email, "demo@example.com");
  assert.equal(parsed.name, "Demo Customer");
  assert.equal(parsed.password, " valid long passphrase ");
  assert.equal("role" in parsed, false);
  assert.equal(registerSchema.safeParse({ name: "Demo", email: "demo@example.com", password: "short" }).success, false);
});

test("MAD conversion uses centimes without floating-point rounding", () => {
  assert.equal(priceSchema.parse("490"), 49000);
  assert.equal(priceSchema.parse("0.29"), 29);
  assert.equal(priceSchema.parse("1.01"), 101);
  assert.equal(priceSchema.parse("999999.99"), 99999999);
  for (const bad of ["-1", "1.001", "1e3", "Infinity", "NaN", "1000000", "01"]) assert.equal(priceSchema.safeParse(bad).success, false);
});

const input = { ids: ["p1"], firstName: "Demo", lastName: "Customer", email: "demo@example.com", company: "", idempotencyKey: "ce458a43-0db4-416e-969e-39327383405e" };
test("checkout rejects client prices, roles, duplicate IDs, empty carts, and oversized carts", () => {
  assert.equal(checkoutSchema.safeParse(input).success, true);
  for (const data of [{ ...input, totalMinor: 1 }, { ...input, price: 1 }, { ...input, userId: "admin" }, { ...input, ids: ["p1", "p1"] }, { ...input, ids: [] }, { ...input, ids: Array.from({ length: 51 }, (_, i) => `p${i}`) }]) assert.equal(checkoutSchema.safeParse(data).success, false);
});

test("order calculation uses only supplied database prices and makes independent snapshots", () => {
  const rows = [{ id: "p1", slug: "flow", name: "Flow", priceMinor: 49000, active: true }, { id: "p2", slug: "launch", name: "Launch", priceMinor: 79000, active: true }];
  const result = calculateOrder(["p1", "p2"], rows);
  assert.equal(result.totalMinor, 128000);
  assert.equal(result.items[0].quantity, 1);
  rows[0].name = "Changed"; rows[0].priceMinor = 10;
  assert.equal(result.items[0].productName, "Flow");
  assert.equal(result.items[0].unitPriceMinor, 49000);
  assert.throws(() => calculateOrder(["missing"], rows));
  assert.throws(() => calculateOrder(["p1", "p1"], rows));
  assert.throws(() => calculateOrder(["p1"], [{ ...rows[0], active: false }]));
  assert.throws(() => calculateOrder(["p1"], [{ ...rows[0], priceMinor: -1 }]));
  assert.throws(() => calculateOrder(["p1"], [{ ...rows[0], priceMinor: 1.5 }]));
  assert.throws(() => calculateOrder(["p1", "p2"], rows.map(row => ({ ...row, priceMinor: 2_000_000_000 }))));
});

test("the preserved seed contains eight valid products in four categories", () => {
  assert.equal(seedProducts.length, 8); assert.equal(seedCategories.length, 4);
  assert.equal(new Set(seedProducts.map(product => product.id)).size, 8);
  assert.equal(new Set(seedProducts.map(product => product.slug)).size, 8);
  for (const product of seedProducts) {
    assert.ok(seedCategories.some(category => category.name === product.category));
    assert.equal(productSchema.safeParse({ ...product, price: product.price.toFixed(2), categoryId: "category-1", active: true, features: product.features.join("\n") }).success, true);
  }
});
