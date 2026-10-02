"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon, LogOutIcon } from "@/shared/ui/icons";
import { ADMIN_NAV } from "../../data";
import styles from "./style.module.scss";

type AdminNavProps = {
  onExit: () => void;
  onNavigate?: () => void;
};

/** Меню админки: разделы, возврат в магазин и выход. Открытый раздел подсвечен. */
const AdminNav = ({ onExit, onNavigate }: AdminNavProps) => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Разделы админки">
      <ul className={styles.items}>
        {ADMIN_NAV.map(({ href, label, Icon }) => (
          <li key={href}>
            <Link
              className={cn(styles.item, pathname.startsWith(href) && styles.active)}
              href={href}
              onClick={onNavigate}
            >
              <Icon className={styles.icon} />
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <hr className={styles.divider} />

      <Link className={styles.action} href="/">
        <ArrowRightIcon className={styles.back} />
        Вернуться в магазин
      </Link>

      <button type="button" className={styles.action} onClick={onExit}>
        <LogOutIcon className={styles.exit} />
        Выйти
      </button>
    </nav>
  );
};

export default AdminNav;
