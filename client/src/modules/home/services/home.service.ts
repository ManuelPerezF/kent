import { authStorage } from "@/modules/auth/lib/authStorage";
import { API_URL } from "@/shared/utils/config";

import type {
  CategorySpendingItem,
  HomeAccountOption,
  HomeCategoryOption,
  HomeDashboardData,
  ReportsSummaryResponse,
  UpcomingSubscription,
} from "../types/home.types";

function formatTrend(current: number, previous: number): string {
  if (previous === 0) {
    return current === 0 ? "Sin movimientos el mes pasado" : "Sin base de comparacion";
  }

  const pct = Math.round(((current - previous) / previous) * 100);
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct}% frente al mes pasado`;
}

function getCurrentMonthRange(reference = new Date()) {
  const from = new Date(reference.getFullYear(), reference.getMonth(), 1);
  from.setHours(0, 0, 0, 0);

  const to = new Date(reference.getFullYear(), reference.getMonth() + 1, 0);
  to.setHours(23, 59, 59, 999);

  return { from, to };
}

function getPreviousMonthRange(reference = new Date()) {
  const from = new Date(reference.getFullYear(), reference.getMonth() - 1, 1);
  from.setHours(0, 0, 0, 0);

  const to = new Date(reference.getFullYear(), reference.getMonth(), 0);
  to.setHours(23, 59, 59, 999);

  return { from, to };
}

function getUpcomingChargesRange(reference = new Date()) {
  const from = new Date(reference);
  from.setHours(0, 0, 0, 0);

  const to = new Date(reference.getFullYear(), reference.getMonth() + 3, 0);
  to.setHours(23, 59, 59, 999);

  return { from, to };
}

export async function fetchReportsSummary(from: Date, to: Date): Promise<ReportsSummaryResponse> {
  const params = new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString(),
  });

  const response = await fetch(`${API_URL}/api/reports/summary?${params}`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo cargar el resumen.");
  }

  return result;
}

export async function fetchUpcomingSubscriptions(limit = 5): Promise<UpcomingSubscription[]> {
  const { from, to } = getUpcomingChargesRange();
  const params = new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString(),
    limit: String(limit),
  });

  const response = await fetch(`${API_URL}/api/subscriptions/upcoming?${params}`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudieron cargar los proximos cargos.");
  }

  return result;
}

export async function fetchSpendingByCategory(
  from: Date,
  to: Date,
): Promise<CategorySpendingItem[]> {
  const params = new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString(),
  });

  const response = await fetch(`${API_URL}/api/reports/spending-by-category?${params}`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo cargar el gasto por categoria.");
  }

  return result;
}

export async function fetchSpendingByDay(from: Date, to: Date) {
  const params = new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString(),
  });

  const response = await fetch(`${API_URL}/api/reports/spending-by-day?${params}`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo cargar el gasto por dia.");
  }

  return result;
}

export async function fetchAccounts(): Promise<HomeAccountOption[]> {
  const response = await fetch(`${API_URL}/api/accounts`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudieron cargar las cuentas.");
  }

  return result.map((item: { id: number; name: string }) => ({
    id: item.id,
    name: item.name,
  }));
}

export async function fetchCategories(): Promise<HomeCategoryOption[]> {
  const response = await fetch(`${API_URL}/api/categories`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudieron cargar las categorias.");
  }

  return result.map(
    (item: { id: number; name: string; kind: "INGRESO" | "GASTO"; color: string | null }) => ({
      id: item.id,
      name: item.name,
      kind: item.kind,
      color: item.color,
    }),
  );
}

type QuickExpensePayload = {
  accountId: number;
  categoryId: number;
  amount: number;
  occurredAt: string;
  note?: string;
};

export async function createQuickExpense(payload: QuickExpensePayload): Promise<void> {
  const response = await fetch(`${API_URL}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
    body: JSON.stringify({
      ...payload,
      type: "GASTO",
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo registrar el gasto.");
  }
}

export async function fetchHomeDashboard(): Promise<HomeDashboardData> {
  const currentMonth = getCurrentMonthRange();
  const previousMonth = getPreviousMonthRange();

  const [current, previous, upcoming, spendingByCategory, spendingByDay, accounts, categories] =
    await Promise.all([
      fetchReportsSummary(currentMonth.from, currentMonth.to),
      fetchReportsSummary(previousMonth.from, previousMonth.to),
      fetchUpcomingSubscriptions(5),
      fetchSpendingByCategory(currentMonth.from, currentMonth.to),
      fetchSpendingByDay(currentMonth.from, currentMonth.to),
      fetchAccounts(),
      fetchCategories(),
    ]);

  const income = current.income.total;
  const expense = current.expense.total;
  const balance = income - expense;
  const prevIncome = previous.income.total;
  const prevExpense = previous.expense.total;
  const prevBalance = prevIncome - prevExpense;

  return {
    snapshot: {
      income,
      expense,
      balance,
      incomeTrend: formatTrend(income, prevIncome),
      expenseTrend: formatTrend(expense, prevExpense),
      balanceTrend: formatTrend(balance, prevBalance),
    },
    recurring: {
      total: current.recurring.total,
      count: current.recurring.count,
    },
    upcoming,
    spendingByCategory,
    spendingByDay,
    accounts,
    categories,
  };
}
