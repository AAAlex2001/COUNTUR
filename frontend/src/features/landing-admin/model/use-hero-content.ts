"use client";

import { useEffect, useReducer } from "react";
import type { HeroContent } from "@/entities/landing";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { fetchHeroContent, saveHeroContent } from "../api/hero-content";
import { heroContentReducer } from "./hero-content-reducer";

export const useHeroContent = () => {
  const toast = useToast();
  const [state, dispatch] = useReducer(heroContentReducer, {
    fields: null,
    error: "",
    pending: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    fetchHeroContent(controller.signal)
      .then((fields) => dispatch({ type: "load/finish", fields }))
      .catch((failure) => {
        if (controller.signal.aborted) return;
        const error = errorMessage(failure, "Не удалось загрузить тексты первого экрана");
        dispatch({ type: "load/error", error });
      });

    return () => controller.abort();
  }, []);

  const change = (fields: HeroContent) => dispatch({ type: "fields/change", fields });

  const save = async () => {
    if (!state.fields || state.pending) return;
    dispatch({ type: "save/start" });

    try {
      const fields = await saveHeroContent(state.fields);
      dispatch({ type: "save/success", fields });
      toast("Первый экран сохранён");
    } catch (failure) {
      dispatch({ type: "save/error" });
      toast(errorMessage(failure, "Не удалось сохранить первый экран"), "error");
    }
  };

  return { state, change, save };
};
