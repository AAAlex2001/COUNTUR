import type { HeroTextField } from "./types";

export const HERO_TEXT_FIELDS: HeroTextField[] = [
  { name: "overline", label: "Надзаголовок", maxLength: 100 },
  { name: "title", label: "Заголовок", maxLength: 150 },
  { name: "description", label: "Подзаголовок", maxLength: 500, type: "textarea" },
  { name: "catalog_button_label", label: "Текст кнопки каталога", maxLength: 60 },
  { name: "support_button_label", label: "Текст кнопки помощи в сборке", maxLength: 60 },
  { name: "image_alt", label: "Альтернативный текст картинки", maxLength: 150 },
  { name: "image_badge", label: "Подпись на картинке", maxLength: 60 },
];
