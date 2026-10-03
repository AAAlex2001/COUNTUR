import type { Metadata } from "next";
import Account from "@/widgets/account";

export const metadata: Metadata = {
  title: "Личный кабинет",
};

export default function AccountRoute() {
  return (
    <main>
      <Account />
    </main>
  );
}
