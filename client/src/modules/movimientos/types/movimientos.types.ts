export type TransactionType = "INGRESO" | "GASTO";

export interface Transaction {
  id: number;
  userId: number;
  accountId: number;
  categoryId: number;
  budgetId: number | null;
  type: TransactionType;
  amount: number;
  occurredAt: string;
  note: string | null;
}

export interface Category {
  id: number;
  userId: number;
  name: string;
  kind: TransactionType;
  color: string | null;
  monthlyLimit: number | null;
}

export interface Account {
  id: number;
  userId: number;
  name: string;
  type: "EFECTIVO" | "TARJETA";
  initialBalance: number;
}

export interface CreateTransactionBody {
  accountId: number;
  categoryId: number;
  type: TransactionType;
  amount: number;
  occurredAt: string;
  note?: string;
  budgetId?: number;
}
