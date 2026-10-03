import { API_URL, readErrorMessage } from "@/shared/api";
import type { Order } from "../model/types";

/** Все заказы текущего покупателя, свежие первыми. */
export const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/v1/orders`, { credentials: "include" });

  if (!response.ok) throw new Error(await readErrorMessage(response));

  return response.json();
};
