import { API_URL, readErrorMessage } from "@/shared/api";
import type { ReviewList } from "../model/types";
import { REVIEWS_PER_PAGE } from "./products";

/** Страница отзывов товара, запрос из браузера. */
export const fetchProductReviews = async (slug: string, page: number): Promise<ReviewList> => {
  const offset = (page - 1) * REVIEWS_PER_PAGE;
  const url = `${API_URL}/v1/products/${encodeURIComponent(slug)}/reviews`;

  const response = await fetch(`${url}?limit=${REVIEWS_PER_PAGE}&offset=${offset}`);

  if (!response.ok) throw new Error(await readErrorMessage(response));

  return response.json();
};
