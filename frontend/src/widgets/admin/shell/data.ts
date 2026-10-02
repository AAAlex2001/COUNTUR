import { ADMIN_LANDING_PATH, ADMIN_PRODUCTS_PATH } from "@/shared/lib/admin-paths";
import { HomeIcon, PackageIcon } from "@/shared/ui/icons";

export const ADMIN_NAV = [
  { href: ADMIN_PRODUCTS_PATH, label: "Товары", Icon: PackageIcon },
  { href: ADMIN_LANDING_PATH, label: "Главная страница", Icon: HomeIcon },
];
