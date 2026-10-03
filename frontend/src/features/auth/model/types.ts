export type AuthTab = "login" | "register";

export type AuthFields = {
  name: string;
  email: string;
  password: string;
  confirm: string;
  agree: boolean;
};

export type AuthState = {
  tab: AuthTab;
  fields: AuthFields;
  showPassword: boolean;
  pending: boolean;
};

export type AuthAction =
  | { type: "tab/change"; tab: AuthTab }
  | { type: "fields/change"; changes: Partial<AuthFields> }
  | { type: "password/toggle" }
  | { type: "submit/start" }
  | { type: "submit/error" }
  | { type: "submit/success" };

export type AccountState = {
  open: boolean;
  pending: boolean;
};

export type AccountAction =
  | { type: "menu/open" }
  | { type: "menu/close" }
  | { type: "logout/start" }
  | { type: "logout/finish" };
