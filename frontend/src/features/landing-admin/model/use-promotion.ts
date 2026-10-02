"use client";

import { useEffect, useReducer } from "react";
import type { Promotion } from "@/entities/landing";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { fetchPromotion, savePromotion, uploadPromotionImage } from "../api/promotion";
import { promotionReducer } from "./reducer";
import type { PromotionFields } from "./types";

const EMPTY_FIELDS: PromotionFields = {
  label: "",
  title: "",
  text: "",
  button_label: "",
  button_url: "",
  is_visible: false,
};

/** Поля формы из рекламного блока: всё, кроме картинки. */
const toFields = (promotion: Promotion): PromotionFields => ({
  label: promotion.label,
  title: promotion.title,
  text: promotion.text,
  button_label: promotion.button_label,
  button_url: promotion.button_url,
  is_visible: promotion.is_visible,
});

/** Рекламный блок главной в админке: поля, сохранение и замена картинки. */
export const usePromotion = () => {
  const toast = useToast();
  const [state, dispatch] = useReducer(promotionReducer, {
    fields: EMPTY_FIELDS,
    imageUrl: null,
    pending: false,
  });

  useEffect(() => {
    fetchPromotion()
      .then((promotion) =>
        dispatch({
          type: "load/finish",
          fields: toFields(promotion),
          imageUrl: promotion.image_url,
        }),
      )
      .catch(() => undefined);
  }, []);

  const change = (changes: Partial<PromotionFields>) =>
    dispatch({ type: "fields/change", changes });

  const save = async () => {
    dispatch({ type: "request/start" });

    try {
      await savePromotion(state.fields);
      toast(state.fields.is_visible ? "Блок сохранён и показан на главной" : "Блок сохранён");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить блок"), "error");
    } finally {
      dispatch({ type: "request/finish" });
    }
  };

  /** Загрузить первую из выбранных картинок вместо текущей. */
  const uploadImage = async (files: File[]) => {
    dispatch({ type: "request/start" });

    try {
      const promotion = await uploadPromotionImage(files[0]);

      dispatch({ type: "image/change", imageUrl: promotion.image_url });
      toast("Картинка обновлена");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось загрузить картинку"), "error");
    } finally {
      dispatch({ type: "request/finish" });
    }
  };

  return { state, change, save, uploadImage };
};
