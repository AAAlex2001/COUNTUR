import cn from "classnames";
import { AVAILABILITY_LABELS } from "../../lib/availability";
import type { Availability } from "../../model/types";
import styles from "./style.module.scss";

type StockStatusProps = {
  availability: Availability;
  size?: "md" | "sm";
};

/** Цветная подпись наличия: «В наличии», «Нет в наличии» или «Ожидается». */
const StockStatus = ({ availability, size = "md" }: StockStatusProps) => (
  <span className={cn(styles.status, styles[availability], size === "sm" && styles.small)}>
    {size === "md" && <span className={styles.dot} aria-hidden="true" />}
    {AVAILABILITY_LABELS[availability]}
  </span>
);

export default StockStatus;
