import { adminRequest, jsonBody } from "@/shared/api";
import type { AdminReview, AdminReviewList, ReviewChanges } from "../model/types";

/** Страница отзывов товара, включая скрытые. */
export const fetchAdminReviews = (productId: number, limit: number, offset: number) =>
  adminRequest<AdminReviewList>(`/products/${productId}/reviews?limit=${limit}&offset=${offset}`);

/** Изменить отзыв: автора, оценку, текст или показ на сайте. */
export const updateReview = (id: number, changes: ReviewChanges) =>
  adminRequest<AdminReview>(`/reviews/${id}`, jsonBody("PATCH", changes));

/** Удалить отзыв. */
export const deleteReview = (id: number) =>
  adminRequest<void>(`/reviews/${id}`, { method: "DELETE" });
