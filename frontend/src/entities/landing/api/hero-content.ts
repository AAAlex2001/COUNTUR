import { load } from "@/shared/api/server";
import type { HeroContent } from "../model/types";

const DEFAULT_HERO_CONTENT: HeroContent = {
  is_visible: true,
  overline: "Комплектующие / Сборка / Поддержка",
  title: "Соберите ПК мечты сегодня",
  description:
    "Более 5 000 комплектующих от ведущих производителей. Гарантия, быстрая доставка, помощь в сборке.",
  catalog_button_label: "Перейти в каталог",
  support_button_label: "Помощь в сборке",
  image_alt: "Игровой компьютер с подсветкой",
  image_badge: "Сборка готова к игре",
  statistics: [
    { value: "5 000+", label: "Товаров" },
    { value: "3 года", label: "Гарантия" },
    { value: "24 часа", label: "Доставка" },
  ],
};

export const getHeroContent = () => load("/v1/landing/hero/content", DEFAULT_HERO_CONTENT);
