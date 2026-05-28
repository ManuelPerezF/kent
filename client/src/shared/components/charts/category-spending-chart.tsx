export interface CategorySpendingChartItem {
  categoryId: number;
  categoryName: string;
  color: string | null;
  spent: number;
}

const BAR_COLORS = ["#059669", "#2563eb", "#f59e0b", "#8b5cf6", "#f43f5e", "#64748b"];

function currency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function currentMonthLabel() {
  return new Date().toLocaleDateString("es-MX", { month: "long" });
}

interface CategorySpendingChartProps {
  items: CategorySpendingChartItem[];
  limit?: number;
  monthLabel?: string;
  className?: string;
}

export default function CategorySpendingChart({
  items,
  limit = 5,
  monthLabel = currentMonthLabel(),
  className,
}: CategorySpendingChartProps) {
  const rows = [...items]
    .filter((item) => item.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, limit);

  const maxSpent = Math.max(...rows.map((item) => item.spent), 1);

  if (rows.length === 0) {
    return (
      <p className={`text-sm text-muted-foreground ${className ?? ""}`}>
        Sin gastos por categoria este mes.
      </p>
    );
  }

  return (
    <div className={className}>
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-[2rem] font-semibold tracking-tight">Gasto por categoria</h2>
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
          {monthLabel}
        </span>
      </header>
      <ul className="mt-4 space-y-4">
        {rows.map((item, index) => {
          const widthPct = Math.max((item.spent / maxSpent) * 100, 8);
          const barColor = item.color ?? BAR_COLORS[index % BAR_COLORS.length];

          return (
            <li
              key={item.categoryId}
              className="group grid grid-cols-[minmax(0,130px)_1fr_auto] items-center gap-3"
            >
              <span className="truncate text-lg font-medium">{item.categoryName}</span>
              <div className="h-2 w-full bg-muted">
                <div
                  className="h-full transition-[width] duration-500 ease-out group-hover:brightness-110"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
              <span className="text-xl font-semibold tracking-tight tabular-nums">
                {currency(item.spent)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
