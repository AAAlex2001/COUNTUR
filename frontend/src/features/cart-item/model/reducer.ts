import type { CartItemAction, CartItemState } from "./types";

export const cartItemReducer = (state: CartItemState, action: CartItemAction): CartItemState => {
  switch (action.type) {
    case "request/start":
      return { pending: true, confirming: false };

    case "request/finish":
      return { ...state, pending: false };

    case "remove/ask":
      return { ...state, confirming: true };

    case "remove/cancel":
      return { ...state, confirming: false };

    default:
      return state;
  }
};
