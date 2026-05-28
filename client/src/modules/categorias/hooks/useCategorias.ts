import { useCallback, useEffect, useMemo, useState } from "react";

import { createCategory, listCategories } from "../services/categorias.service";
import type { Category, CreateCategoryBody } from "../types/categorias.types";

type Status = "loading" | "success" | "error";

export function useCategorias() {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async (cancelled = false) => {
    setStatus("loading");
    setError("");

    try {
      const data = await listCategories();
      if (cancelled) return;
      setCategories(data);
      setStatus("success");
    } catch (err) {
      if (cancelled) return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "No se pudieron cargar las categorias.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void load(cancelled);
    return () => {
      cancelled = true;
    };
  }, [load]);

  const addCategory = useCallback(async (payload: CreateCategoryBody) => {
    setCreating(true);
    setCreateError("");

    try {
      const created = await createCategory(payload);
      setCategories((prev) => [created, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo crear la categoria.";
      setCreateError(message);
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.kind === "GASTO"),
    [categories],
  );
  const incomeCategories = useMemo(
    () => categories.filter((category) => category.kind === "INGRESO"),
    [categories],
  );

  return {
    status,
    error,
    categories,
    expenseCategories,
    incomeCategories,
    creating,
    createError,
    addCategory,
    reload: () => load(false),
  };
}
