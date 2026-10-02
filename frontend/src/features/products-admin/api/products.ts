import type { Brand } from "@/entities/product";
import { adminRequest, jsonBody } from "@/shared/api";
import type {
  AdminCategory,
  AdminProduct,
  AdminProductList,
  ProductPayload,
  PublicationStatus,
} from "../model/types";

/** Страница списка товаров, включая черновики. */
export const fetchAdminProducts = (query: string, limit: number, offset: number) => {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });

  if (query) params.set("q", query);

  return adminRequest<AdminProductList>(`/products?${params}`);
};

/** Товар для редактирования. */
export const fetchAdminProduct = (id: number) => adminRequest<AdminProduct>(`/products/${id}`);

/** Категории вместе с параметрами характеристик. */
export const fetchAdminCategories = () => adminRequest<AdminCategory[]>("/categories");

/** Все бренды. */
export const fetchAdminBrands = () => adminRequest<Brand[]>("/brands");

/** Создать товар. Он создаётся черновиком. */
export const createProduct = (payload: ProductPayload) =>
  adminRequest<AdminProduct>("/products", jsonBody("POST", payload));

/** Сохранить поля товара. */
export const updateProduct = (id: number, payload: ProductPayload) =>
  adminRequest<AdminProduct>(`/products/${id}`, jsonBody("PATCH", payload));

/** Опубликовать товар или снять его с публикации. */
export const setProductStatus = (id: number, status: PublicationStatus) =>
  adminRequest<AdminProduct>(`/products/${id}`, jsonBody("PATCH", { status }));

/** Удалить товар вместе с фото. */
export const deleteProduct = (id: number) =>
  adminRequest<void>(`/products/${id}`, { method: "DELETE" });

/** Загрузить фото товара. Оно становится последним в галерее. */
export const uploadProductImage = (id: number, file: File) => {
  const body = new FormData();

  body.append("file", file);

  return adminRequest<AdminProduct>(`/products/${id}/images`, { method: "POST", body });
};

/** Удалить фото товара. */
export const deleteProductImage = (id: number, imageId: number) =>
  adminRequest<AdminProduct>(`/products/${id}/images/${imageId}`, { method: "DELETE" });

/** Задать порядок фото. Первое становится главным. */
export const reorderProductImages = (id: number, imageIds: number[]) =>
  adminRequest<AdminProduct>(
    `/products/${id}/images/order`,
    jsonBody("PUT", { image_ids: imageIds }),
  );
