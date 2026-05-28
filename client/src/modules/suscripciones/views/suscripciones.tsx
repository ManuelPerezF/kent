import AppShell from "@/shared/layout/app-shell";
import SuscripcionesBoard from "../components/suscripcionesBoard";
import { useSuscripciones } from "../hooks/useSuscripciones";

export default function Suscripciones() {
  const {
    status,
    error,
    subscriptions,
    pausedSubscriptions,
    monthlyAmount,
    nextCharge,
    accountMap,
    categoryMap,
    accounts,
    categories,
    creating,
    createError,
    addSubscription,
    togglingId,
    toggleError,
    toggleSubscriptionActive,
  } = useSuscripciones();

  return (
    <AppShell>
      {status === "loading" ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Cargando suscripciones...
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex flex-1 items-center justify-center px-6">
          <p className="border border-destructive/30 bg-card px-4 py-3 text-sm text-destructive">{error}</p>
        </div>
      ) : null}

      {status === "success" ? (
        <SuscripcionesBoard
          subscriptions={subscriptions}
          pausedSubscriptions={pausedSubscriptions}
          monthlyAmount={monthlyAmount}
          nextCharge={nextCharge}
          accountMap={accountMap}
          categoryMap={categoryMap}
          accounts={accounts}
          categories={categories}
          creating={creating}
          createError={createError}
          onCreateSubscription={addSubscription}
          togglingId={togglingId}
          toggleError={toggleError}
          onToggleSubscriptionActive={toggleSubscriptionActive}
        />
      ) : null}
    </AppShell>
  );
}
