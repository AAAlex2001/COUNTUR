import cn from "classnames";
import styles from "./style.module.scss";

type StepsProps = {
  steps: string[];
  current: number;
};

/** Полоса шагов «01 Контакты — 02 Доставка…». Шаги до current включительно подсвечены. */
const Steps = ({ steps, current }: StepsProps) => (
  <ol className={styles.steps}>
    {steps.map((label, index) => (
      <li key={label} className={cn(styles.step, index <= current && styles.active)}>
        {String(index + 1).padStart(2, "0")} {label}
      </li>
    ))}
  </ol>
);

export default Steps;
