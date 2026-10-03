import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type BadgeProps = {
  children: ReactNode;
  tone?: "accent" | "sale" | "soft";
  className?: string;
};

/** Метка: «Хит», размер скидки или тихий статус (soft — голубой текст на тёмной подложке). */
const Badge = ({ children, tone = "accent", className }: BadgeProps) => (
  <span className={cn(styles.badge, styles[tone], className)}>{children}</span>
);

export default Badge;
