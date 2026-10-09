import Link from "next/link";
import { adminFeedbackPath } from "@/shared/lib/admin-paths";
import { formatShortDate } from "@/shared/lib/date";
import type { FeedbackMessage } from "../../model/types";
import StatusBadge from "../status-badge";
import styles from "./style.module.scss";

type MessagesTableProps = {
  messages: FeedbackMessage[];
};

/** Список обращений. Строка целиком ведёт в карточку обращения. */
const MessagesTable = ({ messages }: MessagesTableProps) => (
  <ul className={styles.table}>
    {messages.map((message) => (
      <li key={message.id}>
        <Link className={styles.row} href={adminFeedbackPath(message.id)}>
          <span className={styles.info}>
            <span className={styles.subject}>{message.subject}</span>
            <span className={styles.meta}>
              {message.name} · {message.email}
            </span>
          </span>

          <span className={styles.preview}>{message.message}</span>

          <span className={styles.side}>
            <StatusBadge status={message.status} />
            <span className={styles.date}>{formatShortDate(message.created_at)}</span>
          </span>
        </Link>
      </li>
    ))}
  </ul>
);

export default MessagesTable;
