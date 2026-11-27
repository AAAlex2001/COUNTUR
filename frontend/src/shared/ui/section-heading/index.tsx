import Button from "@/shared/ui/button";
import { ArrowRightIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

type SectionHeadingProps = {
  eyebrow?: string;
  as?: "h1" | "h2";
  title: string;
  actionLabel?: string;
  actionHref?: string;
};

/** Заголовок раздела. */
const SectionHeading = ({ as: Heading = "h2", eyebrow, title, actionLabel, actionHref }: SectionHeadingProps) => (
  <div className={styles.heading}>
    <div className={styles.titles}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Heading className={styles.title}>{title}</Heading>
    </div>

    {actionLabel && actionHref && (
      <Button variant="ghost" href={actionHref}>
        {actionLabel}
        <ArrowRightIcon />
      </Button>
    )}
  </div>
);

export default SectionHeading;
