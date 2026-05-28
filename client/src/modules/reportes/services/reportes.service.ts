import { authStorage } from "@/modules/auth/lib/authStorage";
import { API_URL } from "@/shared/utils/config";

import type { CategorySpendingItem, ReportsSummaryResponse } from "../types/reportes.types";

function monthRange(): { from: Date; to: Date } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  from.setHours(0, 0, 0, 0);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  to.setHours(23, 59, 59, 999);
  return { from, to };
}

export async function fetchReportsSummary(): Promise<ReportsSummaryResponse> {
  const { from, to } = monthRange();
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

export async function fetchSpendingByCategory(): Promise<CategorySpendingItem[]> {
  const { from, to } = monthRange();
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
