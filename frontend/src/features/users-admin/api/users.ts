import type { CartItem } from "@/entities/cart";
import type { Order } from "@/entities/order";
import type { ProductCardData } from "@/entities/product";
import type { User } from "@/entities/user";
import { adminRequest, jsonBody } from "@/shared/api";
import type { AdminUserList, OrderChanges, Page } from "../model/types";

const pageQuery = (limit: number, offset: number) => `limit=${limit}&offset=${offset}`;

/** Страница покупателей с поиском по имени и email. */
export const fetchAdminUsers = (query: string, limit: number, offset: number) =>
  adminRequest<AdminUserList>(
    `/users?q=${encodeURIComponent(query)}&${pageQuery(limit, offset)}`,
  );

/** Карточка покупателя. */
export const fetchAdminUser = (userId: number) => adminRequest<User>(`/users/${userId}`);

/** Страница заказов покупателя, свежие первыми. */
export const fetchUserOrders = async (
  userId: number,
  limit: number,
  offset: number,
): Promise<Page<Order>> => {
  const list = await adminRequest<{ orders: Order[]; total: number }>(
    `/users/${userId}/orders?${pageQuery(limit, offset)}`,
  );

  return { items: list.orders, total: list.total };
};

/** Страница избранного покупателя. */
export const fetchUserFavorites = async (
  userId: number,
  limit: number,
  offset: number,
): Promise<Page<ProductCardData>> => {
  const list = await adminRequest<{ products: ProductCardData[]; total: number }>(
    `/users/${userId}/favorites?${pageQuery(limit, offset)}`,
  );

  return { items: list.products, total: list.total };
};

/** Страница корзины покупателя. */
export const fetchUserCart = (userId: number, limit: number, offset: number) =>
  adminRequest<Page<CartItem>>(`/users/${userId}/cart?${pageQuery(limit, offset)}`);

/** Изменить статус заказа или статус оплаты. */
export const updateOrderStatus = (orderId: number, changes: OrderChanges) =>
  adminRequest<Order>(`/orders/${orderId}`, jsonBody("PATCH", changes));
