import type { AccountAction, AccountState, AuthAction, AuthState } from "./types";

export const INITIAL_AUTH: AuthState = {
  tab: "login",
  fields: { name: "", email: "", password: "", confirm: "", agree: false },
  showPassword: false,
  pending: false,
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "tab/change":
      return { ...state, tab: action.tab };

    case "fields/change":
      return { ...state, fields: { ...state.fields, ...action.changes } };

    case "password/toggle":
      return { ...state, showPassword: !state.showPassword };

    case "submit/start":
      return { ...state, pending: true };

    case "submit/error":
      return { ...state, pending: false };

    case "submit/success":
      return INITIAL_AUTH;

    default:
      return state;
  }
};

export const accountReducer = (state: AccountState, action: AccountAction): AccountState => {
  switch (action.type) {
    case "menu/open":
      return { ...state, open: true };

    case "menu/close":
      return { ...state, open: false };

    case "logout/start":
      return { ...state, pending: true };

    case "logout/finish":
      return { open: false, pending: false };

    default:
      return state;
  }
};
