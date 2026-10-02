import type { Review } from "@/entities/product";

export type AdminReview = Review & {
  is_published: boolean;
};

export type AdminReviewList = {
  reviews: AdminReview[];
  total: number;
};

export type ReviewChanges = {
  author_name?: string;
  rating?: number;
  text?: string;
  is_published?: boolean;
};

export type ReviewFields = {
  author: string;
  rating: string;
  text: string;
};

export type ReviewsState = {
  list: AdminReviewList;
  page: number;
  loading: boolean;
  pending: boolean;
  editingId: number | null;
  fields: ReviewFields;
  removingId: number | null;
};

export type ReviewsAction =
  | { type: "load/start"; page: number }
  | { type: "load/finish"; list: AdminReviewList }
  | { type: "request/start" }
  | { type: "request/error" }
  | { type: "review/updated"; review: AdminReview }
  | { type: "edit/open"; review: AdminReview }
  | { type: "edit/close" }
  | { type: "fields/change"; changes: Partial<ReviewFields> }
  | { type: "remove/ask"; id: number }
  | { type: "remove/cancel" };
