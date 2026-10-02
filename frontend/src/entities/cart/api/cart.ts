import { API_URL, readErrorMessage } from "@/shared/api";
import type { Cart } from "../model/types";

const JSON_HEADERS = { "Content-Type": "application/json" };

/** Запрос к API корзины. Любой из них возвращает корзину целиком. */
const requestCart = async (path: string, init?: RequestInit): Promise<Cart> => {
  const response = await fetch(`${API_URL}/v1/cart${path}`, { credentials: "include", ...init });

  if (!response.ok) throw new Error(await readErrorMessage(response));

  return response.json();
};

/** Корзина посетителя. */
export const fetchCart = () => requestCart("");

/** Добавить товар в корзину. */
export const addCartItem = (productId: number, quantity: number) =>
  requestCart("/items", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ product_id: productId, quantity }),
  });

/** Задать количество товара в корзине. */
export const setCartItemQuantity = (productId: number, quantity: number) =>
  requestCart(`/items/${productId}`, {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify({ quantity }),
  });

/** Удалить товар из корзины. */
export const removeCartItem = (productId: number) =>
  requestCart(`/items/${productId}`, { method: "DELETE" });
