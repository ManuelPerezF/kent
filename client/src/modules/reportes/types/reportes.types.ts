export interface MetricSummary {
  total: number;
  count: number;
}

export interface ReportsSummaryResponse {
  period: {
    from: string;
    to: string;
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
