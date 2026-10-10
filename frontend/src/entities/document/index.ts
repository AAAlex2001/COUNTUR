export type { LegalDocument } from "./model/types";
export { getDocument } from "./api/documents";

/** Адрес страницы документа на сайте: он совпадает со slug. */
export const documentPath = (slug: string): string => `/${slug}`;
