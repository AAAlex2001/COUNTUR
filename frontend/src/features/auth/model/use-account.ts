"use client";

import { useReducer } from "react";
import { logout, useUser } from "@/entities/user";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { accountReducer } from "./reducers";

/** Окно аккаунта в шапке: открыть, закрыть и выйти. */
export const useAccount = () => {
  const { setUser } = useUser();
  const toast = useToast();
  const [state, dispatch] = useReducer(accountReducer, { open: false, pending: false });

  const open = () => dispatch({ type: "menu/open" });
  const close = () => dispatch({ type: "menu/close" });

  const exit = async () => {
    dispatch({ type: "logout/start" });

    try {
      await logout();
      setUser(null);
      toast("Вы вышли из аккаунта");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось выйти"), "error");
    } finally {
      dispatch({ type: "logout/finish" });
    }
  };

  return { state, open, close, exit };
};
