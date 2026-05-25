import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";

import Login from "@/modules/auth/views/login";
import Home from "@/modules/home/views/home";
import Movimientos from "@/modules/movimientos/views/movimientos";
import Reportes from "@/modules/reportes/views/reportes";
import Suscripciones from "@/modules/suscripciones/views/suscripciones";
import Cuentas from "@/modules/cuentas/views/cuentas";

const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/register",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/movimientos",
    element: <Movimientos />,
  },
  {
    path: "/reportes",
    element: <Reportes />,
  },
  {
    path: "/suscripciones",
    element: <Suscripciones />,
  },
  {
    path: "/cuentas",
    element: <Cuentas />,
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
