import { authStorage } from "@/modules/auth/lib/authStorage";
import { API_URL } from "@/shared/utils/config";

import type { Budget, BudgetSummary, CreateBudgetBody } from "../types/presupuestos.types";

export async function listBudgets(): Promise<Budget[]> {
  const response = await fetch(`${API_URL}/api/budgets`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudieron cargar los presupuestos.");
  }

  return result;
}

export async function getCurrentBudget(): Promise<BudgetSummary> {
  const response = await fetch(`${API_URL}/api/budgets/current`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No hay presupuesto activo.");
  }

  return result;
}

export async function createBudget(data: CreateBudgetBody): Promise<BudgetSummary> {
  const response = await fetch(`${API_URL}/api/budgets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo crear el presupuesto.");
  }

  return result;
}
