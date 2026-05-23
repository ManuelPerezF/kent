import type { AuthResponse, PublicUser } from "../types/auth.types";

const TOKEN_KEY = "kent_token";
const USER_KEY = "kent_user";

export const authStorage = {
  save({ user, token }: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): PublicUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as PublicUser;
    } catch {
      return null;
    }
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
