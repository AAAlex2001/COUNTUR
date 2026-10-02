"use client";

import { Stars, type ReviewList } from "@/entities/product";
import { formatDate } from "@/shared/lib/date";
import LoadingArea from "@/shared/ui/loading-area";
import Pagination from "@/shared/ui/pagination";
import { useProductReviews } from "../../model/use-product-reviews";
import styles from "./style.module.scss";

type ProductReviewsProps = {
  slug: string;
  initial: ReviewList;
};

/** Список отзывов товара с листалкой страниц. */
const ProductReviews = ({ slug, initial }: ProductReviewsProps) => {
  const { state, pages, openPage } = useProductReviews(slug, initial);

  if (state.list.reviews.length === 0) {
    return <p className={styles.empty}>Отзывов пока нет.</p>;
  }

  return (
    <LoadingArea className={styles.reviews} loading={state.pending}>
      <ul className={styles.list}>
        {state.list.reviews.map((review) => (
          <li className={styles.review} key={review.id}>
            <div className={styles.head}>
              <span className={styles.author}>{review.author_name}</span>
              <Stars rating={review.rating} />
              <time className={styles.date} dateTime={review.created_at}>
                {formatDate(review.created_at)}
              </time>
            </div>
            <p className={styles.text}>{review.text}</p>
          </li>
        ))}
      </ul>

      <Pagination page={state.page} pages={pages} disabled={state.pending} onChange={openPage} />
    </LoadingArea>
  );
};

export default ProductReviews;
