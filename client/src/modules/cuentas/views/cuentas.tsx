import AppShell from "@/shared/layout/app-shell";
import CuentasGrid from "../components/cuentasGrid";
import { useCuentas } from "../hooks/useCuentas";

export default function Cuentas() {
  const { status, error, accounts, creating, createError, addAccount } = useCuentas();

  return (
    <AppShell>
      {status === "loading" ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Cargando cuentas...
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex flex-1 items-center justify-center px-6">
          <p className="border border-destructive/30 bg-card px-4 py-3 text-sm text-destructive">{error}</p>
        </div>
      ) : null}

      {status === "success" ? (
        <CuentasGrid
          accounts={accounts}
          creating={creating}
          createError={createError}
          onCreateAccount={addAccount}
        />
      ) : null}
    </AppShell>
  );
}
