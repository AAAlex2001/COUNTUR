"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { fullName, initials, type User } from "@/entities/user";
import { LogoutButton } from "@/features/auth";
import { useOrders } from "@/features/orders-history";
import { formatMonth } from "@/shared/lib/date";
import Button from "@/shared/ui/button";
import { ArrowRightIcon, MenuIcon } from "@/shared/ui/icons";
import Modal from "@/shared/ui/modal";
import { ACCOUNT_SECTIONS, SUPPORT_PATH } from "../../data";
import styles from "./style.module.scss";

type SidebarProps = {
  user: User;
};

/** Колонка кабинета: карточка покупателя и разделы. На узком экране разделы открываются в окне. */
const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();
  const { orders } = useOrders();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const nav = (
    <nav className={styles.nav} aria-label="Разделы кабинета">
      {ACCOUNT_SECTIONS.map(({ id, href, label, Icon }) => (
        <Link
          key={id}
          className={cn(styles.item, href === pathname && styles.active)}
          href={href}
          onClick={closeMenu}
        >
          <Icon className={styles.icon} />
          <span className={styles.label}>{label}</span>
          {id === "orders" && orders.length > 0 && (
            <span className={styles.count}>{orders.length}</span>
          )}
        </Link>
      ))}

      <LogoutButton />
    </nav>
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.card}>
        <span className={styles.avatar} aria-hidden="true">
          {initials(user)}
        </span>

        <div className={styles.person}>
          <p className={styles.name}>{fullName(user)}</p>
          <p className={styles.since}>С нами с {formatMonth(user.created_at)}</p>
        </div>

        <hr className={styles.divider} />

        <div className={styles.stat}>
          <span className={styles.statLabel}>Всего заказов</span>
          <span className={styles.statValue}>{String(orders.length).padStart(2, "0")}</span>
        </div>
      </div>

      <Button className={styles.menuButton} variant="outline" onClick={() => setMenuOpen(true)}>
        <MenuIcon />
        Разделы кабинета
      </Button>

      <Modal open={menuOpen} title="Разделы" onClose={closeMenu}>
        {menuOpen && nav}
      </Modal>

      <div className={styles.desktop}>
        {nav}

        <div className={styles.help}>
          <p className={styles.helpTitle}>Нужна помощь?</p>
          <p className={styles.helpText}>Поможем с заказом, доставкой или гарантией.</p>
          <Button variant="ghost" size="sm" href={SUPPORT_PATH}>
            Написать в поддержку
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
