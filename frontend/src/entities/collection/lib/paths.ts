export const COLLECTIONS_PATH = "/collections";

/** Адрес страницы подборки. */
export const collectionPath = (slug: string): string =>
  `${COLLECTIONS_PATH}/${encodeURIComponent(slug)}`;
