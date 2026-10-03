import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type FieldProps = {
  label: string;
  children: ReactNode;
  hint?: string;
  wide?: boolean;
  plain?: boolean;
};

/**
 * Подпись над полем формы и необязательная подсказка под ним.
 * wide — на всю ширину сетки, plain — обычная подпись вместо моноширинной заглавной.
 */
const Field = ({ label, children, hint, wide, plain }: FieldProps) => (
  <div className={cn(styles.field, wide && styles.wide, plain && styles.plain)}>
    <span className={styles.label}>{label}</span>
    {children}
    {hint && <span className={styles.hint}>{hint}</span>}
  </div>
);

export default Field;
