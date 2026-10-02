"use client";

import { useEffect, useReducer } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { deleteReview, fetchAdminReviews, updateReview } from "../api/reviews";
import { reviewsReducer } from "./reducer";
import type { AdminReview, AdminReviewList, ReviewChanges, ReviewFields } from "./types";

const PAGE_SIZE = 10;
const EMPTY_LIST: AdminReviewList = { reviews: [], total: 0 };

/** Отзывы товара в админке: листание, правка, показ на сайте и удаление. */
export const useAdminReviews = (productId: number) => {
  const toast = useToast();
  const [state, dispatch] = useReducer(reviewsReducer, {
    list: EMPTY_LIST,
    page: 1,
    loading: true,
    pending: false,
    editingId: null,
    fields: { author: "", rating: "5", text: "" },
    removingId: null,
  });

  useEffect(() => {
    fetchAdminReviews(productId, PAGE_SIZE, 0)
      .catch(() => EMPTY_LIST)
      .then((list) => dispatch({ type: "load/finish", list }));
  }, [productId]);

  /** Загрузить и показать страницу отзывов. */
  const openPage = async (page: number) => {
    dispatch({ type: "load/start", page });

    try {
      const list = await fetchAdminReviews(productId, PAGE_SIZE, (page - 1) * PAGE_SIZE);

      dispatch({ type: "load/finish", list });
    } catch (failure) {
      dispatch({ type: "load/finish", list: state.list });
      toast(errorMessage(failure, "Не удалось загрузить отзывы"), "error");
    }
  };

  /** Отправить изменения отзыва и показать уведомление. */
  const update = async (id: number, changes: ReviewChanges, success: string) => {
    dispatch({ type: "request/start" });

    try {
      dispatch({ type: "review/updated", review: await updateReview(id, changes) });
      toast(success);
    } catch (failure) {
      dispatch({ type: "request/error" });
      toast(errorMessage(failure, "Не удалось изменить отзыв"), "error");
    }
  };

  const togglePublished = (review: AdminReview) =>
    update(
      review.id,
      { is_published: !review.is_published },
      review.is_published ? "Отзыв скрыт" : "Отзыв показан на сайте",
    );

  const openEdit = (review: AdminReview) => dispatch({ type: "edit/open", review });
  const closeEdit = () => dispatch({ type: "edit/close" });

  const changeFields = (changes: Partial<ReviewFields>) =>
    dispatch({ type: "fields/change", changes });

  /** Сохранить правки отзыва, открытого в окне редактирования. */
  const saveEdit = async () => {
    if (state.editingId === null) return;

    await update(
      state.editingId,
      {
        author_name: state.fields.author.trim(),
        rating: Number(state.fields.rating),
        text: state.fields.text.trim(),
      },
      "Отзыв сохранён",
    );
  };

  const askRemove = (id: number) => dispatch({ type: "remove/ask", id });
  const cancelRemove = () => dispatch({ type: "remove/cancel" });

  /** Удалить отзыв, для которого открыто подтверждение, и перечитать страницу. */
  const remove = async () => {
    if (state.removingId === null) return;

    const lastOnPage = state.list.reviews.length === 1 && state.page > 1;

    dispatch({ type: "request/start" });

    try {
      await deleteReview(state.removingId);
      toast("Отзыв удалён");
      await openPage(lastOnPage ? state.page - 1 : state.page);
    } catch (failure) {
      dispatch({ type: "request/error" });
      toast(errorMessage(failure, "Не удалось удалить отзыв"), "error");
    }
  };

  const pages = Math.ceil(state.list.total / PAGE_SIZE);

  return {
    state,
    pages,
    openPage,
    togglePublished,
    openEdit,
    closeEdit,
    changeFields,
    saveEdit,
    askRemove,
    cancelRemove,
    remove,
  };
};
