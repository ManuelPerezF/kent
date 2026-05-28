import { Navigate, Outlet } from "react-router-dom";

import { authStorage } from "../lib/authStorage";

export default function RequireAuth() {
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
