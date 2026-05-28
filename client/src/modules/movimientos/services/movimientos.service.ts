import { authStorage } from "@/modules/auth/lib/authStorage";
import { API_URL } from "@/shared/utils/config";

import type {
  Account,
  Category,
  CreateTransactionBody,
  Transaction,
} from "../types/movimientos.types";

export async function listTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_URL}/api/transactions`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudieron cargar los movimientos.");
  }

  return result;
}

export async function createTransaction(data: CreateTransactionBody): Promise<Transaction> {
  const response = await fetch(`${API_URL}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo registrar el movimiento.");
  }

  return result;
}

export async function listCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/api/categories`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudieron cargar las categorias.");
  }

  return result;
}

export async function listAccounts(): Promise<Account[]> {
  const response = await fetch(`${API_URL}/api/accounts`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudieron cargar las cuentas.");
  }

  return result;
}
