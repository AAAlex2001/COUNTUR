import { categoryPath } from "@/entities/product";

import { CONTACTS_PATH, SITE_DOCUMENTS } from "@/shared/config/site";
import { TELEGRAM_SUPPORT_URL } from "@/shared/config/telegram";

export type FooterLink = {
  label: string;
  href: string;
  newTab?: boolean;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

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
      { label: "Доставка и оплата", href: TELEGRAM_SUPPORT_URL, newTab: true },
      { label: "Гарантия", href: TELEGRAM_SUPPORT_URL, newTab: true },
      { label: "Возврат", href: TELEGRAM_SUPPORT_URL, newTab: true },
      { label: "Помощь в сборке", href: TELEGRAM_SUPPORT_URL, newTab: true },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О Countur", href: "/about" },
      { label: "Контакты", href: CONTACTS_PATH },
      ...SITE_DOCUMENTS,
      { label: "Панель управления", href: "/admin" },
    ],
  },
];
