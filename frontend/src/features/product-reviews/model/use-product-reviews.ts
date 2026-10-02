"use client";

import { useState } from "react";
import { REVIEWS_PER_PAGE, fetchProductReviews, type ReviewList } from "@/entities/product";

/** Отзывы товара с постраничной подгрузкой с сервера. */
export const useProductReviews = (slug: string, initial: ReviewList) => {
  const [list, setList] = useState(initial);
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Загрузить и показать страницу отзывов. */
  const openPage = async (nextPage: number) => {
    setPending(true);
    setError(null);

    try {
      setList(await fetchProductReviews(slug, nextPage));
      setPage(nextPage);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Не удалось загрузить отзывы");
    } finally {
      setPending(false);
    }
  };

  return {
    reviews: list.reviews,
    page,
    pages: Math.ceil(list.total / REVIEWS_PER_PAGE),
    pending,
    error,
    openPage,
  };
};
