import type { Order, OrderStatus } from "@/entities/order";

export type OrdersFilter = "all" | "processing" | "shipped" | "completed" | "canceled";

export type OrdersFilterOption = {
  value: OrdersFilter;
  label: string;
  statuses: OrderStatus[] | null;
};

export type OrdersState = {
  orders: Order[];
  loaded: boolean;
  filter: OrdersFilter;
};

export type OrdersAction =
  | { type: "load/finish"; orders: Order[] }
  | { type: "filter/change"; filter: OrdersFilter };
