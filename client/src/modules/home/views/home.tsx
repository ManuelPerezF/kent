import { Link } from "react-router-dom";

import AppShell from "@/shared/layout/app-shell";
import { authStorage } from "../../auth/lib/authStorage";

export default function Home() {
  const user = authStorage.getUser();

  return (
    <AppShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <h1 className="text-lg font-semibold">
          Bienvenido{user ? `, ${user.username}` : ""}
        </h1>
        <Link to="/" className="text-accent underline">
          Volver al login
        </Link>
      </div>
    </AppShell>
  );
}
