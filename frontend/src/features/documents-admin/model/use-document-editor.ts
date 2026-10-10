"use client";

import { useEffect, useReducer } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { fetchDocument, updateDocument } from "../api/documents";
import { editorReducer } from "./reducers";
import type { DocumentFields } from "./types";

/** Редактирование документа: загрузка, поля и сохранение новой редакции. */
export const useDocumentEditor = (slug: string) => {
  const toast = useToast();
  const [state, dispatch] = useReducer(editorReducer, {
    status: "loading",
    document: null,
    fields: { title: "", description: "", content: "" },
    pending: false,
  });

  useEffect(() => {
    fetchDocument(slug)
      .then((document) => dispatch({ type: "load/success", document }))
      .catch(() => dispatch({ type: "load/error" }));
  }, [slug]);

  const change = (changes: Partial<DocumentFields>) =>
    dispatch({ type: "fields/change", changes });

  const save = async () => {
    if (state.fields.title.trim().length < 2) {
      toast("Укажите название документа", "error");

      return;
    }

    dispatch({ type: "save/start" });

    try {
      dispatch({ type: "save/success", document: await updateDocument(slug, state.fields) });
      toast("Документ сохранён");
    } catch (failure) {
      dispatch({ type: "save/error" });
      toast(errorMessage(failure, "Не удалось сохранить документ"), "error");
    }
  };

  return { state, change, save };
};
