import { API_INTERNAL_URL } from "./config";

/** Запрос к бэкенду с сервера Next.js. */
export const internalFetch = (path: string, init?: RequestInit) =>
  fetch(`${API_INTERNAL_URL}${path}`, init);

/** GET-запрос к бэкенду с сервера. При любой ошибке возвращает fallback. */
export const load = async <T>(path: string, fallback: T, headers?: HeadersInit): Promise<T> => {
  try {
    const response = await internalFetch(path, { cache: "no-store", headers });

    return response.ok ? await response.json() : fallback;
  } catch {
    return fallback;
  }
};
