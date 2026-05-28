import { z } from "zod";

export const reportsQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type ReportsQuery = z.infer<typeof reportsQuerySchema>;

export interface MetricSummary {
  total: number;
  count: number;
}

export interface ReportsSummaryResponse {
  period: {
    from: Date;
    to: Date;
  };
  income: MetricSummary;
  expense: MetricSummary;
  recurring: MetricSummary;
  available: number;
}

export interface CategorySpendingItem {
  categoryId: number;
  categoryName: string;
  color: string | null;
  spent: number;
}

export interface MonthlyExpenseItem {
  year: number;
  month: number;
  label: string;
  total: number;
}

export interface TopExpenseItem {
  id: number;
  amount: number;
  occurredAt: Date;
  note: string | null;
  categoryName: string;
  categoryColor: string | null;
  accountName: string;
}

export interface DailyExpenseItem {
  date: string;
  label: string;
  total: number;
}
