import type { AddToCartAction, AddToCartState } from "./types";

export const addToCartReducer = (
  state: AddToCartState,
  action: AddToCartAction,
): AddToCartState => {
  switch (action.type) {
    case "add/start":
      return { pending: true };

    case "add/finish":
      return { pending: false };

    default:
      return state;
  }
};
