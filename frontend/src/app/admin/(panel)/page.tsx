import { redirect } from "next/navigation";
import { ADMIN_PRODUCTS_PATH } from "@/shared/lib/admin-paths";

/** Главная админки ведёт сразу в список товаров. */
export default function AdminRoute() {
  redirect(ADMIN_PRODUCTS_PATH);
}
