import type { SearchAction, SearchState } from "./types";

/** С какого числа символов начинаем искать. */
export const MIN_QUERY_LENGTH = 2;

export const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case "query/change":
      return {
        ...state,
        query: action.query,
        loading: action.query.trim().length >= MIN_QUERY_LENGTH,
        open: true,
      };

    case "results/finish":
      return { ...state, products: action.products, total: action.total, loading: false };

    case "open":
      return { ...state, open: true };

    case "close":
      return { ...state, open: false };

    default:
      return state;
  }
};
