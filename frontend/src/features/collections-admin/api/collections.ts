import type { ProductCardData } from "@/entities/product";
import { adminRequest, jsonBody } from "@/shared/api";
import type { AdminCollection, CollectionPayload } from "../model/types";

/** Все подборки, включая выключенные. */
export const fetchCollections = () => adminRequest<AdminCollection[]>("/collections");

/** Подборка для редактирования. */
export const fetchCollection = (id: number) => adminRequest<AdminCollection>(`/collections/${id}`);

/** Создать подборку. */
export const createCollection = (payload: CollectionPayload) =>
  adminRequest<AdminCollection>("/collections", jsonBody("POST", payload));

/** Сохранить подборку. product_ids заменяет состав целиком. */
export const updateCollection = (id: number, payload: CollectionPayload) =>
  adminRequest<AdminCollection>(`/collections/${id}`, jsonBody("PATCH", payload));

/** Удалить подборку. Товары остаются в каталоге. */
export const deleteCollection = (id: number) =>
  adminRequest<void>(`/collections/${id}`, { method: "DELETE" });

/** Товары по названию или артикулу для добавления в подборку, включая черновики. */
export const searchAdminProducts = async (query: string): Promise<ProductCardData[]> => {
  const params = new URLSearchParams({ q: query, limit: "8" });
  const list = await adminRequest<{ products: ProductCardData[] }>(`/products?${params}`);

  return list.products;
};
