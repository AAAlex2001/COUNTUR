import { Stars } from "@/entities/product";
import { formatDate } from "@/shared/lib/date";
import Button from "@/shared/ui/button";
import IconButton from "@/shared/ui/icon-button";
import { TrashIcon } from "@/shared/ui/icons";
import type { AdminReview } from "../../model/types";
import styles from "./style.module.scss";

type ReviewCardProps = {
  review: AdminReview;
  pending: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onRemove: () => void;
};

/** Отзыв в админке с кнопками «Изменить», «Скрыть» или «Показать» и удаления. */
const ReviewCard = ({ review, pending, onEdit, onToggle, onRemove }: ReviewCardProps) => (
  <div className={styles.review}>
    <div className={styles.head}>
      <span className={styles.author}>{review.author_name}</span>
      <Stars rating={review.rating} />
      <span className={styles.date}>{formatDate(review.created_at)}</span>
      {!review.is_published && <span className={styles.hidden}>Скрыт</span>}
    </div>

    <p className={styles.text}>{review.text}</p>

    <div className={styles.actions}>
      <Button variant="outline" disabled={pending} onClick={onEdit}>
        Изменить
      </Button>

      <Button variant="outline" disabled={pending} onClick={onToggle}>
        {review.is_published ? "Скрыть" : "Показать"}
      </Button>

      <IconButton
        tone="danger"
        ariaLabel={`Удалить отзыв: ${review.author_name}`}
        disabled={pending}
        onClick={onRemove}
      >
        <TrashIcon />
      </IconButton>
    </div>
  </div>
);

export default ReviewCard;
