import PageHeader from "@/shared/components/page-header";
import CategorySpendingChart from "@/shared/components/charts/category-spending-chart";
import DailyExpenseChart from "@/shared/components/charts/daily-expense-chart";

import type { HomeDashboardData } from "../types/home.types";

interface HomeOverviewProps {
  data: HomeDashboardData;
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

function buildHeaderCopy(data: HomeDashboardData) {
  const month = new Date().toLocaleDateString("es-MX", { month: "long" });
  const topCategory = [...data.spendingByCategory].sort((a, b) => b.spent - a.spent)[0];

  if (data.upcoming.length > 0) {
    const upcomingTotal = data.upcoming.reduce((sum, item) => sum + item.amount, 0);
    const next = data.upcoming[0];
    return {
      title: `Resumen de ${month}`,
      description: `Tienes ${data.upcoming.length} cobro${data.upcoming.length === 1 ? "" : "s"} proximo${data.upcoming.length === 1 ? "" : "s"} (${currency(upcomingTotal)}). El mas cercano es ${next.name}, el ${shortDate(next.nextBillingDate)}.`,
    };
  }

  if (topCategory && data.snapshot.expense > 0) {
    return {
      title: `Resumen de ${month}`,
      description: `Llevas ${currency(data.snapshot.expense)} en gastos esta semana. Tu categoria principal es ${topCategory.categoryName} (${currency(topCategory.spent)}).`,
    };
  }

  return {
    title: `Resumen de ${month}`,
    description: "Consulta ingresos, gastos por categoria y el ritmo diario de tu mes.",
  };
}

export default function HomeOverview({ data }: HomeOverviewProps) {
  const header = buildHeaderCopy(data);

  return (
    <section className="flex flex-1 flex-col gap-5 p-6 lg:p-8">
      <PageHeader
        eyebrow="Kent / Resumen"
        title={header.title}
        description={header.description}
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Disponible</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">{currency(data.snapshot.balance)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{data.snapshot.balanceTrend}</p>
        </article>
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Gasto</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">{currency(data.snapshot.expense)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{data.snapshot.expenseTrend}</p>
        </article>
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Ingreso</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">{currency(data.snapshot.income)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{data.snapshot.incomeTrend}</p>
        </article>
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Recurrentes</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">{currency(data.recurring.total)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.recurring.count === 1
              ? "1 suscripción activa"
              : `${data.recurring.count} suscripciones activas`}
          </p>
        </article>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        <article className="border border-border bg-card p-5">
          <CategorySpendingChart items={data.spendingByCategory} />
        </article>

        <article className="border border-border bg-card p-5">
          <h2 className="text-[2rem] font-semibold tracking-tight">Proximos cargos</h2>
          <ul className="mt-4 divide-y divide-border border border-border">
            {data.upcoming.length === 0 ? (
              <li className="px-4 py-6 text-sm text-muted-foreground">No hay cargos proximos en este mes.</li>
            ) : (
              data.upcoming.map((item) => (
                <li key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3">
                  <div>
                    <p className="text-lg font-semibold tracking-tight">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.accountName} · {shortDate(item.nextBillingDate)}
                    </p>
                  </div>
                  <p className="text-2xl font-semibold tracking-tight">{currency(item.amount)}</p>
                </li>
              ))
            )}
          </ul>
        </article>
      </div>

      <article className="border border-border bg-card p-5">
        <header className="flex items-center justify-between gap-3">
          <h2 className="text-[2rem] font-semibold tracking-tight">Gasto por dia</h2>
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
            {new Date().toLocaleDateString("es-MX", { month: "long" })}
          </span>
        </header>
        <div className="mt-4">
          <DailyExpenseChart items={data.spendingByDay} />
        </div>
      </article>
    </section>
  );
}
