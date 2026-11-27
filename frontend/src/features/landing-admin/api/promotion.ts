import type { Promotion } from "@/entities/landing";
import { adminRequest, jsonBody } from "@/shared/api";
import type { PromotionFields } from "../model/types";

/** Загрузить акцию для редактора. */
export const fetchPromotion = (signal: AbortSignal) =>
  adminRequest<Promotion>("/landing/promotion", { signal });

/** Сохранить настройки акции. */
export function savePromotion(promotion: PromotionFields) {
  const fields: PromotionFields = {
    label: promotion.label,
    title: promotion.title,
    text: promotion.text,
    button_label: promotion.button_label,
    button_url: promotion.button_url,
    is_visible: promotion.is_visible,
  };

  return adminRequest<Promotion>("/landing/promotion", jsonBody("PUT", fields));
}

/** Заменить картинку рекламного блока. */
export const uploadPromotionImage = (file: File) => {
  const body = new FormData();

  body.append("file", file);

  return adminRequest<Promotion>("/landing/promotion/image", { method: "PUT", body });
};
