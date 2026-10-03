"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ACCOUNT_PATH, useUser } from "@/entities/user";
import Drawer from "@/shared/ui/drawer";
import IconButton from "@/shared/ui/icon-button";
import { HeartIcon, MenuIcon, UserIcon } from "@/shared/ui/icons";
import { HEADER_NAV } from "../../data";
import styles from "./style.module.scss";

type HeaderMenuProps = {
  className?: string;
};

/** Бургер-меню шапки на узком экране: разделы сайта, кабинет и избранное в шторке сверху. */
const HeaderMenu = ({ className }: HeaderMenuProps) => {
  const pathname = usePathname();
  const { user, openAuth } = useUser();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const login = () => {
    close();
    openAuth();
  };

  return (
    <>
      <IconButton
        className={className}
        tone="outline"
        ariaLabel="Открыть меню"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </IconButton>

      <Drawer open={open} title="Меню" onClose={close}>
        <nav className={styles.nav} aria-label="Меню сайта">
          {HEADER_NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              className={cn(styles.item, pathname.startsWith(href) && styles.active)}
              href={href}
              onClick={close}
            >
              <Icon className={styles.icon} />
              {label}
            </Link>
          ))}

          <hr className={styles.divider} />

          {user ? (
            <Link
              className={cn(styles.item, pathname.startsWith(ACCOUNT_PATH) && styles.active)}
              href={ACCOUNT_PATH}
              onClick={close}
            >
              <UserIcon className={styles.icon} />
              Личный кабинет
            </Link>
          ) : (
            <button type="button" className={styles.item} onClick={login}>
              <UserIcon className={styles.icon} />
              Войти
            </button>
          )}

          <Link
            className={cn(styles.item, pathname.startsWith("/favorites") && styles.active)}
            href="/favorites"
            onClick={close}
          >
            <HeartIcon className={styles.icon} />
            Избранное
          </Link>
        </nav>
      </Drawer>
    </>
  );
};

export default HeaderMenu;
