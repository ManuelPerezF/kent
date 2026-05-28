type BalanceTransaction = {
  type: "INGRESO" | "GASTO";
  amount: number;
};

/** Saldo actual = saldo inicial + ingresos − gastos de la cuenta. */
export function computeAccountBalance(
  initialBalance: number,
  transactions: BalanceTransaction[],
): number {
  return transactions.reduce(
    (sum, tx) => (tx.type === "INGRESO" ? sum + tx.amount : sum - tx.amount),
    initialBalance,
  );
}
