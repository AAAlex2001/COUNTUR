import type { Metadata } from "next";
import { AccountSection } from "@/widgets/account";

export const metadata: Metadata = {
  title: "Адрес доставки",
};

/** Адрес доставки покупателя. */
export default function AccountAddressRoute() {
  return <AccountSection section="address" />;
}
