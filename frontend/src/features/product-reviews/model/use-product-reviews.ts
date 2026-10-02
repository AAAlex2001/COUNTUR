"use client";

import { useReducer } from "react";
import { REVIEWS_PER_PAGE, fetchProductReviews, type ReviewList } from "@/entities/product";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { reviewsReducer } from "./reducer";

/** Отзывы товара с постраничной подгрузкой с сервера. */
export const useProductReviews = (slug: string, initial: ReviewList) => {
  const toast = useToast();
  const [state, dispatch] = useReducer(reviewsReducer, { list: initial, page: 1, pending: false });

  /** Загрузить и показать страницу отзывов. */
  const openPage = async (page: number) => {
    dispatch({ type: "page/start" });

    try {
      dispatch({ type: "page/success", list: await fetchProductReviews(slug, page), page });
    } catch (failure) {
      dispatch({ type: "page/error" });
      toast(errorMessage(failure, "Не удалось загрузить отзывы"), "error");
    }
  };

  return { state, pages: Math.ceil(state.list.total / REVIEWS_PER_PAGE), openPage };
};
