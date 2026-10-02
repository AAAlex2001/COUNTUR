export type HeaderNavItem = {
  label: string;
  href: string;
};

export const ANNOUNCEMENT = "БЕСПЛАТНАЯ ДОСТАВКА ОТ 50 000 ₽ · ГАРАНТИЯ НА ВСЕ КОМПЛЕКТУЮЩИЕ";

export const HEADER_NAV: HeaderNavItem[] = [
  { label: "Каталог", href: "/catalog" },
  { label: "Готовые подборки", href: "/collections" },
  { label: "Доставка", href: "/delivery" },
  { label: "Контакты", href: "/contacts" },
];
