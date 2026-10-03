"use client";

import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import { fetchOrders, type Order } from "@/entities/order";
import { ordersReducer } from "./reducer";
import type { OrdersFilter } from "./types";

type OrdersValue = {
  orders: Order[];
  loaded: boolean;
  filter: OrdersFilter;
  changeFilter: (filter: OrdersFilter) => void;
};

const OrdersContext = createContext<OrdersValue | null>(null);

type OrdersProviderProps = {
  children: ReactNode;
};

/** Заказы покупателя для кабинета: один запрос на сайдбар и страницу заказов. */
export const OrdersProvider = ({ children }: OrdersProviderProps) => {
  const [state, dispatch] = useReducer(ordersReducer, {
    orders: [],
    loaded: false,
    filter: "all",
  });

  useEffect(() => {
    fetchOrders()
      .catch(() => [])
      .then((orders) => dispatch({ type: "load/finish", orders }));
  }, []);

  const changeFilter = (filter: OrdersFilter) => dispatch({ type: "filter/change", filter });

  return (
    <OrdersContext.Provider value={{ ...state, changeFilter }}>{children}</OrdersContext.Provider>
  );
};

/** Заказы из OrdersProvider. */
export const useOrders = (): OrdersValue => {
  const value = useContext(OrdersContext);

  if (!value) {
    throw new Error("useOrders можно вызывать только внутри OrdersProvider");
  }

  return value;
};
