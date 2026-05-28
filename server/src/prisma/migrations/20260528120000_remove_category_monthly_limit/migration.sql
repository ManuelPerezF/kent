-- RedefineTables
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'GASTO',
    "color" TEXT,
    CONSTRAINT "Category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Category" ("color", "id", "kind", "name", "user_id")
SELECT "color", "id", "kind", "name", "user_id" FROM "Category";

DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE INDEX "Category_user_id_idx" ON "Category"("user_id");

PRAGMA foreign_keys=ON;
