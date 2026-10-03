import { ADMIN_LANDING_PATH, ADMIN_PRODUCTS_PATH, ADMIN_USERS_PATH } from "@/shared/lib/admin-paths";
import { HomeIcon, PackageIcon, UsersIcon } from "@/shared/ui/icons";

export const ADMIN_NAV = [
  { href: ADMIN_PRODUCTS_PATH, label: "Товары", Icon: PackageIcon },
  { href: ADMIN_USERS_PATH, label: "Покупатели", Icon: UsersIcon },
  { href: ADMIN_LANDING_PATH, label: "Главная страница", Icon: HomeIcon },
];
