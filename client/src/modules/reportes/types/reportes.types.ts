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
  occurredAt: string;
  note: string | null;
  categoryName: string;
  categoryColor: string | null;
  accountName: string;
}
