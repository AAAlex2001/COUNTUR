"use client";

import cn from "classnames";
import { Stars, type ReviewList } from "@/entities/product";
import { formatDate } from "@/shared/lib/date";
import Pagination from "@/shared/ui/pagination";
import { useProductReviews } from "../../model/use-product-reviews";
import styles from "./style.module.scss";

type ProductReviewsProps = {
  slug: string;
  initial: ReviewList;
};

/** Список отзывов товара с листалкой страниц. */
const ProductReviews = ({ slug, initial }: ProductReviewsProps) => {
  const { reviews, page, pages, pending, error, openPage } = useProductReviews(slug, initial);

  if (reviews.length === 0) {
    return <p className={styles.empty}>Отзывов пока нет.</p>;
  }

  return (
    <div className={styles.reviews}>
      <ul className={cn(styles.list, pending && styles.pending)}>
        {reviews.map((review) => (
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

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <Pagination page={page} pages={pages} disabled={pending} onChange={openPage} />
    </div>
  );
};

export default ProductReviews;
