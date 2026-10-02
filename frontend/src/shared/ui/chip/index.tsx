import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type ChipProps = {
  children: ReactNode;
  className?: string;
};

/** Плашка с короткой характеристикой товара. */
const Chip = ({ children, className }: ChipProps) => (
  <span className={cn(styles.chip, className)}>{children}</span>
);

export default Chip;
