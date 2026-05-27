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
  limit: number | null;
  progressPct: number | null;
}
