"use client";

import { useReducer } from "react";
import { login, register, useUser } from "@/entities/user";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { INITIAL_AUTH, authReducer } from "./reducers";
import type { AuthFields, AuthTab } from "./types";
import { validateAuth } from "./validate";

/** Окно входа и регистрации: вкладки, поля и отправка. После успеха сессия сразу активна. */
export const useAuth = () => {
  const { setUser, closeAuth } = useUser();
  const toast = useToast();
  const [state, dispatch] = useReducer(authReducer, INITIAL_AUTH);
  const { tab, fields } = state;

  const changeTab = (next: AuthTab) => dispatch({ type: "tab/change", tab: next });
  const change = (changes: Partial<AuthFields>) => dispatch({ type: "fields/change", changes });
  const togglePassword = () => dispatch({ type: "password/toggle" });

  const submit = async () => {
    const error = validateAuth(tab, fields);

    if (error) {
      toast(error, "error");

      return;
    }

    dispatch({ type: "submit/start" });

    try {
      const email = fields.email.trim();
      const user =
        tab === "login"
          ? await login(email, fields.password)
          : await register(fields.name.trim(), email, fields.password);

      dispatch({ type: "submit/success" });
      setUser(user);
      closeAuth();
      toast(tab === "login" ? `С возвращением, ${user.name}` : `Добро пожаловать, ${user.name}`);
    } catch (failure) {
      dispatch({ type: "submit/error" });
      toast(errorMessage(failure, "Не удалось войти"), "error");
    }
  };

  return { state, changeTab, change, togglePassword, submit };
};
