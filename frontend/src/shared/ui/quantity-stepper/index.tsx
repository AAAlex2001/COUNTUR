import cn from "classnames";
import styles from "./style.module.scss";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "md" | "sm";
  disabled?: boolean;
  className?: string;
};

/** Количество товара с кнопками «−» и «+». */
const QuantityStepper = ({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  disabled,
  className,
}: QuantityStepperProps) => (
  <div className={cn(styles.stepper, size === "sm" && styles.small, className)}>
    <button
      type="button"
      className={styles.minus}
      aria-label="Уменьшить количество"
      disabled={disabled || value <= min}
      onClick={() => onChange(value - 1)}
    >
      −
    </button>

    <output className={styles.value} aria-label="Количество">
      {value}
    </output>

    <button
      type="button"
      className={styles.plus}
      aria-label="Увеличить количество"
      disabled={disabled || value >= max}
      onClick={() => onChange(value + 1)}
    >
      +
    </button>
  </div>
);

export default QuantityStepper;
