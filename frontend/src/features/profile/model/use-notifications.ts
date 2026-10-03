"use client";

import { useReducer } from "react";
import { updateProfile, useUser, type UserChanges } from "@/entities/user";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { notificationsReducer } from "./reducers";

/** Переключатели уведомлений: каждое изменение сразу сохраняется в аккаунт. */
export const useNotifications = () => {
  const { setUser } = useUser();
  const toast = useToast();
  const [state, dispatch] = useReducer(notificationsReducer, { pending: false });

  const toggle = async (changes: UserChanges) => {
    dispatch({ type: "save/start" });

    try {
      setUser(await updateProfile(changes));
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить настройку"), "error");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { state, toggle };
};
