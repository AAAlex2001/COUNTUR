"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { customerNumber, useUser } from "@/entities/user";
import { LoginPrompt } from "@/features/auth";
import { OrdersProvider } from "@/features/orders-history";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import { ACCOUNT_SECTIONS } from "./data";
import Sidebar from "./ui/sidebar";
import styles from "./style.module.scss";

export { default as AccountSection } from "./ui/section";

type AccountProps = {
  children: ReactNode;
};

/** Оболочка кабинета: шапка с названием раздела, колонка слева и содержимое раздела. */
const Account = ({ children }: AccountProps) => {
  const { user } = useUser();
  const pathname = usePathname();
  const section = ACCOUNT_SECTIONS.find((item) => item.href === pathname) ?? ACCOUNT_SECTIONS[0];

  return (
    <section className={styles.account}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Личный кабинет", href: ACCOUNT_SECTIONS[0].href },
          { label: section.label },
        ]}
      />

      <div className={styles.header}>
        <div className={styles.titles}>
          <p className={styles.eyebrow}>Личный кабинет</p>
          <h1 className={styles.title}>{section.title}</h1>
        </div>

        {user && <p className={styles.customer}>ID: {customerNumber(user)}</p>}
      </div>

      <hr className={styles.divider} />

      {!user && (
        <LoginPrompt
          title="Личный кабинет доступен после входа"
          text="Здесь будут ваши данные, адрес доставки и история заказов."
        />
      )}

      {user && (
        <OrdersProvider>
          <div className={styles.columns}>
            <Sidebar user={user} />
            <div className={styles.content}>{children}</div>
          </div>
        </OrdersProvider>
      )}
    </section>
  );
};

export default Account;
