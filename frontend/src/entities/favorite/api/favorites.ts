import { API_URL, readErrorMessage } from "@/shared/api";

type FavoriteProduct = {
  id: number;
};

/** Запрос к API избранного. */
const requestFavorites = async (path: string, method: string): Promise<Response> => {
  const response = await fetch(`${API_URL}/v1/favorites${path}`, {
    method,
    credentials: "include",
  });

  if (!response.ok) throw new Error(await readErrorMessage(response));

  return response;
};

/** Идентификаторы товаров в избранном посетителя. */
export const fetchFavoriteIds = async (): Promise<number[]> => {
  const response = await requestFavorites("", "GET");
  const products: FavoriteProduct[] = await response.json();

  return products.map((product) => product.id);
};

/** Добавить товар в избранное. */
export const addFavorite = (productId: number) => requestFavorites(`/${productId}`, "PUT");

/** Убрать товар из избранного. */
export const removeFavorite = (productId: number) => requestFavorites(`/${productId}`, "DELETE");
