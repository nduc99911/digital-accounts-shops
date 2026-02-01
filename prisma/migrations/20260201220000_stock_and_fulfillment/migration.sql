-- Stock items for auto delivery

CREATE TABLE "StockItem" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "usedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "StockItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "StockItem_productId_value_key" ON "StockItem" ("productId", "value");

CREATE TABLE "OrderFulfillment" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "stockItemId" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "OrderFulfillment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
  CONSTRAINT "OrderFulfillment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT,
  CONSTRAINT "OrderFulfillment_stockItemId_fkey" FOREIGN KEY ("stockItemId") REFERENCES "StockItem"("id") ON DELETE RESTRICT
);

CREATE INDEX "OrderFulfillment_orderId_idx" ON "OrderFulfillment" ("orderId");
