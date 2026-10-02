"use client";

import { useReducer } from "react";
import { addFavorite, removeFavorite, useFavorites } from "@/entities/favorite";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { favoriteReducer } from "./reducer";

/** Добавление товара в избранное и удаление из него. */
export const useToggleFavorite = (productId: number) => {
  const { ids, setIds } = useFavorites();
  const toast = useToast();
  const [state, dispatch] = useReducer(favoriteReducer, { pending: false });
  const active = ids.includes(productId);

  const toggle = async () => {
    dispatch({ type: "toggle/start" });

    try {
      if (active) {
        await removeFavorite(productId);
        setIds(ids.filter((id) => id !== productId));
        toast("Товар убран из избранного");
      } else {
        await addFavorite(productId);
        setIds([...ids, productId]);
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
