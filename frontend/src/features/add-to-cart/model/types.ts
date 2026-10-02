export type AddToCartState = {
  pending: boolean;
};

export type AddToCartAction = { type: "add/start" } | { type: "add/finish" };
