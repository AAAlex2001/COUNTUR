"use client";

import { useReducer } from "react";
import type { User } from "@/entities/user";
import { useToast } from "@/shared/ui/toaster";
import { checkoutReducer } from "./reducer";
import type { ContactFields } from "./types";
import { validateContacts } from "./validate";

/** Оформление заказа: текущий шаг, контакты (имя и email подставляются из аккаунта) и шаги. */
export const useCheckout = (user: User) => {
  const toast = useToast();
  const [state, dispatch] = useReducer(checkoutReducer, {
    step: 0,
    contacts: { firstName: user.name, lastName: "", phone: "", email: user.email, city: "" },
    consent: false,
  });

  const changeContacts = (changes: Partial<ContactFields>) =>
    dispatch({ type: "contacts/change", changes });

  const changeConsent = (value: boolean) => dispatch({ type: "consent/change", value });

  /** Проверить контакты и перейти к доставке. Ошибка показывается уведомлением. */
  const submitContacts = () => {
    const error = validateContacts(state.contacts, state.consent);

    if (error) {
      toast(error, "error");
    } else {
      dispatch({ type: "step/open", step: 1 });
    }
  };

  const openStep = (step: number) => dispatch({ type: "step/open", step });

  return { state, changeContacts, changeConsent, submitContacts, openStep };
};
