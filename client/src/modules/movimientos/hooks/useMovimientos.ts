import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createTransaction,
  listAccounts,
  listCategories,
  listTransactions,
} from "../services/movimientos.service";
import type {
  Account,
  Category,
  CreateTransactionBody,
  Transaction,
} from "../types/movimientos.types";

type Status = "loading" | "success" | "error";

interface UseMovimientosState {
  status: Status;
  error: string;
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
}

export function useMovimientos() {
  const [state, setState] = useState<UseMovimientosState>({
    status: "loading",
    error: "",
    transactions: [],
    categories: [],
    accounts: [],
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INGRESO" | "GASTO">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<number | "ALL">("ALL");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((prev) => ({ ...prev, status: "loading", error: "" }));

      try {
        const [transactions, categories, accounts] = await Promise.all([
          listTransactions(),
          listCategories(),
          listAccounts(),
        ]);

        if (!cancelled) {
          setState({
            status: "success",
            error: "",
            transactions,
            categories,
            accounts,
          });
        }
      } catch (error) {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          status: "error",
          error: error instanceof Error ? error.message : "No se pudieron cargar los movimientos.",
        }));
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const accountMap = useMemo(() => {
    return new Map(state.accounts.map((account) => [account.id, account.name]));
  }, [state.accounts]);

  const categoryMap = useMemo(() => {
    return new Map(state.categories.map((category) => [category.id, category]));
  }, [state.categories]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return state.transactions.filter((transaction) => {
      const category = categoryMap.get(transaction.categoryId);
      const accountName = accountMap.get(transaction.accountId) ?? "";
      const note = transaction.note ?? "";

      if (typeFilter !== "ALL" && transaction.type !== typeFilter) {
        return false;
      }

      if (categoryFilter !== "ALL" && transaction.categoryId !== categoryFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [category?.name ?? "", accountName, note].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );
    });
  }, [accountMap, categoryFilter, categoryMap, search, state.transactions, typeFilter]);

  const expenseTotal = filteredTransactions
    .filter((item) => item.type === "GASTO")
    .reduce((sum, item) => sum + item.amount, 0);

  const addMovement = useCallback(async (payload: CreateTransactionBody) => {
    setCreating(true);
    setCreateError("");

    try {
      const created = await createTransaction(payload);
      setState((prev) => ({
        ...prev,
        transactions: [created, ...prev.transactions],
        accounts: prev.accounts.map((account) => {
          if (account.id !== created.accountId) {
            return account;
          }

          const delta = created.type === "INGRESO" ? created.amount : -created.amount;
          return { ...account, balance: account.balance + delta };
        }),
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo registrar el movimiento.";
      setCreateError(message);
      throw error;
    } finally {
      setCreating(false);
    }
  }, []);

  return {
    ...state,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    filteredTransactions,
    accountMap,
    categoryMap,
    expenseTotal,
    creating,
    createError,
    addMovement,
  };
}
