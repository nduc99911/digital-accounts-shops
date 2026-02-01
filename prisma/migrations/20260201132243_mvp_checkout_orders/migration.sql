-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT,
    "zalo" TEXT,
    "email" TEXT,
    "note" TEXT,
    "totalVnd" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'BANK_TRANSFER',
    "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("code", "createdAt", "customerName", "email", "id", "note", "paymentMethod", "phone", "status", "totalVnd", "updatedAt", "zalo") SELECT "code", "createdAt", "customerName", "email", "id", "note", "paymentMethod", "phone", "status", "totalVnd", "updatedAt", "zalo" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
