import { internalFetch } from "@/shared/api/server";
import type { Product, ReviewList } from "../model/types";

export const REVIEWS_PER_PAGE = 10;

const EMPTY_REVIEWS: ReviewList = { reviews: [], total: 0 };

/** Товар по slug. null, если товара нет или бэкенд недоступен. */
export const getProduct = async (slug: string): Promise<Product | null> => {
  try {
    const response = await internalFetch(`/v1/products/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
};

/** Первая страница отзывов товара. */
export const getProductReviews = async (slug: string): Promise<ReviewList> => {
  try {
    const response = await internalFetch(
      `/v1/products/${encodeURIComponent(slug)}/reviews?limit=${REVIEWS_PER_PAGE}`,
      { cache: "no-store" },
    );

    return response.ok ? await response.json() : EMPTY_REVIEWS;
  } catch {
    return EMPTY_REVIEWS;
  }
};
