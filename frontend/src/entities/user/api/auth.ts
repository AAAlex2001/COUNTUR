import { API_URL, readErrorMessage } from "@/shared/api";
import type { User } from "../model/types";

const JSON_HEADERS = { "Content-Type": "application/json" };

/** Запрос к API аккаунта. Cookie со входом браузер прикладывает сам. */
const requestAuth = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}/v1/auth${path}`, { credentials: "include", ...init });

  if (!response.ok) throw new Error(await readErrorMessage(response));

  return response.status === 204 ? (undefined as T) : response.json();
};

/** Текущий покупатель. Без входа запрос падает с ошибкой. */
export const fetchMe = () => requestAuth<User>("/me");

/** Зарегистрироваться. Бэкенд сразу ставит cookie со входом. */
export const register = (name: string, email: string, password: string) =>
  requestAuth<User>("/register", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ name, email, password }),
  });

/** Войти по email и паролю. */
export const login = (email: string, password: string) =>
  requestAuth<User>("/login", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, password }),
  });

/** Выйти из аккаунта. */
export const logout = () => requestAuth<void>("/logout", { method: "POST" });
