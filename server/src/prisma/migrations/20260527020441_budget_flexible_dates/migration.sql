/*
  Warnings:

  - You are about to drop the `weekly_budget` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "weekly_budget_user_id_week_start_key";

-- DropIndex
DROP INDEX "weekly_budget_user_id_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "weekly_budget";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "budget" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    CONSTRAINT "budget_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "budget_id" INTEGER,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "occurred_at" DATETIME NOT NULL,
    "note" TEXT,
    CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budget" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("account_id", "amount", "budget_id", "category_id", "id", "note", "occurred_at", "type", "user_id") SELECT "account_id", "amount", "budget_id", "category_id", "id", "note", "occurred_at", "type", "user_id" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");
CREATE INDEX "transactions_budget_id_idx" ON "transactions"("budget_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "budget_user_id_idx" ON "budget"("user_id");
