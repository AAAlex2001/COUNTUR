export const CATALOG_PATH = "/catalog";

/** Адрес страницы товара. */
export const productPath = (slug: string): string => `/product/${slug}`;

/** Адрес каталога с выбранной категорией. */
export const categoryPath = (slug: string): string =>
  `${CATALOG_PATH}?category=${encodeURIComponent(slug)}`;
