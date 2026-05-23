import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useNavigate } from "react-router-dom";

import { authStorage } from "../lib/authStorage";
import { login, register } from "../services/auth.service";

export type AuthMode = "login" | "register";

function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

function focusUsernameInput(
  mode: AuthMode,
  loginRef: RefObject<HTMLInputElement | null>,
  registerRef: RefObject<HTMLInputElement | null>,
) {
  requestAnimationFrame(() => {
    const input =
      mode === "login" ? loginRef.current : registerRef.current;
    input?.focus();
  });
}


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

  const setMode = useCallback((next: AuthMode) => {
    setLoginError("");
    setRegisterError("");
    setModeState(next);
    focusUsernameInput(next, loginUsernameRef, registerUsernameRef);
  }, []);

  const handleLogin = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
        const message = getErrorMessage(err, "No se pudo iniciar sesión.");
        setLoginError(message);
        console.error("Error al iniciar sesión:", err);
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  const handleRegister = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
        const message = getErrorMessage(err, "No se pudo crear la cuenta.");
        setRegisterError(message);
        console.error("Error al crear la cuenta:", err);
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    focusUsernameInput(initialMode, loginUsernameRef, registerUsernameRef);
  }, [initialMode]);

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
