ALTER TABLE "Product" ADD COLUMN "durationMonths" INTEGER, ADD COLUMN "apiCreditUsd" INTEGER, ADD COLUMN "activation" VARCHAR(120);
ALTER TABLE "Product" ADD CONSTRAINT "Product_durationMonths_positive" CHECK ("durationMonths" > 0), ADD CONSTRAINT "Product_apiCreditUsd_positive" CHECK ("apiCreditUsd" > 0);
