import type { FavoriteAction, FavoriteState } from "./types";

export const favoriteReducer = (state: FavoriteState, action: FavoriteAction): FavoriteState => {
  switch (action.type) {
    case "toggle/start":
      return { pending: true };

    case "toggle/finish":
      return { pending: false };

    default:
      return state;
  }
};
