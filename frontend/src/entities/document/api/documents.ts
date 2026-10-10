import { load } from "@/shared/api/server";
import type { LegalDocument } from "../model/types";

/** Документ магазина по адресу. Несуществующий или недоступный — null. */
export const getDocument = (slug: string): Promise<LegalDocument | null> =>
  load(`/v1/documents/${encodeURIComponent(slug)}`, null);
