import type { ComponentType } from "react";
import { CONTACTS_PATH } from "@/shared/config/site";
import { TELEGRAM_SUPPORT_URL } from "@/shared/config/telegram";
import { GridIcon, HeadphonesIcon, LayersIcon, TruckIcon } from "@/shared/ui/icons";
import type { IconProps } from "@/shared/ui/icons/types";

export const ANNOUNCEMENT = "БЕСПЛАТНАЯ ДОСТАВКА ОТ 50 000 ₽ · ГАРАНТИЯ НА ВСЕ КОМПЛЕКТУЮЩИЕ";

type HeaderNavItem = {
  label: string;
  href: string;
  Icon: ComponentType<IconProps>;
  newTab?: boolean;
};

export const HEADER_NAV: HeaderNavItem[] = [
  { label: "Каталог", href: "/catalog", Icon: GridIcon },
  { label: "Готовые подборки", href: "/collections", Icon: LayersIcon },
  { label: "Доставка", href: TELEGRAM_SUPPORT_URL, Icon: TruckIcon, newTab: true },
  { label: "Контакты", href: CONTACTS_PATH, Icon: HeadphonesIcon },
];
