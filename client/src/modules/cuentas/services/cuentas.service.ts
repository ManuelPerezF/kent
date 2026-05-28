import { authStorage } from "@/modules/auth/lib/authStorage";
import { API_URL } from "@/shared/utils/config";

import type { Account, CreateAccountBody } from "../types/cuentas.types";

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

export async function createAccount(data: CreateAccountBody): Promise<Account> {
  const response = await fetch(`${API_URL}/api/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo crear la cuenta.");
  }

  return result;
}
