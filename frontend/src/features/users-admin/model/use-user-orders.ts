"use client";

import { useState } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { fetchUserOrders, updateOrder } from "../api/users";
import type { OrderChanges } from "./types";
import { usePagedList } from "./use-paged-list";

/** Управлять заказами покупателя. */
export function useUserOrders(userId: number) {
  const orders = usePagedList(fetchUserOrders, userId);
  const [savingIds, setSavingIds] = useState<number[]>([]);
  const toast = useToast();

  /** Сохранить изменения заказа. */
  async function save(orderId: number, changes: OrderChanges) {
    if (savingIds.includes(orderId)) return;
    setSavingIds((ids) => [...ids, orderId]);

    try {
      const updated = await updateOrder(orderId, changes);
      orders.updateItems((items) => items.map((order) => order.id === orderId ? updated : order));
      toast("Заказ обновлён");
    } catch (error) {
      toast(errorMessage(error, "Не удалось изменить заказ"), "error");
    } finally {
      setSavingIds((ids) => ids.filter((id) => id !== orderId));
    }
  }

  return { ...orders, savingIds, save };
}
