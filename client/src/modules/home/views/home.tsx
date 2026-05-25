import { Link } from "react-router-dom";

import { authStorage } from "../../auth/lib/authStorage";

export default function Home() {
  const user = authStorage.getUser();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-lg font-semibold">
        Bienvenido{user ? `, ${user.username}` : ""}
      </h1>
      <Link to="/" className="text-accent underline">
        Volver al login
      </Link>
    </div>
  );
}
