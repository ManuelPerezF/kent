import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authStorage } from "../lib/authStorage";
import { login, register } from "../services/auth.service";

export type AuthMode = "login" | "register";

export function useAuth(initialMode: AuthMode = "login") {
  const navigate = useNavigate();
  const [mode, setModeState] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUsernameRef = useRef<HTMLInputElement>(null);
  const registerUsernameRef = useRef<HTMLInputElement>(null);

  const isLogin = mode === "login";

  function setMode(next: AuthMode) {
    setLoginError("");
    setRegisterError("");
    setModeState(next);

    requestAnimationFrame(() => {
      const input =
        next === "login"
          ? loginUsernameRef.current
          : registerUsernameRef.current;
      input?.focus();
    });
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const session = await login({ username, password });
      authStorage.save(session);
      navigate("/home");
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : "No se pudo iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegisterError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (password.length < 8) {
      setRegisterError("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const session = await register({ username, password });
      authStorage.save(session);
      navigate("/home");
    } catch (err) {
      setRegisterError(
        err instanceof Error ? err.message : "No se pudo crear la cuenta.",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
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
  };
}
