import type { HeroContent } from "@/entities/landing";

type HeroContentState = {
  fields: HeroContent | null;
  error: string;
  pending: boolean;
};

type HeroContentAction =
  | { type: "load/finish"; fields: HeroContent }
  | { type: "load/error"; error: string }
  | { type: "fields/change"; fields: HeroContent }
  | { type: "save/start" }
  | { type: "save/success"; fields: HeroContent }
  | { type: "save/error" };

export const heroContentReducer = (
  state: HeroContentState,
  action: HeroContentAction,
): HeroContentState => {
  switch (action.type) {
    case "load/finish":
      return { ...state, fields: action.fields };

    case "load/error":
      return { ...state, error: action.error };

    case "fields/change":
      return { ...state, fields: action.fields };

    case "save/start":
      return { ...state, pending: true };

    case "save/success":
      return { ...state, fields: action.fields, pending: false };

    case "save/error":
      return { ...state, pending: false };

    default:
      return state;
  }
};
