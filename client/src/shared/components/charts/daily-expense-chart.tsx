import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";

export interface DailyExpenseItem {
  date: string;
  label: string;
  total: number;
}

const chartConfig = {
  total: {
    label: "Gasto",
    color: "hsl(221 83% 53%)",
  },
} satisfies ChartConfig;

function currency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTooltipDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

interface DailyExpenseChartProps {
  items: DailyExpenseItem[];
  className?: string;
}

export default function DailyExpenseChart({ items, className }: DailyExpenseChartProps) {
  const hasData = items.some((item) => item.total > 0);

  if (!hasData) {
    return (
      <p className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
        Sin gastos registrados este mes.
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig} className={className ?? "aspect-auto h-[240px] w-full"}>
      <AreaChart data={items} accessibilityLayer margin={{ top: 8, left: 4, right: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="dailyExpenseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-total)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-total)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={52}
          tickFormatter={(value) => (value >= 1000 ? `$${value / 1000}k` : `$${value}`)}
        />
        <ChartTooltip
          cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                const point = payload?.[0]?.payload as DailyExpenseItem | undefined;
                return point ? formatTooltipDate(point.date) : "";
              }}
              formatter={(value) => currency(Number(value))}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="var(--color-total)"
          strokeWidth={2}
          fill="url(#dailyExpenseFill)"
          dot={{ r: 3, fill: "var(--color-total)", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "var(--color-total)", strokeWidth: 0 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
