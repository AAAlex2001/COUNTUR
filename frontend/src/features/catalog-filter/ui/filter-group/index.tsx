import type { ReactNode } from "react";
import styles from "./style.module.scss";

type FilterGroupProps = {
  title?: string;
  children: ReactNode;
};

/** Блок панели фильтров с необязательным заголовком. */
const FilterGroup = ({ title, children }: FilterGroupProps) => (
  <div className={styles.group} role="group" aria-label={title}>
    {title && <p className={styles.title}>{title}</p>}
    {children}
  </div>
);

export default FilterGroup;
