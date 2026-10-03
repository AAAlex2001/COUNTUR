import type {
  PagedAction,
  PagedState,
  UserAction,
  UserState,
  UsersListAction,
  UsersListState,
} from "./types";

export const usersListReducer = (state: UsersListState, action: UsersListAction): UsersListState => {
  switch (action.type) {
    case "search/change":
      return { ...state, search: action.value };

    case "load/start":
      return { ...state, query: action.query, page: action.page, loading: true, failed: false };

    case "load/success":
      return { ...state, list: action.list, loading: false };

    case "load/error":
      return { ...state, loading: false, failed: true };

    default:
      return state;
  }
};

export const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "load/success":
      return { user: action.user, failed: false };

    case "load/error":
      return { ...state, failed: true };

    default:
      return state;
  }
};

export const pagedReducer = <T>(state: PagedState<T>, action: PagedAction<T>): PagedState<T> => {
  switch (action.type) {
    case "load/start":
      return { ...state, page: action.page, loading: true, failed: false };

    case "load/success":
      return { ...state, ...action.page, loading: false };

    case "load/error":
      return { ...state, loading: false, failed: true };

    case "items/change":
      return { ...state, items: action.items };

    default:
      return state;
  }
};
