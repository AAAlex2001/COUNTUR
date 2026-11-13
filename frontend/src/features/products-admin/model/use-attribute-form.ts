"use client";

import { useReducer } from "react";
import { errorMessage, INVALID_FORM_MESSAGE } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { createAttribute } from "../api/products";
import { attributeReducer } from "./reducers";
import type { AdminCategory, AttributePayload } from "./types";
import { validateAttribute } from "./validate";

/** Новый параметр характеристик категории: группа, название и сохранение. */
export const useAttributeForm = (
  category: AdminCategory,
  onSaved: (category: AdminCategory) => void,
) => {
  const toast = useToast();
  const [state, dispatch] = useReducer(attributeReducer, {
    fields: { group: "Общие", name: "" },
    pending: false,
    showErrors: false,
  });
  const errors = state.showErrors ? validateAttribute(state.fields) : {};

  const change = (changes: Partial<AttributePayload>) =>
    dispatch({ type: "fields/change", changes });

  /** Добавить параметр в категорию, название очистить для следующего. */
  const save = async () => {
    if (Object.keys(validateAttribute(state.fields)).length) {
      dispatch({ type: "errors/show" });
      toast(INVALID_FORM_MESSAGE, "error");
      return;
    }

    const group = state.fields.group.trim();
    const name = state.fields.name.trim();

    dispatch({ type: "save/start" });

    try {
      onSaved(await createAttribute(category.id, { group, name }));
      dispatch({ type: "save/success" });
      toast(`Параметр «${name}» добавлен`);
    } catch (failure) {
      dispatch({ type: "save/error" });
      toast(errorMessage(failure, "Не удалось добавить параметр"), "error");
    }
  };

  return { state, errors, change, save };
};
