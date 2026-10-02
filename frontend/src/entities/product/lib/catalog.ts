import type { ProductSort } from "../model/types";

export const CATALOG_PAGE_SIZE = 12;

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "popular", label: "По популярности" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
  { value: "name_asc", label: "По названию: А–Я" },
  { value: "name_desc", label: "По названию: Я–А" },
];
