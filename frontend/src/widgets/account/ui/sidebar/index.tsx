"use client";

import cn from "classnames";
import Link from "next/link";
import { useState } from "react";
import { fullName, initials, type User } from "@/entities/user";
import { LogoutButton } from "@/features/auth";
import { formatMonth } from "@/shared/lib/date";
import Button from "@/shared/ui/button";
import { ArrowRightIcon, MenuIcon } from "@/shared/ui/icons";
import Modal from "@/shared/ui/modal";
import { ACCOUNT_SECTIONS, SUPPORT_PATH } from "../../data";
import styles from "./style.module.scss";

type SidebarProps = {
  user: User;
  ordersCount: number;
};

/** Колонка кабинета: карточка покупателя и разделы. На узком экране разделы открываются в окне. */
const Sidebar = ({ user, ordersCount }: SidebarProps) => {
  const [active, setActive] = useState(ACCOUNT_SECTIONS[0].id);
  const [menuOpen, setMenuOpen] = useState(false);

  const openSection = (id: string) => {
    setActive(id);
    setMenuOpen(false);
  };

  const nav = (
    <nav className={styles.nav} aria-label="Разделы кабинета">
      {ACCOUNT_SECTIONS.map(({ id, label, Icon }) => (
        <Link
          key={id}
          className={cn(styles.item, id === active && styles.active)}
          href={`#${id}`}
          onClick={() => openSection(id)}
        >
          <Icon className={styles.icon} />
          <span className={styles.label}>{label}</span>
          {id === "orders" && ordersCount > 0 && <span className={styles.count}>{ordersCount}</span>}
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
          <span className={styles.statValue}>{String(ordersCount).padStart(2, "0")}</span>
        </div>
      </div>

      <Button className={styles.menuButton} variant="outline" onClick={() => setMenuOpen(true)}>
        <MenuIcon />
        Разделы кабинета
      </Button>

      <Modal open={menuOpen} title="Разделы" onClose={() => setMenuOpen(false)}>
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
