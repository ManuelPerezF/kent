import { useLocation } from "react-router-dom";

import AuthPanel from "../components/authPanel";

export default function Login() {
  const { pathname } = useLocation();
  const initialMode = pathname === "/register" ? "register" : "login";

  return (
    <div className="flex h-screen items-center justify-center">
      <AuthPanel key={pathname} initialMode={initialMode} />
    </div>
  );
}
