"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

/** Ссылка в шапке: при наведении и на текущем разделе подсвечивается голубым с рамкой. */
const NavLink = ({ href, children, className, ariaLabel }: NavLinkProps) => {
  const pathname = usePathname();

  return (
    <Link
      className={cn(styles.link, pathname.startsWith(href) && styles.active, className)}
      href={href}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
};

export default NavLink;
