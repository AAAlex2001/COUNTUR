import type {
  HeroImageAction,
  HeroImageState,
  PromotionAction,
  PromotionState,
} from "./types";

export const heroImageReducer = (
  state: HeroImageState,
  action: HeroImageAction,
): HeroImageState => {
  switch (action.type) {
    case "load/finish":
      return { ...state, imageUrl: action.imageUrl, loaded: true };

    case "upload/start":
      return { ...state, pending: true };

    case "upload/success":
      return { ...state, imageUrl: action.imageUrl, pending: false };

    case "upload/error":
      return { ...state, pending: false };

    default:
      return state;
  }
};

export const promotionReducer = (
  state: PromotionState,
  action: PromotionAction,
): PromotionState => {
  switch (action.type) {
    case "load/finish":
      return { ...state, fields: action.fields, imageUrl: action.imageUrl };

    case "fields/change":
      return { ...state, fields: { ...state.fields, ...action.changes } };

    case "request/start":
      return { ...state, pending: true };

    case "request/finish":
      return { ...state, pending: false };

    case "image/change":
      return { ...state, imageUrl: action.imageUrl };

    default:
      return state;
  }
};
