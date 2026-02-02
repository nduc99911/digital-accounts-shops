-- Payment transactions log (ViettelPay/others)

CREATE TABLE "PaymentTransaction" (
  "id" TEXT PRIMARY KEY,
  "provider" TEXT NOT NULL,
  "txId" TEXT,
  "occurredAt" TIMESTAMPTZ NOT NULL,
  "amountInVnd" INTEGER NOT NULL,
  "balanceVnd" INTEGER,
  "description" TEXT NOT NULL,
  "raw" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "PaymentTransaction_provider_occurredAt_idx" ON "PaymentTransaction" ("provider", "occurredAt");
CREATE UNIQUE INDEX "PaymentTransaction_unique_key" ON "PaymentTransaction" ("provider", "occurredAt", "amountInVnd", "description");
