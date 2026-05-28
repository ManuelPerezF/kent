import { authStorage } from "@/modules/auth/lib/authStorage";
import { API_URL } from "@/shared/utils/config";

import type { Account } from "@/modules/movimientos/types/movimientos.types";
import type { Category } from "@/modules/movimientos/types/movimientos.types";
import type { CreateSubscriptionBody, Subscription } from "../types/suscripciones.types";

export async function listSubscriptions(): Promise<Subscription[]> {
  const response = await fetch(`${API_URL}/api/subscriptions`, {
    headers: {
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudieron cargar las suscripciones.");
  }

  return result;
}

export async function createSubscription(data: CreateSubscriptionBody): Promise<Subscription> {
  const response = await fetch(`${API_URL}/api/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo crear la suscripcion.");
  }

  return result;
}

export async function updateSubscriptionActive(
  id: number,
  active: boolean,
): Promise<Subscription> {
  const response = await fetch(`${API_URL}/api/subscriptions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
    body: JSON.stringify({ active }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo actualizar la suscripcion.");
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
