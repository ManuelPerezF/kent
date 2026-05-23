import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";

import Login from "@/modules/auth/views/login";
import Home from "@/modules/auth/views/home";

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
]);

export default function App() {
  return <RouterProvider router={router} />;
}
