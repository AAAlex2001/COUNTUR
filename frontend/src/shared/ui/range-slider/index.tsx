import cn from "classnames";
import type { CSSProperties } from "react";
import styles from "./style.module.scss";

export type Range = [low: number, high: number];

type RangeSliderProps = {
  min: number;
  max: number;
  value: Range;
  onChange: (value: Range) => void;
  onCommit: () => void;
  step?: number;
  className?: string;
};

/** Ползунок диапазона с двумя ручками. onCommit срабатывает, когда ручку отпустили. */
const RangeSlider = ({
  min,
  max,
  value,
  onChange,
  onCommit,
  step = 1,
  className,
}: RangeSliderProps) => {
  const [low, high] = value;
  const percent = (point: number) => `${((point - min) / (max - min)) * 100}%`;
  const fill = { "--from": percent(low), "--to": percent(high) } as CSSProperties;

  return (
    <div className={cn(styles.slider, className)} style={fill}>
      <div className={styles.track}>
        <div className={styles.fill} />
      </div>

      <input
        className={styles.thumb}
        type="range"
        min={min}
        max={max}
        step={step}
        value={low}
        aria-label="От"
        onChange={(event) => onChange([Math.min(Number(event.target.value), high), high])}
        onPointerUp={onCommit}
        onKeyUp={onCommit}
      />
      <input
        className={styles.thumb}
        type="range"
        min={min}
        max={max}
        step={step}
        value={high}
        aria-label="До"
        onChange={(event) => onChange([low, Math.max(Number(event.target.value), low)])}
        onPointerUp={onCommit}
        onKeyUp={onCommit}
      />
    </div>
  );
};

export default RangeSlider;
