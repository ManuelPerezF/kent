import { useCallback, useEffect, useState } from "react";

import { createAccount, listAccounts } from "../services/cuentas.service";
import type { Account, CreateAccountBody } from "../types/cuentas.types";

type Status = "loading" | "success" | "error";

export function useCuentas() {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async (cancelled = false) => {
    setStatus("loading");
    setError("");

    try {
      const data = await listAccounts();
      if (cancelled) return;
      setAccounts(data);
      setStatus("success");
    } catch (err) {
      if (cancelled) return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "No se pudieron cargar las cuentas.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void load(cancelled);
    return () => {
      cancelled = true;
    };
  }, [load]);

  const addAccount = useCallback(async (payload: CreateAccountBody) => {
    setCreating(true);
    setCreateError("");

    try {
      const created = await createAccount(payload);
      setAccounts((prev) => [created, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo crear la cuenta.";
      setCreateError(message);
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  return {
    status,
    error,
    accounts,
    creating,
    createError,
    addAccount,
    reload: () => load(false),
  };
}
