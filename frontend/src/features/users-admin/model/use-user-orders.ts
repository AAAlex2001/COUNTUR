"use client";

import { useState } from "react";
import type { Order } from "@/entities/order";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { fetchUserOrders, updateOrderStatus } from "../api/users";
import type { OrderChanges } from "./types";
import { usePagedList } from "./use-paged-list";

/** Заказы покупателя в админке: листание и смена статусов прямо в списке. */
export const useUserOrders = (userId: number) => {
  const toast = useToast();
  const orders = usePagedList(fetchUserOrders, userId);
  const [pendingId, setPendingId] = useState<number | null>(null);

  /** Поменять статус заказа или оплаты и обновить строку в списке. */
  const change = async (order: Order, changes: OrderChanges) => {
    setPendingId(order.id);

    try {
      const updated = await updateOrderStatus(order.id, changes);

      orders.changeItems(orders.state.items.map((item) => (item.id === updated.id ? updated : item)));
      toast("Статус заказа обновлён");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось изменить заказ"), "error");
    } finally {
      setPendingId(null);
    }
  };

  return { ...orders, pendingId, change };
};
