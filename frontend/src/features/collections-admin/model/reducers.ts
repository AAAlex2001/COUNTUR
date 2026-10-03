import type {
  ActionsAction,
  ActionsState,
  EditorAction,
  EditorState,
  FormAction,
  FormState,
  ListAction,
  ListState,
  PickerAction,
  PickerState,
} from "./types";

export const listReducer = (state: ListState, action: ListAction): ListState => {
  switch (action.type) {
    case "load/success":
      return { collections: action.collections, failed: false };

    case "load/error":
      return { ...state, failed: true };

    default:
      return state;
  }
};

export const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case "load/success":
      return { status: "ready", collection: action.collection };

    case "load/error":
      return { ...state, status: "failed" };

    case "collection/change":
      return { ...state, collection: action.collection };

    default:
      return state;
  }
};

export const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
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

export const pickerReducer = (state: PickerState, action: PickerAction): PickerState => {
  switch (action.type) {
    case "query/change":
      return { ...state, query: action.query, loading: action.query.trim().length > 0 };

    case "results/finish":
      return { ...state, results: action.results, loading: false };

    case "clear":
      return { query: "", results: [], loading: false };

    default:
      return state;
  }
};

export const actionsReducer = (state: ActionsState, action: ActionsAction): ActionsState => {
  switch (action.type) {
    case "request/start":
      return { ...state, pending: true };

    case "request/finish":
      return { ...state, pending: false, confirming: false };

    case "remove/ask":
      return { ...state, confirming: true };

    case "remove/cancel":
      return { ...state, confirming: false };

    default:
      return state;
  }
};
