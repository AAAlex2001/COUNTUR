import type { ReviewsAction, ReviewsState } from "./types";

export const reviewsReducer = (state: ReviewsState, action: ReviewsAction): ReviewsState => {
  switch (action.type) {
    case "page/start":
      return { ...state, pending: true };

    case "page/success":
      return { list: action.list, page: action.page, pending: false };

    case "page/error":
      return { ...state, pending: false };

    default:
      return state;
  }
};
