import { adminRequest, jsonBody } from "@/shared/api";
import type { FeedbackList, FeedbackMessage, StatusFilter } from "../model/types";

/** Страница обращений, свежие первыми. */
export const fetchFeedback = (filter: StatusFilter, limit: number, offset: number) => {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });

  if (filter !== "all") params.set("status", filter);

  return adminRequest<FeedbackList>(`/feedback?${params}`);
};

/** Обращение целиком вместе с ответом. */
export const fetchMessage = (id: number) => adminRequest<FeedbackMessage>(`/feedback/${id}`);

/** Ответить на обращение письмом на email отправителя. */
export const replyToMessage = (id: number, text: string) =>
  adminRequest<FeedbackMessage>(`/feedback/${id}/reply`, jsonBody("POST", { text }));
