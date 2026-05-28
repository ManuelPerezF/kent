import { authStorage } from "@/modules/auth/lib/authStorage";
import { API_URL } from "@/shared/utils/config";

import type { DateRange } from "../lib/reportPeriod";
import type {
  CategorySpendingItem,
  MonthlyExpenseItem,
  ReportsSummaryResponse,
  TopExpenseItem,
} from "../types/reportes.types";

function rangeParams(range: DateRange) {
  return new URLSearchParams({
    from: range.from.toISOString(),
    to: range.to.toISOString(),
  });
}

export async function fetchReportsSummary(range: DateRange): Promise<ReportsSummaryResponse> {
  const response = await fetch(`${API_URL}/api/reports/summary?${rangeParams(range)}`, {
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

export async function fetchSpendingByCategory(range: DateRange): Promise<CategorySpendingItem[]> {
  const response = await fetch(
    `${API_URL}/api/reports/spending-by-category?${rangeParams(range)}`,
    {
      headers: {
        Authorization: `Bearer ${authStorage.getToken()}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo cargar el gasto por categoria.");
  }

  return result;
}

export async function fetchMonthlyExpenses(range: DateRange): Promise<MonthlyExpenseItem[]> {
  const response = await fetch(
    `${API_URL}/api/reports/monthly-expenses?${rangeParams(range)}`,
    {
      headers: {
        Authorization: `Bearer ${authStorage.getToken()}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo cargar el gasto mensual.");
  }

  return result;
}

export async function fetchTopExpenses(range: DateRange, limit = 5): Promise<TopExpenseItem[]> {
  const params = rangeParams(range);
  params.set("limit", String(limit));

  const response = await fetch(`${API_URL}/api/reports/top-expenses?${params}`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudieron cargar los movimientos principales.");
  }

  return result;
}
