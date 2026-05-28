import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createSubscription,
  listAccounts,
  listCategories,
  listSubscriptions,
  updateSubscriptionActive,
} from "../services/suscripciones.service";
import type { Account, Category } from "@/modules/movimientos/types/movimientos.types";
import type { CreateSubscriptionBody, Subscription } from "../types/suscripciones.types";

type Status = "loading" | "success" | "error";

export function useSuscripciones() {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accountMap, setAccountMap] = useState<Map<number, string>>(new Map());
  const [categoryMap, setCategoryMap] = useState<Map<number, string>>(new Map());
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [toggleError, setToggleError] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const load = useCallback(async (cancelled = false) => {
    setStatus("loading");
    setError("");

    try {
      const [subs, nextAccounts, nextCategories] = await Promise.all([
        listSubscriptions(),
        listAccounts(),
        listCategories(),
      ]);

      if (cancelled) return;

      setSubscriptions(subs);
      setAccounts(nextAccounts);
      setCategories(nextCategories);
      setAccountMap(new Map(nextAccounts.map((account) => [account.id, account.name])));
      setCategoryMap(new Map(nextCategories.map((category) => [category.id, category.name])));
      setStatus("success");
    } catch (err) {
      if (cancelled) return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "No se pudieron cargar las suscripciones.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void load(cancelled);
    return () => {
      cancelled = true;
    };
  }, [load]);

  const addSubscription = useCallback(async (payload: CreateSubscriptionBody) => {
    setCreating(true);
    setCreateError("");

    try {
      const created = await createSubscription(payload);
      setSubscriptions((prev) => [created, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo crear la suscripcion.";
      setCreateError(message);
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  const toggleSubscriptionActive = useCallback(async (id: number, active: boolean) => {
    setTogglingId(id);
    setToggleError("");

    try {
      const updated = await updateSubscriptionActive(id, active);
      setSubscriptions((prev) =>
        prev.map((subscription) => (subscription.id === id ? updated : subscription)),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo actualizar el estado de la suscripcion.";
      setToggleError(message);
      throw err;
    } finally {
      setTogglingId(null);
    }
  }, []);

  const activeSubscriptions = useMemo(() => subscriptions.filter((item) => Boolean(item.active)), [subscriptions]);
  const pausedSubscriptions = subscriptions.length - activeSubscriptions.length;
  const monthlyAmount = activeSubscriptions.reduce((sum, item) => sum + item.amount, 0);

  const upcomingSubscriptions = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    function resolveNextBillingDate(value: string): Date {
      const stored = new Date(value);
      const next = new Date(stored);
      while (next < todayStart) {
        next.setMonth(next.getMonth() + 1);
      }
      return next;
    }

    return [...activeSubscriptions]
      .map((item) => ({
        ...item,
        nextBillingDate: resolveNextBillingDate(item.nextBillingDate).toISOString(),
      }))
      .sort(
        (a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime(),
      );
  }, [activeSubscriptions]);

  const nextCharge = upcomingSubscriptions[0] ?? null;

  return {
    status,
    error,
    subscriptions,
    activeSubscriptions,
    pausedSubscriptions,
    monthlyAmount,
    nextCharge,
    upcomingSubscriptions,
    accountMap,
    categoryMap,
    accounts,
    categories,
    createError,
    creating,
    toggleError,
    togglingId,
    addSubscription,
    toggleSubscriptionActive,
    reload: () => load(false),
  };
}
