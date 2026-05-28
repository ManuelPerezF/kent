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
  upcomingSubscriptions: Subscription[];
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
  upcomingSubscriptions,
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
  const [active, setActive] = useState(true);

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.kind === "GASTO"),
    [categories],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accountId || !categoryId) return;

    await onCreateSubscription({
      name: name.trim(),
      amount: Number(amount),
      nextBillingDate,
      accountId,
      categoryId,
      active,
    });

    setName("");
    setAmount("");
    setNextBillingDate("");
    setActive(true);
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-6 lg:p-8">
      <PageHeader
        eyebrow="Kent / Suscripciones"
        title="Cobros que no deberian sorprenderte."
        description="Kent separa suscripciones de otros recurrentes para revisar portales y estados."
      />

      <form onSubmit={handleSubmit} className="grid gap-3 border border-border bg-card p-4 lg:grid-cols-[1.2fr_150px_170px_180px_170px_auto]">
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nombre de la suscripcion"
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <input
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Monto"
          inputMode="decimal"
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <input
          required
          value={nextBillingDate}
          onChange={(event) => setNextBillingDate(event.target.value)}
          type="date"
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <select
          required
          value={accountId}
          onChange={(event) =>
            setAccountId(event.target.value === "" ? "" : Number(event.target.value))
          }
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
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
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        >
          <option value="">Categoria</option>
          {expenseCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Button type="submit" className="h-10 rounded-none px-5 text-sm" disabled={creating}>
          {creating ? "Guardando..." : "Crear suscripcion"}
        </Button>
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="accent-emerald-600"
          />
          Activa
        </label>
      </form>
      {createError ? <p className="text-sm text-destructive">{createError}</p> : null}
      {toggleError ? <p className="text-sm text-destructive">{toggleError}</p> : null}

      <div className="grid gap-3 md:grid-cols-3">
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Mensual activo</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight">{currency(monthlyAmount)}</p>
        </article>
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Proximo cargo</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight">
            {nextCharge ? formatDate(nextCharge.nextBillingDate) : "Sin fecha"}
          </p>
        </article>
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">En pausa</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight">{pausedSubscriptions}</p>
        </article>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        <article className="border border-border bg-card p-4">
          <ul className="space-y-3">
            {subscriptions.map((subscription) => {
              const isActive = Boolean(subscription.active);
              return (
                <li
                  key={subscription.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 border border-border bg-background px-4 py-3"
                >
                  <div>
                    <p className="text-4xl font-semibold tracking-tight">{subscription.name}</p>
                    <p className="mt-0.5 text-xl text-muted-foreground">
                      {accountMap.get(subscription.accountId) ?? "Cuenta"} · sig. cobro{" "}
                      {formatDate(effectiveNextBillingDate(subscription.nextBillingDate))}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {categoryMap.get(subscription.categoryId) ?? "Categoria sin nombre"}
                    </p>
                    <span
                      className={`mt-2 inline-flex border px-2 py-0.5 text-xs font-medium uppercase tracking-[0.08em] ${
                        isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-semibold tracking-tight">{currency(subscription.amount)}</p>
                    <button
                      type="button"
                      disabled={togglingId === subscription.id}
                      onClick={() => void onToggleSubscriptionActive(subscription.id, !isActive)}
                      className="mt-2 border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:border-foreground disabled:opacity-50"
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
        </article>

        <article className="border border-border bg-card p-4">
          <h2 className="text-4xl font-semibold tracking-tight">Revision sugerida</h2>
          <ul className="mt-3 divide-y divide-border border border-border">
            {upcomingSubscriptions.slice(0, 3).map((item) => (
              <li key={item.id} className="px-4 py-3">
                <p className="text-2xl font-semibold tracking-tight">{item.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cobro: {formatDate(item.nextBillingDate)} · {currency(item.amount)}
                </p>
              </li>
            ))}
            {upcomingSubscriptions.length === 0 ? (
              <li className="px-4 py-6 text-sm text-muted-foreground">No hay cobros proximos por revisar.</li>
            ) : null}
          </ul>
        </article>
      </div>
    </section>
  );
}
