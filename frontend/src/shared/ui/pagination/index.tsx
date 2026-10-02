import cn from "classnames";
import styles from "./style.module.scss";

type PaginationProps = {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
};

/** Листалка «Страница N из X» со стрелками. Не показывается, если страница одна. */
const Pagination = ({ page, pages, onChange, disabled, className }: PaginationProps) => {
  if (pages <= 1) return null;

  return (
    <nav className={cn(styles.pagination, className)} aria-label="Страницы">
      <button
        type="button"
        className={styles.arrow}
        aria-label="Предыдущая страница"
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>

      <span className={styles.label}>
        Страница {page} из {pages}
      </span>

      <button
        type="button"
        className={styles.arrow}
        aria-label="Следующая страница"
        disabled={disabled || page >= pages}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </nav>
  );
};

export default Pagination;
