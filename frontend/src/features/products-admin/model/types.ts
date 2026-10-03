import type { Availability, Brand, Product } from "@/entities/product";

export type PublicationStatus = "draft" | "published" | "unpublished";

export type AdminAttribute = {
  id: number;
  group: string;
  name: string;
};

export type AdminCategory = {
  id: number;
  name: string;
  attributes: AdminAttribute[];
};

export type AttributePayload = {
  group: string;
  name: string;
};

export type AdminProduct = Product & {
  category_id: number;
  brand_id: number | null;
  stock_quantity: number | null;
  status: PublicationStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AdminProductList = {
  products: AdminProduct[];
  total: number;
};

export type ProductPayload = {
  name: string;
  sku: string | null;
  category_id: number;
  brand_id: number | null;
  short_description: string | null;
  description: string | null;
  highlights: string[];
  price: string;
  old_price: string | null;
  stock_quantity: number | null;
  availability: Availability;
  is_hit: boolean;
  sort_order: number;
  specs: { attribute_id: number; value: string }[];
};

export type ProductFields = {
  name: string;
  sku: string;
  categoryId: string;
  brandId: string;
  shortDescription: string;
  description: string;
  highlights: string;
  price: string;
  oldPrice: string;
  stockQuantity: string;
  availability: Availability;
  isHit: boolean;
  sortOrder: string;
  specs: Record<number, string>;
};

export type DraftImage = {
  id: string;
  url: string;
  file: File;
};

export type ListState = {
  search: string;
  query: string;
  page: number;
  list: AdminProductList | null;
  loading: boolean;
  failed: boolean;
};

export type ListAction =
  | { type: "search/change"; value: string }
  | { type: "load/start"; query: string; page: number }
  | { type: "load/success"; list: AdminProductList }
  | { type: "load/error" };

export type EditorState = {
  status: "loading" | "ready" | "failed";
  categories: AdminCategory[];
  brands: Brand[];
  product: AdminProduct | null;
};

export type EditorAction =
  | {
      type: "load/success";
      categories: AdminCategory[];
      brands: Brand[];
      product: AdminProduct | null;
    }
  | { type: "load/error" }
  | { type: "product/change"; product: AdminProduct }
  | { type: "category/change"; category: AdminCategory };

export type FormState = {
  fields: ProductFields;
  drafts: DraftImage[];
  pending: boolean;
};

export type FormAction =
  | { type: "fields/change"; changes: Partial<ProductFields> }
  | { type: "drafts/change"; drafts: DraftImage[] }
  | { type: "save/start" }
  | { type: "save/finish" };

export type ImagesState = {
  pending: boolean;
};

export type ImagesAction = { type: "request/start" } | { type: "request/finish" };

export type AttributeState = {
  fields: AttributePayload;
  pending: boolean;
};

export type AttributeAction =
  | { type: "fields/change"; changes: Partial<AttributePayload> }
  | { type: "save/start" }
  | { type: "save/success" }
  | { type: "save/error" };

export type ActionsState = {
  pending: boolean;
  confirming: boolean;
};

export type ActionsAction =
  | { type: "request/start" }
  | { type: "request/finish" }
  | { type: "remove/ask" }
  | { type: "remove/cancel" };
