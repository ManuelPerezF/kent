import { Button } from "@/shared/components/ui/button";
import PageHeader from "@/shared/components/page-header";
import type { Account, Category } from "@/modules/movimientos/types/movimientos.types";
import { FormEvent, useMemo, useState } from "react";

import type { Subscription } from "../types/suscripciones.types";

interface SuscripcionesBoardProps {
  subscriptions: Subscription[];
  pausedSubscriptions: number;
  monthlyAmount: number;
  nextCharge: Subscription | null;
  accountMap: Map<number, string>;
  categoryMap: Map<number, string>;
  accounts: Account[];
  categories: Category[];
  creating: boolean;
  createError: string;
  onCreateSubscription: (payload: {
    accountId: number;
    categoryId: number;
    name: string;
    amount: number;
    nextBillingDate: string;
    active?: boolean;
  }) => Promise<void>;
  togglingId: number | null;
  toggleError: string;
  onToggleSubscriptionActive: (id: number, active: boolean) => Promise<void>;
}

function currency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

function effectiveNextBillingDate(value: string): string {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const next = new Date(value);
  while (next < todayStart) {
    next.setMonth(next.getMonth() + 1);
  }
  return next.toISOString();
}

export default function SuscripcionesBoard({
  subscriptions,
  pausedSubscriptions,
  monthlyAmount,
  nextCharge,
  accountMap,
  categoryMap,
  accounts,
  categories,
  creating,
  createError,
  onCreateSubscription,
  togglingId,
  toggleError,
  onToggleSubscriptionActive,
}: SuscripcionesBoardProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [accountId, setAccountId] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.kind === "GASTO"),
    [categories],
  );

  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort((a, b) => {
      const dateA = new Date(effectiveNextBillingDate(a.nextBillingDate)).getTime();
      const dateB = new Date(effectiveNextBillingDate(b.nextBillingDate)).getTime();
      if (dateA !== dateB) return dateA - dateB;
      if (a.active !== b.active) return a.active ? -1 : 1;
      return a.name.localeCompare(b.name, "es");
    });
  }, [subscriptions]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accountId || !categoryId) return;

    await onCreateSubscription({
      name: name.trim(),
      amount: Number(amount),
      nextBillingDate,
      accountId,
      categoryId,
      active: true,
    });

    setName("");
    setAmount("");
    setNextBillingDate("");
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-6 lg:p-8">
      <PageHeader
        eyebrow="Kent / Suscripciones"
        title="Cobros que no deberian sorprenderte."
        description="Kent separa suscripciones de otros recurrentes para revisar portales y estados."
      />

      <form
        onSubmit={handleSubmit}
        className="flex flex-nowrap items-center gap-2 overflow-x-auto border border-border bg-card p-4"
      >
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nombre de la suscripcion"
          className="h-10 min-w-[10rem] flex-1 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <input
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Monto"
          inputMode="decimal"
          className="h-10 w-[5.5rem] shrink-0 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <input
          required
          value={nextBillingDate}
          onChange={(event) => setNextBillingDate(event.target.value)}
          type="date"
          className="h-10 w-[9.5rem] shrink-0 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <select
          required
          value={accountId}
          onChange={(event) =>
            setAccountId(event.target.value === "" ? "" : Number(event.target.value))
          }
          className="h-10 w-[8.5rem] shrink-0 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        >
          <option value="">Cuenta</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        <select
          required
          value={categoryId}
          onChange={(event) =>
            setCategoryId(event.target.value === "" ? "" : Number(event.target.value))
          }
          className="h-10 w-[8.5rem] shrink-0 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        >
          <option value="">Categoria</option>
          {expenseCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Button
          type="submit"
          className="h-10 shrink-0 rounded-none px-5 text-sm whitespace-nowrap"
          disabled={creating}
        >
          {creating ? "Guardando..." : "Crear suscripcion"}
        </Button>
      </form>
      {createError ? <p className="text-sm text-destructive">{createError}</p> : null}
      {toggleError ? <p className="text-sm text-destructive">{toggleError}</p> : null}

      <div className="grid gap-3 md:grid-cols-3">
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
            Mensual activo
          </p>
          <p className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">{currency(monthlyAmount)}</p>
        </article>
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
            Proximo cargo
          </p>
          <p className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">
            {nextCharge
              ? formatDate(effectiveNextBillingDate(nextCharge.nextBillingDate))
              : "Sin fecha"}
          </p>
          {nextCharge ? (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {nextCharge.name} · {currency(nextCharge.amount)}
            </p>
          ) : null}
        </article>
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">En pausa</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight lg:text-5xl">{pausedSubscriptions}</p>
        </article>
      </div>

      <article className="border border-border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            Todas las suscripciones
          </p>
          <span className="text-xs text-muted-foreground">
            {subscriptions.length} {subscriptions.length === 1 ? "servicio" : "servicios"}
          </span>
        </header>

        {sortedSubscriptions.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Aun no tienes suscripciones. Usa el formulario de arriba para registrar la primera.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {sortedSubscriptions.map((subscription) => {
              const isActive = Boolean(subscription.active);
              const nextChargeLabel = formatDate(
                effectiveNextBillingDate(subscription.nextBillingDate),
              );
              const isNext =
                nextCharge?.id === subscription.id && isActive;

              return (
                <li
                  key={subscription.id}
                  className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto] md:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold tracking-tight">{subscription.name}</p>
                      {isNext ? (
                        <span className="border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-amber-800">
                          Proximo
                        </span>
                      ) : null}
                      <span
                        className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] ${
                          isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {isActive ? "Activa" : "Pausada"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {categoryMap.get(subscription.categoryId) ?? "Sin categoria"}
                    </p>
                  </div>

                  <div className="text-sm text-muted-foreground md:text-left">
                    <p>{accountMap.get(subscription.accountId) ?? "Cuenta"}</p>
                    <p className="mt-0.5 font-medium text-foreground">Sig. cobro {nextChargeLabel}</p>
                  </div>

                  <p className="text-2xl font-semibold tracking-tight md:text-right">
                    {currency(subscription.amount)}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">/mes</span>
                  </p>

                  <div className="md:text-right">
                    <button
                      type="button"
                      disabled={togglingId === subscription.id}
                      onClick={() => void onToggleSubscriptionActive(subscription.id, !isActive)}
                      className="w-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground disabled:opacity-50 md:w-auto"
                    >
                      {togglingId === subscription.id
                        ? "Guardando..."
                        : isActive
                          ? "Pausar"
                          : "Reactivar"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </article>
    </section>
  );
}
