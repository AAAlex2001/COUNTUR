import { adminRequest, jsonBody } from "@/shared/api";

type Admin = {
  login: string;
};

/** Войти в админку. Бэкенд ставит cookie со входом. */
export const login = (adminLogin: string, password: string) =>
  adminRequest<Admin>("/auth/login", jsonBody("POST", { login: adminLogin, password }));

/** Выйти из админки. */
export const logout = () => adminRequest<void>("/auth/logout", { method: "POST" });

/** Текущий администратор. Без входа запрос падает с ошибкой. */
export const fetchMe = () => adminRequest<Admin>("/auth/me");
