import { Button } from "@/shared/components/ui/button";
import PageHeader from "@/shared/components/page-header";
import { FormEvent, useMemo, useState } from "react";

import type {
  Account,
  Category,
  CreateTransactionBody,
  Transaction,
  TransactionType,
} from "../types/movimientos.types";

interface MovimientosTableProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  accountMap: Map<number, string>;
  categoryMap: Map<number, Category>;
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: "ALL" | "INGRESO" | "GASTO";
  onTypeFilterChange: (value: "ALL" | "INGRESO" | "GASTO") => void;
  categoryFilter: number | "ALL";
  onCategoryFilterChange: (value: number | "ALL") => void;
  totalAmount: number;
  creating: boolean;
  createError: string;
  onCreateMovement: (payload: CreateTransactionBody) => Promise<void>;
}

function currency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function dayDate(value: string) {
  const date = new Date(value);
  return {
    day: new Intl.DateTimeFormat("es-MX", { day: "numeric" }).format(date),
    month: new Intl.DateTimeFormat("es-MX", { month: "short" }).format(date),
  };
}

export default function MovimientosTable({
  transactions,
  accounts,
  categories,
  accountMap,
  categoryMap,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  totalAmount,
  creating,
  createError,
  onCreateMovement,
}: MovimientosTableProps) {
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [movementType, setMovementType] = useState<TransactionType>("GASTO");
  const [occurredAt, setOccurredAt] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [accountId, setAccountId] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");

  const categoriesByType = useMemo(
    () => categories.filter((category) => category.kind === movementType),
    [categories, movementType],
  );

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === accountId),
    [accounts, accountId],
  );

  async function handleCreateMovement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accountId || !categoryId) return;

    const parsedAmount = Number(amount);
    if (
      movementType === "GASTO" &&
      selectedAccount &&
      parsedAmount > selectedAccount.balance
    ) {
      return;
    }

    try {
      await onCreateMovement({
        accountId,
        categoryId,
        type: movementType,
        amount: parsedAmount,
        occurredAt: new Date(occurredAt).toISOString(),
        note: note.trim() || undefined,
      });
      setNote("");
      setAmount("");
      setCategoryId("");
    } catch {
      // El error se muestra desde el hook con createError
    }
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-6 lg:p-8">
      <PageHeader
        eyebrow="Kent / Transacciones"
        title="Libro mayor personal."
        description="Filtra, revisa notas y registra movimientos sin salir de la tabla."
      />

      <form
        onSubmit={handleCreateMovement}
        className="grid gap-2 border border-border bg-card p-4 lg:grid-cols-[1.2fr_130px_160px_170px_180px_1fr_auto]"
      >
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Nota o comercio"
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <input
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Monto"
          inputMode="decimal"
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <select
          value={movementType}
          onChange={(event) => {
            setMovementType(event.target.value as TransactionType);
            setCategoryId("");
          }}
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        >
          <option value="GASTO">Gasto</option>
          <option value="INGRESO">Ingreso</option>
        </select>
        <input
          required
          type="date"
          value={occurredAt}
          onChange={(event) => setOccurredAt(event.target.value)}
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <select
          required
          value={accountId}
          onChange={(event) =>
            setAccountId(event.target.value === "" ? "" : Number(event.target.value))
          }
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        >
          <option value="">Cuenta</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} ({currency(account.balance)})
            </option>
          ))}
        </select>
        <select
          required
          value={categoryId}
          onChange={(event) =>
            setCategoryId(event.target.value === "" ? "" : Number(event.target.value))
          }
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        >
          <option value="">Categoria</option>
          {categoriesByType.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Button
          type="submit"
          className="h-10 rounded-none px-5 text-sm"
          disabled={creating}
        >
          {creating ? "Guardando..." : "Guardar"}
        </Button>
      </form>
      {createError ? <p className="text-sm text-destructive">{createError}</p> : null}
      {movementType === "GASTO" &&
      selectedAccount &&
      amount &&
      Number(amount) > selectedAccount.balance ? (
        <p className="text-sm text-destructive">
          El gasto supera el saldo disponible ({currency(selectedAccount.balance)}).
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar comercio, nota o cuenta"
          className="h-10 min-w-[280px] flex-1 border border-border bg-card px-3 text-sm outline-none focus:border-foreground"
        />
        <select
          value={typeFilter}
          onChange={(event) => onTypeFilterChange(event.target.value as "ALL" | "INGRESO" | "GASTO")}
          className="h-10 min-w-[170px] border border-border bg-card px-3 text-sm outline-none focus:border-foreground"
        >
          <option value="ALL">Todos</option>
          <option value="INGRESO">Ingreso</option>
          <option value="GASTO">Gasto</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(event) =>
            onCategoryFilterChange(event.target.value === "ALL" ? "ALL" : Number(event.target.value))
          }
          className="h-10 min-w-[190px] border border-border bg-card px-3 text-sm outline-none focus:border-foreground"
        >
          <option value="ALL">Todas las categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden border border-border bg-card">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              <th className="px-3 py-2 text-left">Fecha</th>
              <th className="px-3 py-2 text-left">Comercio / nota</th>
              <th className="px-3 py-2 text-left">Cuenta</th>
              <th className="px-3 py-2 text-left">Categoria</th>
              <th className="px-3 py-2 text-left">Tipo</th>
              <th className="px-3 py-2 text-right">Importe</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-sm text-muted-foreground">
                  No hay movimientos con esos filtros.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => {
                const date = dayDate(transaction.occurredAt);
                const category = categoryMap.get(transaction.categoryId);
                return (
                  <tr key={transaction.id} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2 text-lg font-medium">
                      {date.day} <span className="text-sm text-muted-foreground">{date.month}</span>
                    </td>
                    <td className="px-3 py-2 text-xl font-semibold tracking-tight">
                      {transaction.note || category?.name || "Movimiento"}
                    </td>
                    <td className="px-3 py-2 text-lg">{accountMap.get(transaction.accountId) ?? "Cuenta"}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex border border-border px-2 py-0.5 text-sm">
                        {category?.name ?? "Sin categoria"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-lg">{transaction.type}</td>
                    <td
                      className={`px-3 py-2 text-right text-2xl font-semibold tracking-tight ${
                        transaction.type === "INGRESO" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {transaction.type === "INGRESO" ? "+" : "-"}
                      {currency(transaction.amount)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-background/40">
              <td colSpan={5} className="px-3 py-3 text-2xl font-medium text-muted-foreground">
                {transactions.length} movimientos
              </td>
              <td
                className={`px-3 py-3 text-right text-4xl font-semibold tracking-tight ${
                  totalAmount > 0 ? "text-emerald-600" : totalAmount < 0 ? "text-rose-600" : ""
                }`}
              >
                {currency(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
