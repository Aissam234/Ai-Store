-- One-time replacement listing requested by the store owner.
-- Preserve the original and all its images; the duplicate starts without images.
INSERT INTO "Product" (
  "id", "slug", "name", "nameEn", "nameFr", "nameAr", "nameMa",
  "description", "descriptionEn", "descriptionFr", "descriptionAr", "descriptionMa",
  "fullDescription", "priceMinor", "oldPriceMinor", "durationMonths", "apiCreditUsd", "activation",
  "badge", "featured", "active", "availability", "releasedAt", "symbol", "color", "features", "format",
  "categoryId", "createdAt", "updatedAt"
)
SELECT
  'offer-duolingo-super-new', 'duolingo-super-new', 'Duolingo Super',
  "nameEn", "nameFr", "nameAr", "nameMa",
  "description", "descriptionEn", "descriptionFr", "descriptionAr", "descriptionMa",
  "fullDescription", 4900, NULL, 12, NULL, NULL,
  '1 Year', "featured", true, "availability", "releasedAt", "symbol", "color", "features", "format",
  "categoryId", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Product"
WHERE "slug" = 'duolingo-super'
ON CONFLICT DO NOTHING;
