import cn from "classnames";
import IconButton from "@/shared/ui/icon-button";
import { ArrowRightIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

type PaginationProps = {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
};

/** Листалка «Страница N из X» со стрелками как у слайдера. Не показывается, если страница одна. */
const Pagination = ({ page, pages, onChange, disabled, className }: PaginationProps) => {
  if (pages <= 1) return null;

  return (
    <nav className={cn(styles.pagination, className)} aria-label="Страницы">
      <IconButton
        tone="outline"
        ariaLabel="Предыдущая страница"
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ArrowRightIcon className={styles.back} />
      </IconButton>

      <span className={styles.label}>
        Страница {page} из {pages}
      </span>

      <IconButton
        tone="outline"
        ariaLabel="Следующая страница"
        disabled={disabled || page >= pages}
        onClick={() => onChange(page + 1)}
      >
        <ArrowRightIcon />
      </IconButton>
    </nav>
  );
};

export default Pagination;
