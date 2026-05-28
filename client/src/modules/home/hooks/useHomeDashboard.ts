import { useCallback, useEffect, useState } from "react";

import { fetchHomeDashboard } from "../services/home.service";
import type { HomeDashboardData } from "../types/home.types";

type HomeDashboardState =
  | { status: "loading" }
  | { status: "success"; data: HomeDashboardData }
  | { status: "error"; message: string };

export function useHomeDashboard() {
  const [state, setState] = useState<HomeDashboardState>({ status: "loading" });
  const [reloadTick, setReloadTick] = useState(0);

  const reload = useCallback(() => {
    setReloadTick((value) => value + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState({ status: "loading" });

      try {
        const data = await fetchHomeDashboard();
        if (!cancelled) {
          setState({ status: "success", data });
        }
      } catch (error) {
        if (cancelled) return;

        const message =
          error instanceof Error ? error.message : "No se pudo cargar el resumen.";
        setState({ status: "error", message });
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [reloadTick]);

  return { state, reload };
}
