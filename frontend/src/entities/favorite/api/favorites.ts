import { API_URL, readErrorMessage } from "@/shared/api";
import { load } from "@/shared/api/server";

type FavoriteList = {
  products: { id: number }[];
};

const EMPTY_LIST: FavoriteList = { products: [] };

const toIds = (list: FavoriteList) => list.products.map((product) => product.id);

/** Запрос к API избранного. */
const requestFavorites = async (path: string, method: string): Promise<Response> => {
  const response = await fetch(`${API_URL}/v1/favorites${path}`, {
    method,
    credentials: "include",
  });

  if (!response.ok) throw new Error(await readErrorMessage(response));

  return response;
};

/** Идентификаторы товаров в избранном, запрос с сервера Next.js с cookie покупателя. */
export const getFavoriteIds = async (headers: HeadersInit): Promise<number[]> =>
  toIds(await load("/v1/favorites?limit=200", EMPTY_LIST, headers));

/** Идентификаторы товаров в избранном покупателя. */
export const fetchFavoriteIds = async (): Promise<number[]> => {
  const response = await requestFavorites("?limit=200", "GET");

  return toIds(await response.json());
};

/** Добавить товар в избранное. */
export const addFavorite = (productId: number) => requestFavorites(`/${productId}`, "PUT");

/** Убрать товар из избранного. */
export const removeFavorite = (productId: number) => requestFavorites(`/${productId}`, "DELETE");
