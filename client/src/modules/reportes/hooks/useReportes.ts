import { useCallback, useEffect, useMemo, useState } from "react";

import {
  buildYearOptions,
  formatReportPeriodLabel,
  getMonthlyChartRange,
  getReportPeriodRange,
  type ReportPeriodKind,
  type ReportPeriodSelection,
} from "../lib/reportPeriod";
import {
  fetchMonthlyExpenses,
  fetchReportsSummary,
  fetchSpendingByCategory,
  fetchTopExpenses,
} from "../services/reportes.service";
import type {
  CategorySpendingItem,
  MonthlyExpenseItem,
  ReportsSummaryResponse,
  TopExpenseItem,
} from "../types/reportes.types";

type Status = "loading" | "success" | "error";

interface ReportesState {
  status: Status;
  error: string;
  summary: ReportsSummaryResponse | null;
  spending: CategorySpendingItem[];
  monthlyExpenses: MonthlyExpenseItem[];
  topExpenses: TopExpenseItem[];
}

const now = new Date();

export function useReportes() {
  const [periodKind, setPeriodKind] = useState<ReportPeriodKind>("month");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const [state, setState] = useState<ReportesState>({
    status: "loading",
    error: "",
    summary: null,
    spending: [],
    monthlyExpenses: [],
    topExpenses: [],
  });

  const period: ReportPeriodSelection = useMemo(
    () => ({ kind: periodKind, year, month }),
    [periodKind, year, month],
  );

  const periodLabel = useMemo(() => formatReportPeriodLabel(period), [period]);
  const yearOptions = useMemo(() => buildYearOptions(), []);

  const load = useCallback(async (cancelled = false) => {
    setState((prev) => ({
      ...prev,
      status: "loading",
      error: "",
    }));

    const reportRange = getReportPeriodRange(period);
    const chartRange = getMonthlyChartRange(period);

    try {
      const [summary, spending, monthlyExpenses, topExpenses] = await Promise.all([
        fetchReportsSummary(reportRange),
        fetchSpendingByCategory(reportRange),
        fetchMonthlyExpenses(chartRange),
        fetchTopExpenses(reportRange, 5),
      ]);

      if (!cancelled) {
        setState({
          status: "success",
          error: "",
          summary,
          spending,
          monthlyExpenses,
          topExpenses,
        });
      }
    } catch (error) {
      if (cancelled) return;
      setState({
        status: "error",
        error: error instanceof Error ? error.message : "No se pudo cargar el reporte.",
        summary: null,
        spending: [],
        monthlyExpenses: [],
        topExpenses: [],
      });
    }
  }, [period]);

  useEffect(() => {
    let cancelled = false;
    void load(cancelled);
    return () => {
      cancelled = true;
    };
  }, [load]);

  const spendingForChart = useMemo(() => {
    return [...state.spending].filter((item) => item.spent > 0).sort((a, b) => b.spent - a.spent);
  }, [state.spending]);

  return {
    ...state,
    spendingForChart,
    periodKind,
    setPeriodKind,
    year,
    setYear,
    month,
    setMonth,
    periodLabel,
    yearOptions,
  };
}
