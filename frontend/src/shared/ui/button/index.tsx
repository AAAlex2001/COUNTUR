import cn from "classnames";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit";
  variant?: "primary" | "outline";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  href?: string;
};

/** Кнопка с текстом. С href рендерится ссылкой. */
const Button = ({
  children,
  type = "button",
  variant = "primary",
  disabled,
  onClick,
  className,
  href,
}: ButtonProps) => {
  const classNames = cn(styles.button, styles[variant], className);

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classNames} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
