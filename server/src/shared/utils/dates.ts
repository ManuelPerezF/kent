/** Suma meses conservando el día del mes (ajuste automático de fin de mes). */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function startOfToday(reference = new Date()): Date {
  const date = new Date(reference);
  date.setHours(0, 0, 0, 0);
  return date;
}
