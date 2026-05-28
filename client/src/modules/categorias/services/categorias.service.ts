import { authStorage } from "@/modules/auth/lib/authStorage";
import { API_URL } from "@/shared/utils/config";

import type { Category, CreateCategoryBody } from "../types/categorias.types";

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

export async function createCategory(data: CreateCategoryBody): Promise<Category> {
  const response = await fetch(`${API_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStorage.getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo crear la categoria.");
  }

  return result;
}
