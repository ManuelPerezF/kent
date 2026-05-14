-- Referencia SQL alineada con `src/prisma/schema.prisma`.
-- Archivo de apoyo / creación manual; el archivo SQLite de desarrollo vive en esta misma carpeta (`db.sqlite`).

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "User" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "username" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Account" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "type" TEXT NOT NULL CHECK ("type" IN ('EFECTIVO', 'TARJETA')),
  "initial_balance" REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "Category" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "color" TEXT,
  CONSTRAINT "Category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "transactions" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER NOT NULL,
  "account_id" INTEGER NOT NULL,
  "category_id" INTEGER NOT NULL,
  "type" TEXT NOT NULL CHECK ("type" IN ('INGRESO', 'GASTO')),
  "amount" REAL NOT NULL,
  "occurred_at" DATETIME NOT NULL,
  "note" TEXT,
  CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "subscription" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "user_id" INTEGER NOT NULL,
  "account_id" INTEGER NOT NULL,
  "category_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "next_billing_date" DATETIME NOT NULL,
  "active" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "subscription_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "subscription_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "subscription_user_id_idx" ON "subscription" ("user_id");
CREATE INDEX IF NOT EXISTS "subscription_next_billing_date_idx" ON "subscription" ("next_billing_date");
