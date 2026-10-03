"use client";

import { useEffect, useReducer } from "react";
import { fetchOrders } from "@/entities/order";
import { filterOrders } from "./filters";
import { ordersReducer } from "./reducer";
import type { OrdersFilter } from "./types";

/** Заказы покупателя: загрузка и фильтр по статусу. */
export const useOrders = () => {
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

  return { state, visible: filterOrders(state.orders, state.filter), changeFilter };
};
