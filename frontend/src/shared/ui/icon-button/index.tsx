import cn from "classnames";
import type { ReactNode } from "react";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

type IconButtonProps = {
  children: ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: "accent" | "muted" | "danger" | "outline";
  size?: "lg" | "md" | "sm";
  pressed?: boolean;
  title?: string;
  className?: string;
};

/** Квадратная кнопка с одной иконкой внутри. С loading вместо иконки крутится лоадер. */
const IconButton = ({
  children,
  ariaLabel,
  onClick,
  disabled,
  loading,
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
    disabled={disabled || loading}
    onClick={onClick}
  >
    {loading ? <Loader /> : children}
  </button>
);

export default IconButton;
