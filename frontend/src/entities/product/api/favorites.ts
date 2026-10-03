import { API_URL, readErrorMessage } from "@/shared/api";
import type { ProductCardData, ProductList } from "../model/types";

/** Карточки товаров из избранного покупателя. */
export const fetchFavoriteProducts = async (): Promise<ProductCardData[]> => {
  const response = await fetch(`${API_URL}/v1/favorites?limit=200`, { credentials: "include" });

  if (!response.ok) throw new Error(await readErrorMessage(response));

  const list: ProductList = await response.json();

  return list.products;
};
