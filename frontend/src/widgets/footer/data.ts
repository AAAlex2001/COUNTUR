import { categoryPath } from "@/entities/product";
import { ABOUT_PATH, CONTACTS_PATH, DELIVERY_PATH, RETURNS_URL, SITE_DOCUMENTS } from "@/shared/config/site";
import { ASSEMBLY_HELP_URL, TELEGRAM_SUPPORT_URL } from "@/shared/config/telegram";
import type { FooterColumn } from "./types";

export const FOOTER_DESCRIPTION =
  "Комплектующие для тех, кто знает, из чего складывается производительность.";

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Каталог",
    links: [
      { label: "Процессоры", href: categoryPath("processors") },
      { label: "Видеокарты", href: categoryPath("video-cards") },
      { label: "Материнские платы", href: categoryPath("motherboards") },
      { label: "Накопители", href: categoryPath("storage") },
    ],
  },
  {
    title: "Покупателям",
    links: [
      { label: "Доставка и оплата", href: DELIVERY_PATH },
      { label: "Гарантия", href: TELEGRAM_SUPPORT_URL, newTab: true },
      { label: "Возврат", href: RETURNS_URL, newTab: true },
      { label: "Помощь в сборке", href: ASSEMBLY_HELP_URL, newTab: true },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О Countur", href: ABOUT_PATH },
      { label: "Контакты", href: CONTACTS_PATH },
      ...SITE_DOCUMENTS,
    ],
  },
];
