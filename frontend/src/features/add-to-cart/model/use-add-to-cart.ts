"use client";

import { useState } from "react";
import { addCartItem, useCart } from "@/entities/cart";

const ADDED_HINT_MS = 2000;

/** Добавление товара в корзину: запрос, состояние загрузки и текст ошибки. */
export const useAddToCart = (productId: number) => {
  const { setCart } = useCart();
  const [pending, setPending] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Добавить quantity штук. Возвращает true, если получилось. */
  const add = async (quantity: number): Promise<boolean> => {
    setPending(true);
    setError(null);

    try {
      setCart(await addCartItem(productId, quantity));
      setAdded(true);
      setTimeout(() => setAdded(false), ADDED_HINT_MS);

      return true;
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Не удалось добавить товар в корзину");

      return false;
    } finally {
      setPending(false);
    }
  };

  return { pending, added, error, add };
};
