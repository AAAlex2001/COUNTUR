import { MapPinIcon, PackageIcon, SettingsIcon, UserIcon } from "@/shared/ui/icons";

export const ACCOUNT_SECTIONS = [
  { id: "profile", label: "Мой профиль", Icon: UserIcon },
  { id: "orders", label: "Мои заказы", Icon: PackageIcon },
  { id: "address", label: "Адрес доставки", Icon: MapPinIcon },
  { id: "settings", label: "Настройки аккаунта", Icon: SettingsIcon },
];

export const SUPPORT_PATH = "/contacts";
