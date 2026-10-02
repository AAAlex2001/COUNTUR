"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAdminSession } from "@/features/admin-auth";
import { ADMIN_PRODUCTS_PATH } from "@/shared/lib/admin-paths";
import Button from "@/shared/ui/button";
import Loader from "@/shared/ui/loader";
import Logo from "@/shared/ui/logo";
import styles from "./style.module.scss";

type AdminShellProps = {
  children: ReactNode;
};

/** Оболочка админки: пускает только после входа и рисует шапку с навигацией. */
const AdminShell = ({ children }: AdminShellProps) => {
  const { state, exit } = useAdminSession();

  if (!state.ready) {
    return <Loader size="lg" />;
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Logo href={ADMIN_PRODUCTS_PATH} ariaLabel="COUNTUR — админка" />

          <nav className={styles.nav} aria-label="Разделы админки">
            <Link className={styles.link} href={ADMIN_PRODUCTS_PATH}>
              Товары
            </Link>
            <Link className={styles.link} href="/">
              На сайт
            </Link>
          </nav>

          <Button variant="outline" onClick={exit}>
            Выйти
          </Button>
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </>
  );
};

export default AdminShell;
