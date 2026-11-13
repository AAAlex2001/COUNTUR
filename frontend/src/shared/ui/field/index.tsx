import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type FieldProps = {
  label?: string;
  children: ReactNode;
  hint?: string;
  error?: string;
  wide?: boolean;
  plain?: boolean;
};

/**
 * Подпись над полем формы и подсказка под ним. С error рамка поля красная, а вместо подсказки — ошибка.
 * wide — на всю ширину сетки, plain — обычная подпись вместо моноширинной заглавной.
 */
const Field = ({ label, children, hint, error, wide, plain }: FieldProps) => (
  <div
    className={cn(styles.field, wide && styles.wide, plain && styles.plain, error && styles.invalid)}
  >
    {label && <span className={styles.label}>{label}</span>}
    {children}
    {error ? (
      <span className={styles.error}>{error}</span>
    ) : (
      hint && <span className={styles.hint}>{hint}</span>
    )}
  </div>
);

export default Field;
