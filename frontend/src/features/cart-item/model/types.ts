export type CartItemState = {
  pending: boolean;
  confirming: boolean;
};

export type CartItemAction =
  | { type: "request/start" }
  | { type: "request/finish" }
  | { type: "remove/ask" }
  | { type: "remove/cancel" };
