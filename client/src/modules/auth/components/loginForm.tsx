import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-sm border border-border bg-card shadow-(--shadow)">
      {/* header KENT */}
      <header className="border-b border-border px-6 py-5 text-center">
        <h1 className="text-lg font-semibold tracking-tight">Kent</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Expense tracker personal y local
        </p>
      </header>

      {/* form */}
      <form className="px-6 py-5">
        <div className="mb-4">
          <label
            htmlFor="email"
            className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="tu@email.com"
            className="mt-1 h-[34px] w-full border border-border bg-card px-3 text-sm outline-none transition-colors hover:border-accent focus:border-accent"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
          >
            Contraseña
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            className="mt-1 h-[34px] w-full border border-border bg-card px-3 text-sm outline-none transition-colors hover:border-accent focus:border-accent"
          />
        </div>

        <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm transition-colors">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="accent-accent"
          />
          Mostrar contraseña
        </label>

        <button
          type="submit"
          className="h-[34px] w-full bg-foreground text-sm font-semibold text-background transition-colors hover:bg-accent"
        >
          Iniciar sesión
        </button>
      </form>

      <footer className="border-t border-border px-6 py-4 text-center text-sm">
        ¿No tienes cuenta?{" "}
        <a href="#" className="text-accent underline">
          Regístrate aquí
        </a>
      </footer>
    </div>
  );
}
