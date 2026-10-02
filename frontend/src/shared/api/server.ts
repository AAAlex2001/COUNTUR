import { API_INTERNAL_URL } from "./config";

/** Запрос к бэкенду с сервера Next.js. */
export const internalFetch = (path: string, init?: RequestInit) =>
  fetch(`${API_INTERNAL_URL}${path}`, init);
