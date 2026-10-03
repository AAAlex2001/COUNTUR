import cn from "classnames";
import styles from "./style.module.scss";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
  disabled?: boolean;
};

/** Переключатель «включено — выключено». */
const Switch = ({ checked, onChange, ariaLabel, disabled }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    className={cn(styles.switch, checked && styles.on)}
    disabled={disabled}
    onClick={() => onChange(!checked)}
  >
    <span className={styles.knob} />
  </button>
);

export default Switch;
