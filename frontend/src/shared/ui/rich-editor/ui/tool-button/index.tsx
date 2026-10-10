import type { ReactNode } from "react";
import styles from "./style.module.scss";

type ToolButtonProps = {
  label: string;
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
};

/** Кнопка панели редактора. Включённое оформление подсвечено. */
const ToolButton = ({ label, children, onClick, active, disabled }: ToolButtonProps) => (
  <button
    type="button"
    className={styles.button}
    aria-label={label}
    aria-pressed={active}
    title={label}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export default ToolButton;
