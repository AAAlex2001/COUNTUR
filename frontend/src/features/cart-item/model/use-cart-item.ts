"use client";

import { useState } from "react";
import { removeCartItem, setCartItemQuantity, useCart, type Cart } from "@/entities/cart";

/** Изменение строки корзины: количество и удаление. */
export const useCartItem = (productId: number) => {
  const { setCart } = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Выполнить запрос и заменить корзину той, что вернул бэкенд. */
  const send = async (request: Promise<Cart>) => {
    setPending(true);
    setError(null);

    try {
      setCart(await request);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Не удалось изменить корзину");
    } finally {
      setPending(false);
    }
  };

  const changeQuantity = (quantity: number) => send(setCartItemQuantity(productId, quantity));
  const remove = () => send(removeCartItem(productId));

  return { pending, error, changeQuantity, remove };
};
