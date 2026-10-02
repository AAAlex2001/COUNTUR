import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type InputProps = {
  type?: "text" | "search" | "tel" | "email";
  size?: "md" | "sm";
  name?: string;
  placeholder?: string;
  ariaLabel?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "tel" | "email" | "search";
  autoComplete?: string;
  icon?: ReactNode;
  prefix?: string;
  className?: string;
};

/** Поле ввода. Слева может стоять иконка или короткая подпись. */
const Input = ({
  type = "text",
  size = "md",
  name,
  placeholder,
  ariaLabel,
  value,
  onChange,
  onBlur,
  maxLength,
  inputMode,
  autoComplete,
  icon,
  prefix,
  className,
}: InputProps) => (
  <label className={cn(styles.field, size === "sm" && styles.small, className)}>
    {icon && <span className={styles.icon}>{icon}</span>}
    {prefix && <span className={styles.prefix}>{prefix}</span>}

    <input
      className={styles.input}
      type={type}
      name={name}
      placeholder={placeholder}
      aria-label={ariaLabel}
      value={value}
      maxLength={maxLength}
      inputMode={inputMode}
      autoComplete={autoComplete}
      onChange={onChange && ((event) => onChange(event.target.value))}
      onBlur={onBlur}
    />
  </label>
);

export default Input;
