import cn from "classnames";
import type { CSSProperties } from "react";
import { plural } from "@/shared/lib/text";
import styles from "./style.module.scss";

type StarsProps = {
  rating: number;
  size?: "md" | "sm";
};

/** Пять звёзд, закрашенных на долю оценки. */
export const Stars = ({ rating, size = "md" }: StarsProps) => (
  <span
    className={cn(styles.stars, size === "sm" && styles.small)}
    style={{ "--fill": `${(rating / 5) * 100}%` } as CSSProperties}
    role="img"
    aria-label={`Оценка ${rating} из 5`}
  >
    ★★★★★
  </span>
);

type RatingProps = {
  rating: string | null;
  reviewsCount: number;
  compact?: boolean;
};

/** Звёзды и подпись «4.9 · 48 отзывов». compact — короткая подпись для карточки. */
const Rating = ({ rating, reviewsCount, compact }: RatingProps) => {
  const reviews = plural(reviewsCount, ["отзыв", "отзыва", "отзывов"]);
  const summary = compact ? `${rating} · ${reviewsCount}` : `${rating} · ${reviewsCount} ${reviews}`;

  return (
    <div className={cn(styles.rating, compact && styles.compact)}>
      <Stars rating={Number(rating)} size={compact ? "sm" : "md"} />
      <span className={styles.summary}>{rating === null ? "Нет отзывов" : summary}</span>
    </div>
  );
};

export default Rating;
