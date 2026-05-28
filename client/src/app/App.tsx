import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";

import RequireAuth from "@/modules/auth/components/require-auth";
import Login from "@/modules/auth/views/login";
import Home from "@/modules/home/views/home";
import Movimientos from "@/modules/movimientos/views/movimientos";
import Reportes from "@/modules/reportes/views/reportes";
import Suscripciones from "@/modules/suscripciones/views/suscripciones";
import Cuentas from "@/modules/cuentas/views/cuentas";
import Categorias from "@/modules/categorias/views/categorias";

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
    element: <RequireAuth />,
    children: [
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
      },
      {
        path: "/categorias",
        element: <Categorias />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
