export type ProfileFields = {
  name: string;
  lastName: string;
  phone: string;
  email: string;
};

export type ProfileState = {
  fields: ProfileFields;
  pending: boolean;
};

export type ProfileAction =
  | { type: "fields/change"; changes: Partial<ProfileFields> }
  | { type: "fields/reset"; fields: ProfileFields }
  | { type: "save/start" }
  | { type: "save/finish" };

export type AddressState = {
  editing: boolean;
  draft: string;
  pending: boolean;
};

export type AddressAction =
  | { type: "edit/open"; draft: string }
  | { type: "edit/close" }
  | { type: "draft/change"; value: string }
  | { type: "save/start" }
  | { type: "save/finish" };

export type PasswordFields = {
  current: string;
  next: string;
  confirm: string;
};

export type PasswordState = {
  open: boolean;
  fields: PasswordFields;
  pending: boolean;
};

export type PasswordAction =
  | { type: "modal/open" }
  | { type: "modal/close" }
  | { type: "fields/change"; changes: Partial<PasswordFields> }
  | { type: "save/start" }
  | { type: "save/finish" };

export type NotificationsState = {
  pending: boolean;
};

export type NotificationsAction = { type: "save/start" } | { type: "save/finish" };
