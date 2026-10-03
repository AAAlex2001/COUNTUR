"use client";

import { useReducer } from "react";
import { changePassword } from "@/entities/user";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { EMPTY_PASSWORD, passwordReducer } from "./reducers";
import type { PasswordFields } from "./types";

const PASSWORD_MIN_LENGTH = 8;

/** Текст первой ошибки в полях смены пароля или null. */
const validate = (fields: PasswordFields): string | null => {
  if (!fields.current) return "Укажите текущий пароль";
  if (fields.next.length < PASSWORD_MIN_LENGTH) return "Новый пароль короче 8 символов";
  if (!/[a-zа-яё]/i.test(fields.next) || !/\d/.test(fields.next)) {
    return "В пароле должны быть и буквы, и цифры";
  }
  if (fields.next !== fields.confirm) return "Пароли не совпадают";

  return null;
};

/** Окно смены пароля: открыть, заполнить, сохранить. */
export const usePassword = () => {
  const toast = useToast();
  const [state, dispatch] = useReducer(passwordReducer, {
    open: false,
    fields: EMPTY_PASSWORD,
    pending: false,
  });

  const open = () => dispatch({ type: "modal/open" });
  const close = () => dispatch({ type: "modal/close" });
  const change = (changes: Partial<PasswordFields>) => dispatch({ type: "fields/change", changes });

  const save = async () => {
    const error = validate(state.fields);

    if (error) {
      toast(error, "error");

      return;
    }

    dispatch({ type: "save/start" });

    try {
      await changePassword(state.fields.current, state.fields.next);
      dispatch({ type: "modal/close" });
      toast("Пароль изменён");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось изменить пароль"), "error");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { state, open, close, change, save };
};
