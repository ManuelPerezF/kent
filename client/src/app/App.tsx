import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";

import Login from "@/modules/auth/views/login";
import Home from "@/modules/home/views/home";
import Movimientos from "@/modules/movimientos/views/movimientos";
import Reportes from "@/modules/reportes/views/reportes";

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
]);

export default function App() {
  return <RouterProvider router={router} />;
}
