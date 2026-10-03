import cn from "classnames";
import Link from "next/link";
import type { ReactNode } from "react";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit";
  variant?: "primary" | "outline" | "ghost";
  size?: "md" | "sm";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  href?: string;
};

/**
 * Кнопка с текстом. С href рендерится ссылкой, с loading показывает лоадер и не нажимается.
 * Вариант ghost — без фона, для второстепенных действий вроде «Все категории» и «Сбросить».
 */
const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled,
  loading,
  onClick,
  className,
  href,
}: ButtonProps) => {
  const classNames = cn(
    styles.button,
    styles[variant],
    size === "sm" && styles.small,
    loading && styles.loading,
    className,
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classNames} disabled={disabled || loading} onClick={onClick}>
      {loading ? <Loader /> : children}
    </button>
  );
};

export default Button;
