import type { HeroContentAction, HeroContentState } from "./types";

/** Обновляет черновик и состояние сохранения первого экрана. */
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
      return state.fields ? { ...state, fields: { ...state.fields, ...action.changes } } : state;

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
