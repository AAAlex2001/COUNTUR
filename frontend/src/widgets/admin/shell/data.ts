import {
  ADMIN_COLLECTIONS_PATH,
  ADMIN_DOCUMENTS_PATH,
  ADMIN_FEEDBACK_PATH,
  ADMIN_LANDING_PATH,
  ADMIN_PRODUCTS_PATH,
  ADMIN_USERS_PATH,
} from "@/shared/lib/admin-paths";
import {
  FileTextIcon,
  HomeIcon,
  LayersIcon,
  MailIcon,
  PackageIcon,
  UsersIcon,
} from "@/shared/ui/icons";

export const ADMIN_NAV = [
  { href: ADMIN_PRODUCTS_PATH, label: "Товары", Icon: PackageIcon },
  { href: ADMIN_COLLECTIONS_PATH, label: "Подборки", Icon: LayersIcon },
  { href: ADMIN_USERS_PATH, label: "Покупатели", Icon: UsersIcon },
  { href: ADMIN_FEEDBACK_PATH, label: "Обращения", Icon: MailIcon },
  { href: ADMIN_LANDING_PATH, label: "Главная страница", Icon: HomeIcon },
  { href: ADMIN_DOCUMENTS_PATH, label: "Документы", Icon: FileTextIcon },
];
