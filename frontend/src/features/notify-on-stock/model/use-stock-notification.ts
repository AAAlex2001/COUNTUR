"use client";

import { useState } from "react";
import { subscribeToStock, unsubscribeFromStock, useStockSubscriptions } from "@/entities/stock-subscription";
import { useUser } from "@/entities/user";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";

/** Управлять уведомлением о поступлении. */
export function useStockNotification(productId: number) {
  const { user, openAuth } = useUser();
  const { productIds, status, reload, setSubscribed } = useStockSubscriptions();
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const subscribed = productIds.includes(productId);

  /** Сохранить выбор покупателя. */
  async function toggleSubscription() {
    if (saving || status === "loading") return;

    setSaving(true);
    try {
      const save = subscribed ? unsubscribeFromStock : subscribeToStock;
      await save(productId);
      setSubscribed(productId, !subscribed);
      toast(subscribed ? "Уведомление отключено" : "Сообщим на почту, когда товар появится");
    } catch (error) {
      toast(errorMessage(error, "Не удалось изменить подписку"), "error");
    } finally {
      setSaving(false);
    }
  }

  /** Обработать нажатие колокольчика. */
  function toggle() {
    if (!user) return openAuth();
    if (status === "error") {
      toast("Не удалось загрузить подписки. Обновляем список.", "error");
      return reload();
    }

    void toggleSubscription();
  }

  return { subscribed, toggle, pending: saving || status === "loading" };
}
