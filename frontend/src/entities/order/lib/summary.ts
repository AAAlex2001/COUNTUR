import type { Order } from "../model/types";

/** Сформировать номер заказа. */
export const orderNumber = (id: number) => `CT-${String(id).padStart(6, "0")}`;

/** Посчитать товары в заказе. */
export function orderItemCount(order: Order): number {
  return order.items.reduce((count, item) => count + item.quantity, 0);
}
