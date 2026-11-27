import { COLLECTIONS_PATH } from "@/entities/collection";
import { CATALOG_PATH } from "@/entities/product";
import { CONTACTS_PATH, DELIVERY_PATH } from "@/shared/config/site";
import { GridIcon, HeadphonesIcon, LayersIcon, TruckIcon } from "@/shared/ui/icons";
import type { HeaderNavItem } from "./types";

export const ANNOUNCEMENT = "БЕСПЛАТНАЯ ДОСТАВКА ОТ 50 000 ₽ · ГАРАНТИЯ НА ВСЕ КОМПЛЕКТУЮЩИЕ";

export const HEADER_NAV: HeaderNavItem[] = [
  { label: "Каталог", href: CATALOG_PATH, Icon: GridIcon },
  { label: "Готовые подборки", href: COLLECTIONS_PATH, Icon: LayersIcon },
  { label: "Доставка", href: DELIVERY_PATH, Icon: TruckIcon, newTab: true },
  { label: "Контакты", href: CONTACTS_PATH, Icon: HeadphonesIcon },
];
