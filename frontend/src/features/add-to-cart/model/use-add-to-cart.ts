"use client";

import { useReducer } from "react";
import { addCartItem, useCart } from "@/entities/cart";
import { useUser } from "@/entities/user";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { addToCartReducer } from "./reducer";

/** Добавление товара в корзину. Без входа открывает окно входа. */
export const useAddToCart = (productId: number) => {
  const { user, openAuth } = useUser();
  const { setCart } = useCart();
  const toast = useToast();
  const [state, dispatch] = useReducer(addToCartReducer, { pending: false });

  /** Добавить quantity штук. Возвращает true, если получилось. */
  const add = async (quantity: number): Promise<boolean> => {
    if (!user) {
      openAuth();

      return false;
    }

    dispatch({ type: "add/start" });

    try {
      setCart(await addCartItem(productId, quantity));
      toast("Товар добавлен в корзину");

      return true;
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось добавить товар в корзину"), "error");

      return false;
    } finally {
      dispatch({ type: "add/finish" });
    }
  };

  return { state, add };
};
