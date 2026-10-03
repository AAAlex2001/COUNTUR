import { API_URL, readErrorMessage } from "@/shared/api";
import type { ProductList } from "../model/types";

/** Поиск товаров по названию из браузера — для подсказок в шапке. */
export const searchProducts = async (query: string, limit: number): Promise<ProductList> => {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  const response = await fetch(`${API_URL}/v1/products?${params}`);

  if (!response.ok) throw new Error(await readErrorMessage(response));

  return response.json();
};
