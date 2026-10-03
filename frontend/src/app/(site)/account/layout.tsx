import type { Metadata } from "next";
import Account from "@/widgets/account";

export const metadata: Metadata = {
  title: "Личный кабинет",
};

/** Общая оболочка разделов кабинета: шапка, колонка слева, заказы грузятся один раз. */
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Account>{children}</Account>
    </main>
  );
}
