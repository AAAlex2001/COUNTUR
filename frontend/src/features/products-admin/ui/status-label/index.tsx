import cn from "classnames";
import type { PublicationStatus } from "../../model/types";
import styles from "./style.module.scss";

const STATUS_LABELS: Record<PublicationStatus, string> = {
  draft: "Черновик",
  published: "Опубликован",
  unpublished: "Снят с публикации",
};

type StatusLabelProps = {
  status: PublicationStatus;
};

/** Подпись о публикации товара. Опубликованный выделен цветом. */
const StatusLabel = ({ status }: StatusLabelProps) => (
  <span className={cn(styles.status, status === "published" && styles.published)}>
    {STATUS_LABELS[status]}
  </span>
);

export default StatusLabel;
