import { API_URL } from "@/shared/utils/config";

import type {
  AuthResponse,
  LoginBody,
  RegisterBody,
} from "../types/auth.types";

export async function login(data: LoginBody): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo iniciar sesión.");
  }

  return result;
}

export async function register(data: RegisterBody): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.details?.fieldErrors
        ? JSON.stringify(result.details.fieldErrors)
        : result.message || "No se pudo crear la cuenta.",
    );
  }

  return result;
}
