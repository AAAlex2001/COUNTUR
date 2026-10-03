import type { ProductCardData } from "@/entities/product";

export type AdminCollection = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  show_on_home: boolean;
  show_in_catalog: boolean;
  is_active: boolean;
  sort_order: number;
  product_ids: number[];
  products: ProductCardData[];
};

export type CollectionPayload = {
  title: string;
  description: string | null;
  show_on_home: boolean;
  show_in_catalog: boolean;
  is_active: boolean;
  sort_order: number;
  product_ids: number[];
};

export type CollectionFields = {
  title: string;
  description: string;
  showOnHome: boolean;
  showInCatalog: boolean;
  isActive: boolean;
  sortOrder: string;
  products: ProductCardData[];
};

export type ListState = {
  collections: AdminCollection[] | null;
  failed: boolean;
};

export type ListAction = { type: "load/success"; collections: AdminCollection[] } | { type: "load/error" };

export type EditorState = {
  status: "loading" | "ready" | "failed";
  collection: AdminCollection | null;
};

export type EditorAction =
  | { type: "load/success"; collection: AdminCollection | null }
  | { type: "load/error" }
  | { type: "collection/change"; collection: AdminCollection };

export type FormState = {
  fields: CollectionFields;
  pending: boolean;
};

export type FormAction =
  | { type: "fields/change"; changes: Partial<CollectionFields> }
  | { type: "save/start" }
  | { type: "save/finish" };

export type PickerState = {
  query: string;
  results: ProductCardData[];
  loading: boolean;
};

export type PickerAction =
  | { type: "query/change"; query: string }
  | { type: "results/finish"; results: ProductCardData[] }
  | { type: "clear" };

export type ActionsState = {
  pending: boolean;
  confirming: boolean;
};

export type ActionsAction =
  | { type: "request/start" }
  | { type: "request/finish" }
  | { type: "remove/ask" }
  | { type: "remove/cancel" };
