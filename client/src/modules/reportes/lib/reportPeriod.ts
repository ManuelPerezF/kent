export type ReportPeriodKind = "month" | "year";

export interface ReportPeriodSelection {
  kind: ReportPeriodKind;
  year: number;
  month: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export function getReportPeriodRange(selection: ReportPeriodSelection): DateRange {
  if (selection.kind === "year") {
    const from = new Date(selection.year, 0, 1);
    from.setHours(0, 0, 0, 0);
    const to = new Date(selection.year, 11, 31);
    to.setHours(23, 59, 59, 999);
    return { from, to };
  }

  const from = new Date(selection.year, selection.month, 1);
  from.setHours(0, 0, 0, 0);
  const to = new Date(selection.year, selection.month + 1, 0);
  to.setHours(23, 59, 59, 999);
  return { from, to };
}

/** Rango para la grafica mensual: ano completo o ultimos 6 meses hasta el mes elegido. */
export function getMonthlyChartRange(selection: ReportPeriodSelection): DateRange {
  if (selection.kind === "year") {
    return getReportPeriodRange(selection);
  }

  const to = new Date(selection.year, selection.month + 1, 0);
  to.setHours(23, 59, 59, 999);
  const from = new Date(selection.year, selection.month - 5, 1);
  from.setHours(0, 0, 0, 0);
  return { from, to };
}

export function formatReportPeriodLabel(selection: ReportPeriodSelection): string {
  if (selection.kind === "year") {
    return String(selection.year);
  }

  return new Date(selection.year, selection.month, 1).toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });
}

export const MONTH_OPTIONS = [
  { value: 0, label: "Enero" },
  { value: 1, label: "Febrero" },
  { value: 2, label: "Marzo" },
  { value: 3, label: "Abril" },
  { value: 4, label: "Mayo" },
  { value: 5, label: "Junio" },
  { value: 6, label: "Julio" },
  { value: 7, label: "Agosto" },
  { value: 8, label: "Septiembre" },
  { value: 9, label: "Octubre" },
  { value: 10, label: "Noviembre" },
  { value: 11, label: "Diciembre" },
];

export function buildYearOptions(referenceYear = new Date().getFullYear(), span = 6): number[] {
  return Array.from({ length: span }, (_, index) => referenceYear - (span - 1) + index);
}
