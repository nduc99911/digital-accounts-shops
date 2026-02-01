-- Add pricing + inventory fields, remove old priceVnd
ALTER TABLE "Product" ADD COLUMN "listPriceVnd" INTEGER;
ALTER TABLE "Product" ADD COLUMN "salePriceVnd" INTEGER;
ALTER TABLE "Product" ADD COLUMN "stockQty" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN "soldQty" INTEGER NOT NULL DEFAULT 0;

-- Backfill from previous schema if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='Product' AND column_name='priceVnd'
  ) THEN
    EXECUTE 'UPDATE "Product" SET "listPriceVnd" = COALESCE("listPriceVnd", "priceVnd"), "salePriceVnd" = COALESCE("salePriceVnd", "priceVnd")';
  END IF;
END $$;

ALTER TABLE "Product" ALTER COLUMN "listPriceVnd" SET NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "salePriceVnd" SET NOT NULL;

-- Drop old column if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='Product' AND column_name='priceVnd'
  ) THEN
    EXECUTE 'ALTER TABLE "Product" DROP COLUMN "priceVnd"';
  END IF;
END $$;
