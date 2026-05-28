import type { Account } from "../types/cuentas.types";
import { Button } from "@/shared/components/ui/button";
import PageHeader from "@/shared/components/page-header";
import { FormEvent, useState } from "react";

interface CuentasGridProps {
  accounts: Account[];
  creating: boolean;
  createError: string;
  onCreateAccount: (payload: {
    name: string;
    type: "EFECTIVO" | "TARJETA";
    initialBalance?: number;
  }) => Promise<void>;
}

function currency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CuentasGrid({ accounts, creating, createError, onCreateAccount }: CuentasGridProps) {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const [name, setName] = useState("");
  const [type, setType] = useState<"EFECTIVO" | "TARJETA">("TARJETA");
  const [initialBalance, setInitialBalance] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onCreateAccount({
      name: name.trim(),
      type,
      initialBalance: initialBalance ? Number(initialBalance) : 0,
    });

    setName("");
    setInitialBalance("");
    setType("TARJETA");
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-6 lg:p-8">
      <PageHeader
        eyebrow="Kent / Cuentas"
        title="Cuentas conectadas para conciliar rapido."
        description="Tus medios de pago con tipo y saldo inicial para cuadrar movimientos."
      />

      <form onSubmit={handleSubmit} className="grid gap-3 border border-border bg-card p-4 lg:grid-cols-[1.4fr_180px_180px_auto]">
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nombre de la cuenta"
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <select
          value={type}
          onChange={(event) => setType(event.target.value as "EFECTIVO" | "TARJETA")}
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        >
          <option value="TARJETA">Tarjeta</option>
          <option value="EFECTIVO">Efectivo</option>
        </select>
        <input
          value={initialBalance}
          onChange={(event) => setInitialBalance(event.target.value)}
          placeholder="Saldo inicial"
          inputMode="numeric"
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <Button type="submit" className="h-10 rounded-none px-5 text-sm" disabled={creating}>
          {creating ? "Guardando..." : "Crear cuenta"}
        </Button>
      </form>
      {createError ? <p className="text-sm text-destructive">{createError}</p> : null}

      <div className="grid gap-3 md:grid-cols-3">
        <article className="border border-border bg-card p-4 md:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Saldo total actual</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight">{currency(totalBalance)}</p>
        </article>
        <article className="border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Cuentas activas</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight">{accounts.length}</p>
        </article>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <article key={account.id} className="border border-border bg-card p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{account.type}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{account.name}</h2>
            <p className="mt-3 text-2xl font-medium">{currency(account.balance)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Inicial {currency(account.initialBalance)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
