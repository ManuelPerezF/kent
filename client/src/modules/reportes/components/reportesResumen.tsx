import type { ReactNode } from "react";

import PageHeader from "@/shared/components/page-header";
import CategorySpendingChart from "@/shared/components/charts/category-spending-chart";
import MonthlyExpenseChart from "@/shared/components/charts/monthly-expense-chart";

import type { ReportPeriodKind } from "../lib/reportPeriod";
import type {
  CategorySpendingItem,
  MonthlyExpenseItem,
  ReportsSummaryResponse,
  TopExpenseItem,
} from "../types/reportes.types";

interface ReportesResumenProps {
  summary: ReportsSummaryResponse;
  spendingByCategory: CategorySpendingItem[];
  monthlyExpenses: MonthlyExpenseItem[];
  topExpenses: TopExpenseItem[];
  periodKind: ReportPeriodKind;
  periodLabel: string;
  year: number;
  month: number;
  periodFilter: ReactNode;
}

function currency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function shortDate(value: string) {
  return new Date(value).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

export default function ReportesResumen({
  summary,
  spendingByCategory,
  monthlyExpenses,
  topExpenses,
  periodKind,
  periodLabel,
  year,
  month,
  periodFilter,
}: ReportesResumenProps) {
  const periodExpenseTotal =
    periodKind === "year"
      ? monthlyExpenses.reduce((sum, item) => sum + item.total, 0)
      : (monthlyExpenses.find((item) => item.year === year && item.month === month)?.total ?? 0);

  const chartCaption =
    periodKind === "year"
      ? `Total ${periodLabel}: ${currency(periodExpenseTotal)}`
      : `${periodLabel}: ${currency(periodExpenseTotal)}`;

  return (
    <section className="flex flex-1 flex-col gap-4 p-6 lg:p-8">
      <PageHeader
        eyebrow="Kent / Reportes"
        title="Lectura por periodo"
        description="Filtra por mes o ano y revisa gastos, categorias y movimientos destacados."
      />

      {periodFilter}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Ahorro neto</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight">{currency(summary.available)}</p>
        </article>
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Gasto total</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight">{currency(summary.expense.total)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{summary.expense.count} movimientos</p>
        </article>
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Ingreso</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight">{currency(summary.income.total)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{summary.income.count} depositos</p>
        </article>
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Recurrentes</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight">{currency(summary.recurring.total)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{summary.recurring.count} suscripciones</p>
        </article>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        <article className="border border-border bg-card p-4">
          <header className="flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              {periodKind === "year" ? "Gasto por mes del ano" : "Gasto mensual (6 meses)"}
            </p>
            <span className="text-sm text-muted-foreground">{chartCaption}</span>
          </header>
          <div className="mt-4">
            <MonthlyExpenseChart
              items={monthlyExpenses}
              highlightMonth={periodKind === "month" ? month : undefined}
              highlightYear={periodKind === "month" ? year : undefined}
            />
          </div>
        </article>

        <article className="border border-border bg-card p-5">
          <CategorySpendingChart items={spendingByCategory} monthLabel={periodLabel} />
        </article>
      </div>

      <article className="border border-border bg-card">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            Movimientos principales · {periodLabel}
          </p>
          <span className="text-xs font-medium text-muted-foreground">{topExpenses.length} filas</span>
        </header>
        <ul>
          {topExpenses.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted-foreground">
              No hay gastos registrados en este periodo.
            </li>
          ) : (
            topExpenses.map((expense) => (
              <li
                key={expense.id}
                className="grid gap-2 border-b border-border px-4 py-3 last:border-b-0 md:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="text-lg font-medium">
                    {expense.note?.trim() || expense.categoryName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {expense.categoryName} · {expense.accountName} · {shortDate(expense.occurredAt)}
                  </p>
                </div>
                <p className="text-xl font-semibold tracking-tight md:text-right">{currency(expense.amount)}</p>
                <p className="text-sm text-muted-foreground md:text-right">Mayor gasto</p>
              </li>
            ))
          )}
        </ul>
      </article>
    </section>
  );
}
