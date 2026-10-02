/** Адрес API для запросов из браузера. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

/** Адрес API для запросов с сервера Next.js. */
export const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:8000/api";
