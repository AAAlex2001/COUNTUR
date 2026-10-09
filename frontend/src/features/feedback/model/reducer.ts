import type { FeedbackAction, FeedbackFields, FeedbackState } from "./types";

export const EMPTY_FIELDS: FeedbackFields = {
  name: "",
  email: "",
  subject: "",
  message: "",
  consent: false,
};

export const feedbackReducer = (state: FeedbackState, action: FeedbackAction): FeedbackState => {
  switch (action.type) {
    case "fields/change":
      return { ...state, fields: { ...state.fields, ...action.changes } };

    case "send/start":
      return { ...state, pending: true };

    case "send/success":
      return { fields: EMPTY_FIELDS, pending: false, sent: true };

    case "send/error":
      return { ...state, pending: false };

    case "reset":
      return { ...state, sent: false };

    default:
      return state;
  }
};
