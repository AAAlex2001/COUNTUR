import cn from "classnames";
import styles from "./style.module.scss";

type SegmentedOption = {
  value: string;
  label: string;
};

type SegmentedProps = {
  value: string;
  options: SegmentedOption[];
  onChange: (value: string) => void;
};

/** Переключатель из нескольких кнопок в одной рамке, выбрана всегда одна. */
const Segmented = ({ value, options, onChange }: SegmentedProps) => (
  <div className={styles.segmented} role="tablist">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        role="tab"
        aria-selected={option.value === value}
        className={cn(styles.option, option.value === value && styles.active)}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default Segmented;
