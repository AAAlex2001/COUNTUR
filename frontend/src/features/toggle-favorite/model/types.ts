export type FavoriteState = {
  pending: boolean;
};

export type FavoriteAction = { type: "toggle/start" } | { type: "toggle/finish" };
