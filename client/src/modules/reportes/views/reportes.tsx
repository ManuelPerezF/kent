import AppShell from "@/shared/layout/app-shell";
import ReportesPeriodFilter from "../components/reportesPeriodFilter";
import ReportesResumen from "../components/reportesResumen";
import { useReportes } from "../hooks/useReportes";

export default function Reportes() {
  const {
    status,
    error,
    summary,
    spendingForChart,
    monthlyExpenses,
    topExpenses,
    periodKind,
    setPeriodKind,
    year,
    setYear,
    month,
    setMonth,
    periodLabel,
    yearOptions,
  } = useReportes();

  return (
    <AppShell>
      {status === "loading" ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Cargando reporte...
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex flex-1 flex-col gap-4 p-6 lg:p-8">
          <p className="border border-destructive/30 bg-card px-4 py-3 text-sm text-destructive">
            {error}
          </p>
          <ReportesPeriodFilter
            periodKind={periodKind}
            year={year}
            month={month}
            yearOptions={yearOptions}
            onPeriodKindChange={setPeriodKind}
            onYearChange={setYear}
            onMonthChange={setMonth}
          />
        </div>
      ) : null}

      {status === "success" && summary ? (
        <ReportesResumen
          summary={summary}
          spendingByCategory={spendingForChart}
          monthlyExpenses={monthlyExpenses}
          topExpenses={topExpenses}
          periodKind={periodKind}
          periodLabel={periodLabel}
          year={year}
          month={month}
          periodFilter={
            <ReportesPeriodFilter
              periodKind={periodKind}
              year={year}
              month={month}
              yearOptions={yearOptions}
              onPeriodKindChange={setPeriodKind}
              onYearChange={setYear}
              onMonthChange={setMonth}
            />
          }
        />
      ) : null}
    </AppShell>
  );
}
