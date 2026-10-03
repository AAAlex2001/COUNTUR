"use client";

import { useReducer } from "react";
import { addFavorite, fetchFavorites, removeFavorite, useFavorites } from "@/entities/favorite";
import { useUser } from "@/entities/user";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { favoriteReducer } from "./reducer";

/** Добавление товара в избранное и удаление из него. Без входа открывает окно входа. */
export const useToggleFavorite = (productId: number) => {
  const { user, openAuth } = useUser();
  const { products, ids, setProducts } = useFavorites();
  const toast = useToast();
  const [state, dispatch] = useReducer(favoriteReducer, { pending: false });
  const active = ids.includes(productId);

  const toggle = async () => {
    if (!user) {
      openAuth();

      return;
    }

    dispatch({ type: "toggle/start" });

    try {
      if (active) {
        await removeFavorite(productId);
        setProducts(products.filter((product) => product.id !== productId));
        toast("Товар убран из избранного");
      } else {
        await addFavorite(productId);
        setProducts(await fetchFavorites());
        toast("Товар добавлен в избранное");
      }
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось изменить избранное"), "error");
    } finally {
      dispatch({ type: "toggle/finish" });
    }
  };

  return { state, active, toggle };
};
