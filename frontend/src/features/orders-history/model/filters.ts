import type { Order } from "@/entities/order";
import type { OrdersFilter, OrdersFilterOption } from "./types";

export const ORDERS_FILTERS: OrdersFilterOption[] = [
  { value: "all", label: "Все заказы", statuses: null },
  { value: "processing", label: "В работе", statuses: ["new", "confirmed", "awaiting_payment", "paid"] },
  { value: "shipped", label: "В пути", statuses: ["shipped"] },
  { value: "completed", label: "Получены", statuses: ["completed"] },
  { value: "canceled", label: "Отменены", statuses: ["canceled"] },
];

/** Заказы, подходящие под фильтр. */
export const filterOrders = (orders: Order[], filter: OrdersFilter): Order[] => {
  const option = ORDERS_FILTERS.find((item) => item.value === filter);

  if (!option?.statuses) return orders;

  return orders.filter((order) => option.statuses?.includes(order.status));
};
