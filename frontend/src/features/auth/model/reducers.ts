import type { AuthAction, AuthState, LogoutAction, LogoutState } from "./types";

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

export const logoutReducer = (state: LogoutState, action: LogoutAction): LogoutState => {
  switch (action.type) {
    case "logout/start":
      return { pending: true };

    case "logout/finish":
      return { pending: false };

    default:
      return state;
  }
};
