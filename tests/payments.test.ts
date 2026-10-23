import test from "node:test";
import assert from "node:assert/strict";
import { paymentMethods, availablePaymentMethods } from "../src/config/payments";
import { whatsappOrderUrl } from "../src/lib/whatsapp";
import { translate } from "../src/i18n/messages";

test("manual payment methods preserve placeholders and the Other option and configurable order", () => {
 assert.deepEqual(availablePaymentMethods().map(method => method.name), ["CIH Bank", "Al Barid Bank", "Cash Plus", "Binance", "Other payment method"]);
 for (const method of paymentMethods) { assert.equal(method.image, null); assert.ok(method.details.every(detail => detail.value === "")); }
 const first = paymentMethods[0];
 first.available = false;
 try { assert.ok(!availablePaymentMethods().some(method => method.id === first.id)); } finally { first.available = true; }
});
test("every payment method is included in WhatsApp in each locale without changing prices or terms", () => {
 for (const locale of ["en", "fr", "ar", "ma"] as const) for (const method of paymentMethods) {
  const url = new URL(whatsappOrderUrl([{ name: "ChatGPT Plus", price: 119, durationMonths: 1 }], locale, method.name));
  const text = url.searchParams.get("text")!;
  assert.equal(url.hostname, "wa.me"); assert.equal(url.pathname, "/212607144420");
  assert.ok(text.includes("ChatGPT Plus")); assert.ok(text.includes("119.00 MAD"));
  assert.ok(text.includes(translate(locale,"Payment method") + " : " + translate(locale, method.name)));
  assert.ok(text.includes("1"));
 }
});
