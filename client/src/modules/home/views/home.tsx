import AppShell from "@/shared/layout/app-shell";
import HomeOverview from "../components/homeOverview";
import { useHomeDashboard } from "../hooks/useHomeDashboard";

export default function Home() {
  const { state, reload } = useHomeDashboard();

  return (
    <AppShell>
      {state.status === "loading" ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Cargando panel principal...
        </div>
      ) : null}

      {state.status === "error" ? (
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="border border-destructive/30 bg-card p-5">
            <p className="text-sm text-destructive">{state.message}</p>
            <button
              type="button"
              onClick={reload}
              className="mt-3 border border-border bg-card px-3 py-1.5 text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : null}

      {state.status === "success" ? <HomeOverview data={state.data} /> : null}
    </AppShell>
  );
}
