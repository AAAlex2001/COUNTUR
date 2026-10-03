import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  count?: number;
  size?: "md" | "lg";
  className?: string;
};

/** Галочка с подписью и необязательным счётчиком справа. Размер lg — для согласий в формах. */
const Checkbox = ({ checked, onChange, children, count, size = "md", className }: CheckboxProps) => (
  <label
    className={cn(
      styles.checkbox,
      checked && styles.checked,
      size === "lg" && styles.large,
      className,
    )}
  >
    <input
      className={styles.input}
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span className={styles.box} aria-hidden="true">
      {checked && "✓"}
    </span>
    <span className={styles.label}>{children}</span>
    {count !== undefined && <span className={styles.count}>{count}</span>}
  </label>
);

export default Checkbox;
