import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type IconButtonProps = {
  children: ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "accent" | "muted" | "danger" | "outline";
  size?: "lg" | "md" | "sm";
  pressed?: boolean;
  title?: string;
  className?: string;
};

/** Квадратная кнопка с одной иконкой внутри. */
const IconButton = ({
  children,
  ariaLabel,
  onClick,
  disabled,
  tone = "accent",
  size = "md",
  pressed,
  title,
  className,
}: IconButtonProps) => (
  <button
    type="button"
    className={cn(styles.button, styles[tone], styles[size], className)}
    aria-label={ariaLabel}
    aria-pressed={pressed}
    title={title}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export default IconButton;
