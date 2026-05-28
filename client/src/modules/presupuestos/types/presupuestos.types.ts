import type { Transaction } from "@/modules/movimientos/types/movimientos.types";

export interface Budget {
  id: number;
  userId: number;
  amount: number;
  startDate: string;
  endDate: string;
}

export interface BudgetSummary extends Budget {
  spent: number;
  remaining: number;
  expenses: Transaction[];
}

export interface CreateBudgetBody {
  amount: number;
  startDate: string;
  endDate: string;
}
