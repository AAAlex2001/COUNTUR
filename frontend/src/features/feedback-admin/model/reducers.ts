import type { ListAction, ListState, MessageAction, MessageState } from "./types";

export const listReducer = (state: ListState, action: ListAction): ListState => {
  switch (action.type) {
    case "load/start":
      return { ...state, filter: action.filter, page: action.page, loading: true, failed: false };

    case "load/success":
      return { ...state, list: action.list, loading: false };

    case "load/error":
      return { ...state, loading: false, failed: true };

    default:
      return state;
  }
};

export const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
  switch (action.type) {
    case "load/success":
      return { ...state, message: action.message, failed: false };

    case "load/error":
      return { ...state, failed: true };

    case "reply/change":
      return { ...state, reply: action.reply };

    case "send/start":
      return { ...state, pending: true };

    case "send/success":
      return { ...state, message: action.message, reply: "", pending: false };

    case "send/error":
      return { ...state, pending: false };

    default:
      return state;
  }
};
