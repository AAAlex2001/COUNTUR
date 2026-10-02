"use client";

import { useEffect, useReducer } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { fetchHero, uploadHeroImage } from "../api/hero";
import { heroImageReducer } from "./reducer";

/** Картинка первого экрана главной: текущая и загрузка новой. */
export const useHeroImage = () => {
  const toast = useToast();
  const [state, dispatch] = useReducer(heroImageReducer, {
    imageUrl: null,
    loaded: false,
    pending: false,
  });

  useEffect(() => {
    fetchHero()
      .then((hero) => hero.image_url)
      .catch(() => null)
      .then((imageUrl) => dispatch({ type: "load/finish", imageUrl }));
  }, []);

  /** Загрузить первую из выбранных картинок вместо текущей. */
  const upload = async (files: File[]) => {
    dispatch({ type: "upload/start" });

    try {
      const hero = await uploadHeroImage(files[0]);

      dispatch({ type: "upload/success", imageUrl: hero.image_url });
      toast("Картинка обновлена");
    } catch (failure) {
      dispatch({ type: "upload/error" });
      toast(errorMessage(failure, "Не удалось загрузить картинку"), "error");
    }
  };

  return { state, upload };
};
