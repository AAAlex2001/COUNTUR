import { ACCOUNT_PATH } from "@/entities/user";
import { MapPinIcon, PackageIcon, SettingsIcon, UserIcon } from "@/shared/ui/icons";

export const ACCOUNT_SECTIONS = [
  {
    id: "profile",
    href: ACCOUNT_PATH,
    label: "Мой профиль",
    title: "Профиль пользователя",
    Icon: UserIcon,
  },
  {
    id: "orders",
    href: `${ACCOUNT_PATH}/orders`,
    label: "Мои заказы",
    title: "Мои заказы",
    Icon: PackageIcon,
  },
  {
    id: "address",
    href: `${ACCOUNT_PATH}/address`,
    label: "Адрес доставки",
    title: "Адрес доставки",
    Icon: MapPinIcon,
  },
  {
    id: "settings",
    href: `${ACCOUNT_PATH}/settings`,
    label: "Настройки аккаунта",
    title: "Настройки аккаунта",
    Icon: SettingsIcon,
  },
] as const;

export type AccountSectionId = (typeof ACCOUNT_SECTIONS)[number]["id"];

export const SUPPORT_PATH = "/contacts";
