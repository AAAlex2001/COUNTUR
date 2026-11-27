import cn from "classnames";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./style.module.scss";

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "size" | "onChange" | "prefix"> & {
  size?: "lg" | "md" | "sm";
  onChange?: (value: string) => void;
  ariaLabel?: string;
  icon?: ReactNode;
  prefix?: string;
  suffix?: ReactNode;
};

/** Поле ввода с подписью. */
export default function Input({
  size = "md",
  type = "text",
  icon,
  prefix,
  suffix,
  className,
  ariaLabel,
  onChange,
  ...inputProps
}: InputProps) {
  return (
    <label className={cn(styles.field, size === "lg" && styles.large, size === "sm" && styles.small, className)}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {prefix && <span className={styles.prefix}>{prefix}</span>}

      <input
        {...inputProps}
        type={type}
        className={styles.input}
        aria-label={ariaLabel ?? inputProps["aria-label"]}
        onChange={onChange && ((event) => onChange(event.target.value))}
      />

      {suffix}
    </label>
  );
}
