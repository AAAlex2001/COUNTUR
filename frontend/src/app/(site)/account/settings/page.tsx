import type { Metadata } from "next";
import { AccountSection } from "@/widgets/account";

export const metadata: Metadata = {
  title: "Настройки аккаунта",
};

/** Пароль и уведомления покупателя. */
export default function AccountSettingsRoute() {
  return <AccountSection section="settings" />;
}
