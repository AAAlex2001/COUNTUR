"use client";

import { useReducer } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { createAttribute } from "../api/products";
import { attributeReducer } from "./reducers";
import type { AdminCategory, AttributePayload } from "./types";

/** Новый параметр характеристик категории: группа, название и сохранение. */
export const useAttributeForm = (
  category: AdminCategory,
  onSaved: (category: AdminCategory) => void,
) => {
  const toast = useToast();
  const [state, dispatch] = useReducer(attributeReducer, {
    fields: { group: "Общие", name: "" },
    pending: false,
  });

  const change = (changes: Partial<AttributePayload>) =>
    dispatch({ type: "fields/change", changes });

  /** Добавить параметр в категорию, название очистить для следующего. */
  const save = async () => {
    const group = state.fields.group.trim();
    const name = state.fields.name.trim();

    if (!group || !name) return;

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

  return { state, change, save };
};
