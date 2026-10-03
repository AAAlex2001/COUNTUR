import type {
  AddressAction,
  AddressState,
  NotificationsAction,
  NotificationsState,
  PasswordAction,
  PasswordState,
  ProfileAction,
  ProfileState,
} from "./types";

export const EMPTY_PASSWORD = { current: "", next: "", confirm: "" };

export const profileReducer = (state: ProfileState, action: ProfileAction): ProfileState => {
  switch (action.type) {
    case "fields/change":
      return { ...state, fields: { ...state.fields, ...action.changes } };

    case "fields/reset":
      return { ...state, fields: action.fields };

    case "save/start":
      return { ...state, pending: true };

    case "save/finish":
      return { ...state, pending: false };

    default:
      return state;
  }
};

export const addressReducer = (state: AddressState, action: AddressAction): AddressState => {
  switch (action.type) {
    case "edit/open":
      return { ...state, editing: true, draft: action.draft };

    case "edit/close":
      return { ...state, editing: false };

    case "draft/change":
      return { ...state, draft: action.value };

    case "save/start":
      return { ...state, pending: true };

    case "save/finish":
      return { ...state, pending: false };

    default:
      return state;
  }
};

export const passwordReducer = (state: PasswordState, action: PasswordAction): PasswordState => {
  switch (action.type) {
    case "modal/open":
      return { ...state, open: true, fields: EMPTY_PASSWORD };

    case "modal/close":
      return { ...state, open: false };

    case "fields/change":
      return { ...state, fields: { ...state.fields, ...action.changes } };

    case "save/start":
      return { ...state, pending: true };

    case "save/finish":
      return { ...state, pending: false };

    default:
      return state;
  }
};

export const notificationsReducer = (
  state: NotificationsState,
  action: NotificationsAction,
): NotificationsState => {
  switch (action.type) {
    case "save/start":
      return { pending: true };

    case "save/finish":
      return { pending: false };

    default:
      return state;
  }
};
