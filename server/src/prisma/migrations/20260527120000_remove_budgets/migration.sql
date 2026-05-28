PRAGMA foreign_keys=OFF;

CREATE TABLE "new_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "occurred_at" DATETIME NOT NULL,
    "note" TEXT,
    CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_transactions" ("id", "user_id", "account_id", "category_id", "type", "amount", "occurred_at", "note")
SELECT "id", "user_id", "account_id", "category_id", "type", "amount", "occurred_at", "note"
FROM "transactions";

DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";

CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");

DROP TABLE "budget";

PRAGMA foreign_keys=ON;
