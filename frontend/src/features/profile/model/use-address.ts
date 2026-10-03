"use client";

import { useReducer } from "react";
import { updateProfile, useUser, type User } from "@/entities/user";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { addressReducer } from "./reducers";

/** Адрес доставки в аккаунте: показ, правка на месте и сохранение. */
export const useAddress = (user: User) => {
  const { setUser } = useUser();
  const toast = useToast();
  const [state, dispatch] = useReducer(addressReducer, {
    editing: false,
    draft: "",
    pending: false,
  });

  const openEdit = () => dispatch({ type: "edit/open", draft: user.address ?? "" });
  const closeEdit = () => dispatch({ type: "edit/close" });
  const changeDraft = (value: string) => dispatch({ type: "draft/change", value });

  const save = async () => {
    dispatch({ type: "save/start" });

    try {
      setUser(await updateProfile({ address: state.draft.trim() || null }));
      dispatch({ type: "edit/close" });
      toast("Адрес сохранён");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить адрес"), "error");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  return { state, openEdit, closeEdit, changeDraft, save };
};
