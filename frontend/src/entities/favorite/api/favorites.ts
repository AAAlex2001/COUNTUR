import type { ProductCardData, ProductList } from "@/entities/product";
import { API_URL, readErrorMessage } from "@/shared/api";
import { load } from "@/shared/api/server";

const EMPTY_LIST: ProductList = { products: [], total: 0 };

/** Запрос к API избранного. */
const requestFavorites = async (path: string, method: string): Promise<Response> => {
  const response = await fetch(`${API_URL}/v1/favorites${path}`, {
    method,
    credentials: "include",
  });

  if (!response.ok) throw new Error(await readErrorMessage(response));

  return response;
};

/** Карточки товаров из избранного, запрос с сервера Next.js с cookie покупателя. */
export const getFavorites = async (headers: HeadersInit): Promise<ProductCardData[]> =>
  (await load("/v1/favorites?limit=200", EMPTY_LIST, headers)).products;

/** Карточки товаров из избранного покупателя. */
export const fetchFavorites = async (): Promise<ProductCardData[]> => {
  const response = await requestFavorites("?limit=200", "GET");
  const list: ProductList = await response.json();

  return list.products;
};

/** Добавить товар в избранное. */
export const addFavorite = (productId: number) => requestFavorites(`/${productId}`, "PUT");

/** Убрать товар из избранного. */
export const removeFavorite = (productId: number) => requestFavorites(`/${productId}`, "DELETE");
