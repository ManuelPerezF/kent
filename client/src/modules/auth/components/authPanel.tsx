import { useAuth, type AuthMode } from "../hooks/useAuth";

interface AuthPanelProps {
  initialMode?: AuthMode;
}

export default function AuthPanel({ initialMode = "login" }: AuthPanelProps) {
  const {
    isLogin,
    setMode,
    showPassword,
    setShowPassword,
    loginError,
    registerError,
    loading,
    loginUsernameRef,
    registerUsernameRef,
    handleLogin,
    handleRegister,
  } = useAuth(initialMode);

  return (
    <div className="w-full max-w-sm border border-border bg-card shadow-(--shadow)">
      <header className="border-b border-border px-6 py-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          {isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </p>
        <h1 className="mt-2 text-lg font-semibold tracking-tight">
          {isLogin ? "Vuelve a tu dinero." : "Empieza con control."}
        </h1>
      </header>

      <div className="auth-forms px-6 py-5">
        <form
          id="login-form"
          aria-hidden={!isLogin}
          className={isLogin ? "active" : undefined}
          onSubmit={handleLogin}
        >
          <div>
            <label htmlFor="login-username" className="field-label">
              Usuario
            </label>
            <input
              ref={loginUsernameRef}
              id="login-username"
              type="text"
              name="username"
              required
              autoComplete="username"
              className="field"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="field-label">
              Contraseña
            </label>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
              className="field"
            />
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            Mostrar contraseña
          </label>

          {loginError && <p className="auth-message">{loginError}</p>}

          <button type="submit" disabled={loading} className="primary-btn">
            {loading && isLogin ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <form
          id="register-form"
          aria-hidden={isLogin}
          className={!isLogin ? "active" : undefined}
          onSubmit={handleRegister}
        >
          <div>
            <label htmlFor="register-username" className="field-label">
              Usuario
            </label>
            <input
              ref={registerUsernameRef}
              id="register-username"
              type="text"
              name="username"
              required
              minLength={3}
              autoComplete="username"
              className="field"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="field-label">
              Contraseña
            </label>
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="field"
            />
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            Mostrar contraseña
          </label>

          {registerError && <p className="auth-message">{registerError}</p>}

          <button type="submit" disabled={loading} className="primary-btn">
            {loading && !isLogin ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      </div>

      <footer className="auth-switch border-t border-border px-6 py-4 text-center">
        {isLogin ? (
          <>
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => setMode("register")}
            >
              Regístrate aquí
            </button>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => setMode("login")}
            >
              Inicia sesión aquí
            </button>
          </>
        )}
      </footer>
    </div>
  );
}
