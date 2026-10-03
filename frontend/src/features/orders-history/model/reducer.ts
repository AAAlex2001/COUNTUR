import type { OrdersAction, OrdersState } from "./types";

export const ordersReducer = (state: OrdersState, action: OrdersAction): OrdersState => {
  switch (action.type) {
    case "load/finish":
      return { ...state, orders: action.orders, loaded: true };

    case "filter/change":
      return { ...state, filter: action.filter };

    default:
      return state;
  }
};
