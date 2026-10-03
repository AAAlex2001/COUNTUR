import type { ProductCardData } from "@/entities/product";

export type SearchState = {
  query: string;
  products: ProductCardData[];
  total: number;
  loading: boolean;
  open: boolean;
};

export type SearchAction =
  | { type: "query/change"; query: string }
  | { type: "results/finish"; products: ProductCardData[]; total: number }
  | { type: "open" }
  | { type: "close" };
