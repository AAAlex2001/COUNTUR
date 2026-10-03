"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCOUNT_PATH, useUser } from "@/entities/user";
import { UserIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

type AccountButtonProps = {
  className?: string;
};

/** Иконка аккаунта в шапке: без входа открывает окно входа, после входа ведёт в личный кабинет. */
const AccountButton = ({ className }: AccountButtonProps) => {
  const { user, openAuth } = useUser();
  const pathname = usePathname();

  if (user) {
    return (
      <Link
        className={cn(styles.button, pathname.startsWith(ACCOUNT_PATH) && styles.active, className)}
        href={ACCOUNT_PATH}
        aria-label="Личный кабинет"
      >
        <UserIcon className={styles.icon} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(styles.button, className)}
      aria-label="Войти"
      onClick={openAuth}
    >
      <UserIcon className={styles.icon} />
    </button>
  );
};

export default AccountButton;
