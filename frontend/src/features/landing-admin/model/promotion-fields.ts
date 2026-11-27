import type { PromotionFields } from "./types";

type PromotionTextField = {
  name: keyof Omit<PromotionFields, "is_visible">;
  label: string;
  maxLength: number;
  hint?: string;
  type?: "textarea";
};

export const PROMOTION_TEXT_FIELDS: PromotionTextField[] = [
  { name: "label", label: "Надстрочник", maxLength: 100, hint: "Например: «Только до 15 октября»" },
  { name: "title", label: "Заголовок", maxLength: 150 },
  { name: "text", label: "Описание", maxLength: 300, type: "textarea" },
  { name: "button_label", label: "Надпись на кнопке", maxLength: 60 },
  { name: "button_url", label: "Ссылка кнопки", maxLength: 255, hint: "Например: /catalog?category=video-cards" },
];
