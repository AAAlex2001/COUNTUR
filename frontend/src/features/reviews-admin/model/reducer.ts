import type { ReviewsAction, ReviewsState } from "./types";

export const reviewsReducer = (state: ReviewsState, action: ReviewsAction): ReviewsState => {
  switch (action.type) {
    case "load/start":
      return { ...state, page: action.page, loading: true, removingId: null };

    case "load/finish":
      return { ...state, list: action.list, loading: false, pending: false };

    case "request/start":
      return { ...state, pending: true };

    case "request/error":
      return { ...state, pending: false, removingId: null };

    case "review/updated":
      return {
        ...state,
        pending: false,
        editingId: null,
        list: {
          ...state.list,
          reviews: state.list.reviews.map((review) =>
            review.id === action.review.id ? action.review : review,
          ),
        },
      };

    case "edit/open":
      return {
        ...state,
        editingId: action.review.id,
        fields: {
          author: action.review.author_name,
          rating: String(action.review.rating),
          text: action.review.text,
        },
      };

    case "edit/close":
      return { ...state, editingId: null };

    case "fields/change":
      return { ...state, fields: { ...state.fields, ...action.changes } };

    case "remove/ask":
      return { ...state, removingId: action.id };

    case "remove/cancel":
      return { ...state, removingId: null };

    default:
      return state;
  }
};
