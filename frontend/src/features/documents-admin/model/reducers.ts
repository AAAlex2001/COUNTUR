import type { LegalDocument } from "@/entities/document";
import type { DocumentFields, EditorAction, EditorState, ListAction, ListState } from "./types";

/** Поля формы из документа. */
const toFields = (document: LegalDocument): DocumentFields => ({
  title: document.title,
  description: document.description,
  content: document.content,
});

export const listReducer = (state: ListState, action: ListAction): ListState => {
  switch (action.type) {
    case "load/success":
      return { documents: action.documents, failed: false };

    case "load/error":
      return { ...state, failed: true };

    default:
      return state;
  }
};

export const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case "load/success":
      return { ...state, status: "ready", document: action.document, fields: toFields(action.document) };

    case "load/error":
      return { ...state, status: "failed" };

    case "fields/change":
      return { ...state, fields: { ...state.fields, ...action.changes } };

    case "save/start":
      return { ...state, pending: true };

    case "save/success":
      return { ...state, document: action.document, pending: false };

    case "save/error":
      return { ...state, pending: false };

    default:
      return state;
  }
};
