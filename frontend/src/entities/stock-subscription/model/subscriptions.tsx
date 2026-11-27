"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchSubscriptions } from "../api/subscriptions";

type AccountSubscriptions = {
  userId: number;
  productIds: number[];
  status: "ready" | "error";
};

type StockSubscriptions = {
  productIds: number[];
  status: "loading" | "ready" | "error";
  reload: () => void;
  setSubscribed: (productId: number, subscribed: boolean) => void;
};

const StockSubscriptionsContext = createContext<StockSubscriptions | null>(null);

type StockSubscriptionsProviderProps = { userId?: number; children: ReactNode };

/** Хранить подписки покупателя. */
export function StockSubscriptionsProvider({ userId, children }: StockSubscriptionsProviderProps) {
  const [account, setAccount] = useState<AccountSubscriptions | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (userId === undefined) return;
    const controller = new AbortController();

    fetchSubscriptions(controller.signal)
      .then((productIds) => {
        if (!controller.signal.aborted) setAccount({ userId, productIds, status: "ready" });
      })
      .catch(() => {
        if (!controller.signal.aborted) setAccount({ userId, productIds: [], status: "error" });
      });

    return () => {
      controller.abort();
      setAccount(null);
    };
  }, [userId, attempt]);

  /** Перечитать подписки. */
  function reload() {
    setAccount(null);
    setAttempt((current) => current + 1);
  }

  /** Обновить подписку на товар. */
  function setSubscribed(productId: number, subscribed: boolean) {
    setAccount((current) => {
      if (!current || current.userId !== userId) return current;
      if (current.productIds.includes(productId) === subscribed) return current;

      const productIds = subscribed
        ? [...current.productIds, productId]
        : current.productIds.filter((id) => id !== productId);

      return { ...current, productIds };
    });
  }

  const current = account?.userId === userId ? account : null;
  const value: StockSubscriptions = {
    productIds: current?.productIds ?? [],
    status: current?.status ?? (userId === undefined ? "ready" : "loading"),
    reload,
    setSubscribed,
  };

  return <StockSubscriptionsContext.Provider value={value}>{children}</StockSubscriptionsContext.Provider>;
}

/** Получить подписки покупателя. */
export function useStockSubscriptions() {
  const subscriptions = useContext(StockSubscriptionsContext);
  if (!subscriptions) throw new Error("Для подписок нужен StockSubscriptionsProvider");

  return subscriptions;
}
