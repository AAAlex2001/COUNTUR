"use client";

import ConfirmModal from "@/shared/ui/confirm-modal";
import LoadingArea from "@/shared/ui/loading-area";
import Pagination from "@/shared/ui/pagination";
import Panel from "@/shared/ui/panel";
import { useAdminReviews } from "../../model/use-admin-reviews";
import ReviewCard from "../review-card";
import ReviewEditor from "../review-editor";
import styles from "./style.module.scss";

type ReviewsManagerProps = {
  productId: number;
};

/** Отзывы товара в админке: правка, показ на сайте, удаление и листание страниц. */
const ReviewsManager = ({ productId }: ReviewsManagerProps) => {
  const reviews = useAdminReviews(productId);
  const { state } = reviews;

  return (
    <Panel title="Отзывы">
      {!state.loading && state.list.total === 0 && (
        <p className={styles.empty}>У товара пока нет отзывов.</p>
      )}

      <LoadingArea loading={state.loading}>
        <ul className={styles.list}>
          {state.list.reviews.map((review) => (
            <li className={styles.item} key={review.id}>
              {review.id === state.editingId ? (
                <ReviewEditor
                  fields={state.fields}
                  pending={state.pending}
                  onChange={reviews.changeFields}
                  onSave={reviews.saveEdit}
                  onCancel={reviews.closeEdit}
                />
              ) : (
                <ReviewCard
                  review={review}
                  pending={state.pending}
                  onEdit={() => reviews.openEdit(review)}
                  onToggle={() => reviews.togglePublished(review)}
                  onRemove={() => reviews.askRemove(review.id)}
                />
              )}
            </li>
          ))}
        </ul>
      </LoadingArea>

      <Pagination
        page={state.page}
        pages={reviews.pages}
        disabled={state.loading || state.pending}
        onChange={reviews.openPage}
      />

      <ConfirmModal
        open={state.removingId !== null}
        title="Удалить отзыв?"
        text="Отзыв пропадёт с сайта, вернуть его не получится."
        confirmLabel="Удалить"
        pending={state.pending}
        onConfirm={reviews.remove}
        onCancel={reviews.cancelRemove}
      />
    </Panel>
  );
};

export default ReviewsManager;
