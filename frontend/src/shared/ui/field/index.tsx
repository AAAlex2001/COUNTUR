import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type FieldProps = {
  label: string;
  children: ReactNode;
  hint?: string;
  wide?: boolean;
};

/** Подпись над полем формы и необязательная подсказка под ним. wide — на всю ширину сетки. */
const Field = ({ label, children, hint, wide }: FieldProps) => (
  <div className={cn(styles.field, wide && styles.wide)}>
    <span className={styles.label}>{label}</span>
    {children}
    {hint && <span className={styles.hint}>{hint}</span>}
  </div>
);

export default Field;
