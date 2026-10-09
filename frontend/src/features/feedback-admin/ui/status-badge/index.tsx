import cn from "classnames";
import { FEEDBACK_STATUS_LABELS } from "../../lib/status";
import type { FeedbackStatus } from "../../model/types";
import styles from "./style.module.scss";

type StatusBadgeProps = {
  status: FeedbackStatus;
};

/** Плашка статуса обращения: ждёт ответа — оранжевая, отвечено — зелёная. */
const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={cn(styles.badge, styles[status])}>{FEEDBACK_STATUS_LABELS[status]}</span>
);

export default StatusBadge;
