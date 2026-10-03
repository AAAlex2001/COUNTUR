import type {
  ActionsAction,
  ActionsState,
  AttributeAction,
  AttributeState,
  EditorAction,
  EditorState,
  FormAction,
  FormState,
  ImagesAction,
  ImagesState,
  ListAction,
  ListState,
} from "./types";

export const listReducer = (state: ListState, action: ListAction): ListState => {
  switch (action.type) {
    case "search/change":
      return { ...state, search: action.value };

    case "load/start":
      return { ...state, query: action.query, page: action.page, loading: true, failed: false };

    case "load/success":
      return { ...state, list: action.list, loading: false };

    case "load/error":
      return { ...state, loading: false, failed: true };

    default:
      return state;
  }
};

export const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case "load/success":
      return {
        status: "ready",
        categories: action.categories,
        brands: action.brands,
        product: action.product,
      };

    case "load/error":
      return { ...state, status: "failed" };

    case "product/change":
      return { ...state, product: action.product };

    case "category/change":
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.category.id ? action.category : category,
        ),
      };

    default:
      return state;
  }
};

export const attributeReducer = (state: AttributeState, action: AttributeAction): AttributeState => {
  switch (action.type) {
    case "fields/change":
      return { ...state, fields: { ...state.fields, ...action.changes } };

    case "save/start":
      return { ...state, pending: true };

    case "save/success":
      return { fields: { ...state.fields, name: "" }, pending: false };

    case "save/error":
      return { ...state, pending: false };

    default:
      return state;
  }
};

export const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "fields/change":
      return { ...state, fields: { ...state.fields, ...action.changes } };

    case "drafts/change":
      return { ...state, drafts: action.drafts };

    case "save/start":
      return { ...state, pending: true };

    case "save/finish":
      return { ...state, pending: false };

    default:
      return state;
  }
};

export const imagesReducer = (state: ImagesState, action: ImagesAction): ImagesState => {
  switch (action.type) {
    case "request/start":
      return { pending: true };

    case "request/finish":
      return { pending: false };

    default:
      return state;
  }
};

export const actionsReducer = (state: ActionsState, action: ActionsAction): ActionsState => {
  switch (action.type) {
    case "request/start":
      return { pending: true, confirming: false };

    case "request/finish":
      return { ...state, pending: false };

    case "remove/ask":
      return { ...state, confirming: true };

    case "remove/cancel":
      return { ...state, confirming: false };

    default:
      return state;
  }
};
