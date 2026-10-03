import { API_URL, readErrorMessage } from "@/shared/api";
import type { Order } from "../model/types";

type OrderList = {
  orders: Order[];
  total: number;
};

/** Заказы текущего покупателя, свежие первыми. */
export const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/v1/orders?limit=100`, { credentials: "include" });

  if (!response.ok) throw new Error(await readErrorMessage(response));

  const list: OrderList = await response.json();

  return list.orders;
};
