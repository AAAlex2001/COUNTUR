import type { LegalDocument } from "@/entities/document";

export type DocumentFields = {
  title: string;
  description: string;
  content: string;
};

export type ListState = {
  documents: LegalDocument[] | null;
  failed: boolean;
};

export type ListAction =
  | { type: "load/success"; documents: LegalDocument[] }
  | { type: "load/error" };

export type EditorState = {
  status: "loading" | "ready" | "failed";
  document: LegalDocument | null;
  fields: DocumentFields;
  pending: boolean;
};

export type EditorAction =
  | { type: "load/success"; document: LegalDocument }
  | { type: "load/error" }
  | { type: "fields/change"; changes: Partial<DocumentFields> }
  | { type: "save/start" }
  | { type: "save/success"; document: LegalDocument }
  | { type: "save/error" };
