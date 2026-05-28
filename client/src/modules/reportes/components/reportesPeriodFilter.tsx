import { MONTH_OPTIONS, type ReportPeriodKind } from "../lib/reportPeriod";

interface ReportesPeriodFilterProps {
  periodKind: ReportPeriodKind;
  year: number;
  month: number;
  yearOptions: number[];
  onPeriodKindChange: (kind: ReportPeriodKind) => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

const selectClassName =
  "h-10 border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground";

export default function ReportesPeriodFilter({
  periodKind,
  year,
  month,
  yearOptions,
  onPeriodKindChange,
  onYearChange,
  onMonthChange,
}: ReportesPeriodFilterProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 border border-border bg-card p-4">
      <div className="flex min-w-[140px] flex-col gap-1.5">
        <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          Periodo
        </label>
        <select
          value={periodKind}
          onChange={(event) => onPeriodKindChange(event.target.value as ReportPeriodKind)}
          className={selectClassName}
        >
          <option value="month">Mes</option>
          <option value="year">Ano</option>
        </select>
      </div>

      <div className="flex min-w-[120px] flex-col gap-1.5">
        <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          Ano
        </label>
        <select
          value={year}
          onChange={(event) => onYearChange(Number(event.target.value))}
          className={selectClassName}
        >
          {yearOptions.map((optionYear) => (
            <option key={optionYear} value={optionYear}>
              {optionYear}
            </option>
          ))}
        </select>
      </div>

      {periodKind === "month" ? (
        <div className="flex min-w-[160px] flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
            Mes
          </label>
          <select
            value={month}
            onChange={(event) => onMonthChange(Number(event.target.value))}
            className={selectClassName}
          >
            {MONTH_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
