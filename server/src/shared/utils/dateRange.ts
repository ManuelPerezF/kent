import { ValidationError } from "../errors/appError.js";

export interface DateRange {
  from: Date;
  to: Date;
}

export function getCurrentMonthRange(reference: Date = new Date()): DateRange {
  const from = new Date(reference.getFullYear(), reference.getMonth(), 1);
  from.setHours(0, 0, 0, 0);

  const to = new Date(reference.getFullYear(), reference.getMonth() + 1, 0);
  to.setHours(23, 59, 59, 999);

  return { from, to };
}

export function parseDateRangeQuery(fromParam?: unknown, toParam?: unknown): DateRange {
  const defaults = getCurrentMonthRange();
  const from = fromParam !== undefined ? new Date(String(fromParam)) : defaults.from;
  const to = toParam !== undefined ? new Date(String(toParam)) : defaults.to;

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    throw new ValidationError("from o to inválidos");
  }

  if (to < from) {
    throw new ValidationError("from debe ser anterior o igual a to");
  }

  return { from, to };
}
