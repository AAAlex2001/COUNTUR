import type { ProductCardData } from "@/entities/product";

export type Collection = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  products: ProductCardData[];
};

export type Placement = "home" | "catalog";
