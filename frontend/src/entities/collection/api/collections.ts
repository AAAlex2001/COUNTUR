import { load } from "@/shared/api/server";
import type { Collection, Placement } from "../model/types";

/** Включённые подборки с товарами. С placement — только для главной или каталога. */
export const getCollections = (placement?: Placement): Promise<Collection[]> =>
  load(placement ? `/v1/collections?placement=${placement}` : "/v1/collections", []);

/** Одна подборка по адресу. Выключенная или несуществующая — null. */
export const getCollection = (slug: string): Promise<Collection | null> =>
  load(`/v1/collections/${encodeURIComponent(slug)}`, null);
