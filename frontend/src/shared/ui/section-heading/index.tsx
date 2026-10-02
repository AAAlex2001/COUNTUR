import Button from "@/shared/ui/button";
import styles from "./style.module.scss";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  actionLabel?: string;
  actionHref?: string;
};

/** Шапка блока на главной: надстрочник, заголовок и кнопка «смотреть всё» справа. */
const SectionHeading = ({ eyebrow, title, actionLabel, actionHref }: SectionHeadingProps) => (
  <div className={styles.heading}>
    <div className={styles.titles}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.title}>{title}</h2>
    </div>

    {actionLabel && actionHref && (
      <Button variant="ghost" href={actionHref}>
        {actionLabel} →
      </Button>
    )}
  </div>
);

export default SectionHeading;
