import type { Promotion } from "@/entities/landing";
import { adminRequest, jsonBody } from "@/shared/api";
import type { PromotionFields } from "../model/types";

/** Рекламный блок для редактирования, даже если он скрыт или ещё не заполнен. */
export const fetchPromotion = () => adminRequest<Promotion>("/landing/promotion");

/** Сохранить тексты, кнопку и видимость рекламного блока. */
export const savePromotion = (fields: PromotionFields) =>
  adminRequest<Promotion>("/landing/promotion", jsonBody("PUT", fields));

/** Заменить картинку рекламного блока. */
export const uploadPromotionImage = (file: File) => {
  const body = new FormData();

  body.append("file", file);

  return adminRequest<Promotion>("/landing/promotion/image", { method: "PUT", body });
};
