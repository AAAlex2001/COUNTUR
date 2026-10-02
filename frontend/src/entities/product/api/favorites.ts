import { API_URL, readErrorMessage } from "@/shared/api";
import type { ProductCardData } from "../model/types";

/** Карточки товаров из избранного посетителя. */
export const fetchFavoriteProducts = async (): Promise<ProductCardData[]> => {
  const response = await fetch(`${API_URL}/v1/favorites`, { credentials: "include" });

  if (!response.ok) throw new Error(await readErrorMessage(response));

  return response.json();
};
