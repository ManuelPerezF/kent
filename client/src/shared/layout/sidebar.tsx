import { NavLink } from "react-router-dom";

import { cn } from "@/shared/lib/utils";

const NAV_ITEMS = [
  { index: 1, label: "Resumen", path: "/home" },
  { index: 2, label: "Movimientos", path: "/movimientos" },
  { index: 3, label: "Presupuestos", path: "/presupuestos" },
  { index: 4, label: "Suscripciones", path: "/suscripciones" },
  { index: 5, label: "Cuentas", path: "/cuentas" },
  { index: 6, label: "Reportes", path: "/reportes" },
];

function formatIndex(index: number) {
  return String(index).padStart(2, "0");
}

export default function Sidebar() {
  return (
    <aside className="w-72 shrink-0 px-5 py-8">
      <nav aria-label="Navegación principal" className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ index, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/home"}
            className={({ isActive }) =>
              cn(
                "group flex items-center justify-between px-4 py-3.5 transition-colors",
                isActive
                  ? "border border-foreground"
                  : "border border-transparent hover:bg-sidebar-accent/60",
              )
            }
          >
            <span className="flex min-w-0 items-baseline gap-4">
              <span className="font-mono text-xs text-muted-foreground">
                {formatIndex(index)}
              </span>
              <span className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                {label}
              </span>
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
