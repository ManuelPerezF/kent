import { NavLink, useNavigate } from "react-router-dom";

import { authStorage } from "@/modules/auth/lib/authStorage";

const NAV_ITEMS = [
  { index: 1, label: "Resumen", path: "/home" },
  { index: 2, label: "Movimientos", path: "/movimientos" },
  { index: 3, label: "Suscripciones", path: "/suscripciones" },
  { index: 4, label: "Cuentas", path: "/cuentas" },
  { index: 5, label: "Categorias", path: "/categorias" },
  { index: 6, label: "Reportes", path: "/reportes" },
];

function formatIndex(index: number) {
  return String(index).padStart(2, "0");
}

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    authStorage.clear();
    navigate("/", { replace: true });
  }

  return (
    <aside className="sidebar flex w-[17.5rem] shrink-0 flex-col">
      <div className="sidebar-brand px-6 pb-8 pt-8">
        <p className="sidebar-brand-eyebrow">Kent</p>
        <p className="sidebar-brand-title">Finanzas personales</p>
      </div>

      <nav aria-label="Navegacion principal" className="flex flex-1 flex-col gap-0.5 px-4">
        <p className="sidebar-section-label px-3 pb-2">Menu</p>
        {NAV_ITEMS.map(({ index, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/home"}
            className="sidebar-nav-link group relative flex items-center gap-3 rounded-sm px-3 py-3"
          >
            <span className="sidebar-nav-index">{formatIndex(index)}</span>
            <span className="sidebar-nav-label truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer border-t border-border/80 px-4 py-5">
        <button type="button" onClick={handleLogout} className="sidebar-logout w-full">
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}
