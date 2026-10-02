import { internalFetch } from "@/shared/api/server";
import { CATALOG_PAGE_SIZE } from "../lib/catalog";
import type { CatalogFilters, Category, ProductList } from "../model/types";

export type SearchParams = Record<string, string | string[] | undefined>;

const API_PARAMS = ["q", "category", "brand", "in_stock", "price_min", "price_max", "spec", "sort"];

const EMPTY_LIST: ProductList = { products: [], total: 0 };

const EMPTY_FILTERS: CatalogFilters = {
  price_min: null,
  price_max: null,
  brands: [],
  attributes: [],
};

/** GET-запрос к бэкенду. При любой ошибке возвращает fallback. */
const load = async <T>(path: string, fallback: T): Promise<T> => {
  try {
    const response = await internalFetch(path, { cache: "no-store" });

    return response.ok ? await response.json() : fallback;
  } catch {
    return fallback;
  }
};

/** Страница каталога. Параметры адреса называются как в API и уходят туда как есть. */
export const getProducts = (params: SearchParams): Promise<ProductList> => {
  const query = new URLSearchParams();

  for (const name of API_PARAMS) {
    for (const value of [params[name]].flat()) {
      if (value) query.append(name, value);
    }
  }

  const page = Math.max(1, Number(params.page) || 1);

  query.set("limit", String(CATALOG_PAGE_SIZE));
  query.set("offset", String((page - 1) * CATALOG_PAGE_SIZE));

  return load(`/v1/products?${query}`, EMPTY_LIST);
};

/** Категории с количеством товаров в каждой. */
export const getCategories = (): Promise<Category[]> => load("/v1/categories", []);

/** Данные для панели фильтров: цены, бренды и характеристики категории. */
export const getCatalogFilters = (categorySlug: string | null): Promise<CatalogFilters> => {
  const search = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";

  return load(`/v1/catalog/filters${search}`, EMPTY_FILTERS);
};
