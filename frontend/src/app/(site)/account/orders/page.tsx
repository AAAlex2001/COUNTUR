import type { Metadata } from "next";
import { AccountSection } from "@/widgets/account";

export const metadata: Metadata = {
  title: "Мои заказы",
};

/** История заказов покупателя. */
export default function AccountOrdersRoute() {
  return <AccountSection section="orders" />;
}
