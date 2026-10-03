"use client";

import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { logout, useUser } from "@/entities/user";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { logoutReducer } from "./reducers";

/** Выход из аккаунта с возвратом на главную. */
export const useLogout = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const toast = useToast();
  const [state, dispatch] = useReducer(logoutReducer, { pending: false });

  const exit = async () => {
    dispatch({ type: "logout/start" });

    try {
      await logout();
      setUser(null);
      toast("Вы вышли из аккаунта");
      router.push("/");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось выйти"), "error");
    } finally {
      dispatch({ type: "logout/finish" });
    }
  };

  return { state, exit };
};
