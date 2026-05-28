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

export interface UpcomingSubscription {
  id: number;
  name: string;
  amount: number;
  nextBillingDate: string;
  accountId: number;
  accountName: string;
}

export interface CategorySpendingItem {
  categoryId: number;
  categoryName: string;
  color: string | null;
  spent: number;
  limit: number | null;
  progressPct: number | null;
}

export interface HomeAccountOption {
  id: number;
  name: string;
}

export interface HomeCategoryOption {
  id: number;
  name: string;
  kind: "INGRESO" | "GASTO";
  color: string | null;
}

export interface HomeSnapshot {
  income: number;
  expense: number;
  balance: number;
  incomeTrend: string;
  expenseTrend: string;
  balanceTrend: string;
}

export interface HomeDashboardData {
  snapshot: HomeSnapshot;
  upcoming: UpcomingSubscription[];
  spendingByCategory: CategorySpendingItem[];
  accounts: HomeAccountOption[];
  categories: HomeCategoryOption[];
}
