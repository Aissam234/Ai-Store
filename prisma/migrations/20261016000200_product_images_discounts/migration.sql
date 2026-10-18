ALTER TABLE "Product" ADD COLUMN "oldPriceMinor" INTEGER, ADD COLUMN "imageData" BYTEA, ADD COLUMN "hasImage" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Product" ADD CONSTRAINT "Product_discount_check" CHECK ("oldPriceMinor" IS NULL OR "oldPriceMinor" > "priceMinor");
