"use client";

import { useReducer } from "react";
import { updateProfile, useUser, type User } from "@/entities/user";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { profileReducer } from "./reducers";
import type { ProfileFields } from "./types";

/** Поля формы из профиля. */
const toFields = (user: User): ProfileFields => ({
  name: user.name,
  lastName: user.last_name ?? "",
  phone: user.phone ?? "",
  email: user.email,
});

/** Личные данные: имя, фамилия, телефон и email с сохранением в аккаунт. */
export const useProfile = (user: User) => {
  const { setUser } = useUser();
  const toast = useToast();
  const [state, dispatch] = useReducer(profileReducer, {
    fields: toFields(user),
    pending: false,
  });

  const change = (changes: Partial<ProfileFields>) => dispatch({ type: "fields/change", changes });
  const reset = () => dispatch({ type: "fields/reset", fields: toFields(user) });

  const save = async () => {
    const { fields } = state;

    if (!fields.name.trim()) {
      toast("Укажите имя", "error");

      return;
    }

    dispatch({ type: "save/start" });

    try {
      const updated = await updateProfile({
        name: fields.name,
        last_name: fields.lastName || null,
        phone: fields.phone || null,
        email: fields.email,
      });

      setUser(updated);
      dispatch({ type: "fields/reset", fields: toFields(updated) });
      toast("Данные сохранены");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить данные"), "error");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { state, change, reset, save };
};
