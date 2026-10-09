import { categoryPath } from "@/entities/product";

import { CONTACTS_PATH, SITE_DOCUMENTS } from "@/shared/config/site";

export { SUPPORT_EMAIL } from "@/shared/config/site";

export type FooterLink = {
  label: string;
  href: string;
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
      { label: "Доставка и оплата", href: "/delivery" },
      { label: "Гарантия", href: "/warranty" },
      { label: "Возврат", href: "/returns" },
      { label: "Помощь в сборке", href: "/build-help" },
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
