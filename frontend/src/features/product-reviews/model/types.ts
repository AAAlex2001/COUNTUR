import type { ReviewList } from "@/entities/product";

export type ReviewsState = {
  list: ReviewList;
  page: number;
  pending: boolean;
};

export type ReviewsAction =
  | { type: "page/start" }
  | { type: "page/success"; list: ReviewList; page: number }
  | { type: "page/error" };
