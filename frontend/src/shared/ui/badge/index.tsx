import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type BadgeProps = {
  children: ReactNode;
  tone?: "accent" | "sale";
  className?: string;
};

/** Метка на товаре: «Хит» или размер скидки. */
const Badge = ({ children, tone = "accent", className }: BadgeProps) => (
  <span className={cn(styles.badge, styles[tone], className)}>{children}</span>
);

export default Badge;
