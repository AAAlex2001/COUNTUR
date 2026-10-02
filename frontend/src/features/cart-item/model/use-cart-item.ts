"use client";

import { useReducer } from "react";
import { removeCartItem, setCartItemQuantity, useCart } from "@/entities/cart";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { cartItemReducer } from "./reducer";

/** Изменение строки корзины: количество и удаление через подтверждение. */
export const useCartItem = (productId: number) => {
  const { setCart } = useCart();
  const toast = useToast();
  const [state, dispatch] = useReducer(cartItemReducer, { pending: false, confirming: false });

  const changeQuantity = async (quantity: number) => {
    dispatch({ type: "request/start" });

    try {
      setCart(await setCartItemQuantity(productId, quantity));
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось изменить количество"), "error");
    } finally {
      dispatch({ type: "request/finish" });
    }
  };

  const remove = async () => {
    dispatch({ type: "request/start" });

    try {
      setCart(await removeCartItem(productId));
      toast("Товар удалён из корзины");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось удалить товар"), "error");
    } finally {
      dispatch({ type: "request/finish" });
    }
  };

  const askRemove = () => dispatch({ type: "remove/ask" });
  const cancelRemove = () => dispatch({ type: "remove/cancel" });

  return { state, changeQuantity, remove, askRemove, cancelRemove };
};
