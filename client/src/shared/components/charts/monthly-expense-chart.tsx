import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";

export interface MonthlyExpenseItem {
  year: number;
  month: number;
  label: string;
  total: number;
}

const chartConfig = {
  total: {
    label: "Gasto",
    color: "hsl(221 83% 53%)",
  },
  current: {
    label: "Mes actual",
    color: "hsl(38 92% 50%)",
  },
} satisfies ChartConfig;

function currency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

interface MonthlyExpenseChartProps {
  items: MonthlyExpenseItem[];
  className?: string;
  highlightMonth?: number;
  highlightYear?: number;
}

export default function MonthlyExpenseChart({
  items,
  className,
  highlightMonth,
  highlightYear,
}: MonthlyExpenseChartProps) {
  const now = new Date();
  const focusMonth = highlightMonth ?? now.getMonth();
  const focusYear = highlightYear ?? now.getFullYear();

  const chartData = items.map((item) => {
    const isCurrent = item.month === focusMonth && item.year === focusYear;
    return {
      label: item.label,
      total: item.total,
      fill: isCurrent ? "var(--color-current)" : "var(--color-total)",
    };
  });

  const hasData = chartData.some((item) => item.total > 0);

  if (!hasData) {
    return (
      <p className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        Sin gastos registrados en este periodo.
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig} className={className ?? "aspect-auto h-[280px] w-full"}>
      <BarChart data={chartData} accessibilityLayer margin={{ top: 8, left: 4, right: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={52}
          tickFormatter={(value) => (value >= 1000 ? `$${value / 1000}k` : `$${value}`)}
        />
        <ChartTooltip
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.35 }}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value) => currency(Number(value))}
            />
          }
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ChartContainer>
  );
}
