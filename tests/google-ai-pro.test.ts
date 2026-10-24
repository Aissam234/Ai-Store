import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { localizeProduct, locales, direction } from "../src/i18n/config";
import { whatsappOrderUrl } from "../src/lib/whatsapp";

test("Google AI Pro migration preserves exact terms and four localized order messages", () => {
  const sql = readFileSync("prisma/migrations/20261024000200_google_ai_pro/migration.sql", "utf8");
  const strings = Array.from(sql.matchAll(/'((?:[^']|'')*)'/g), m => m[1].replaceAll("''", "'"));
  const descriptions = strings.filter(s => s.length > 150);
  assert.equal(descriptions.length, 6);
  const [description, descriptionEn, descriptionFr, descriptionAr, descriptionMa, fullDescription] = descriptions;
  const product = {name:"Google AI Pro",price:69,durationMonths:18,description,descriptionEn,descriptionFr,descriptionAr,descriptionMa,fullDescription};
  assert.match(sql, /6900, 18, '18 Months', true, 'AVAILABLE'/);
  assert.match(sql, /ON CONFLICT DO NOTHING/);
  assert.doesNotMatch(sql, /UPDATE |DELETE FROM /);
  for (const locale of locales) {
    const localized = localizeProduct(product,locale);
    assert.ok(localized.description.length <= 500);
    assert.equal(localized.description, [descriptionEn,descriptionFr,descriptionAr,descriptionMa][locales.indexOf(locale)]);
    assert.equal(localized.fullDescription, localized.description);
    assert.equal(direction(locale), locale === "ar" || locale === "ma" ? "rtl" : "ltr");
    const message = new URL(whatsappOrderUrl([product],locale,"CIH Bank")).searchParams.get("text")!;
    for(const value of ["Google AI Pro","69.00 MAD","18","CIH Bank"]) assert.ok(message.includes(value));
  }
});

